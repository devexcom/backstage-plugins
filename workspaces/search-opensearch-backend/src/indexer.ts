import { Writable } from 'stream';
import { Client } from '@opensearch-project/opensearch';
import { LoggerService } from '@backstage/backend-plugin-api';
import { IndexableDocument } from './types';

export class OpenSearchIndexer extends Writable {
  private documents: IndexableDocument[] = [];
  private readonly batchSize = 100;

  constructor(
    private readonly client: Client,
    private readonly indexName: string,
    private readonly logger: LoggerService,
  ) {
    super({ objectMode: true });
  }

  async _write(
    document: IndexableDocument,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): Promise<void> {
    try {
      this.documents.push(document);

      if (this.documents.length >= this.batchSize) {
        await this.flush();
      }

      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async _final(callback: (error?: Error | null) => void): Promise<void> {
    try {
      if (this.documents.length > 0) {
        await this.flush();
      }
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async flush(): Promise<void> {
    if (this.documents.length === 0) return;

    const startTime = Date.now();
    const docsToIndex = [...this.documents];
    this.documents = [];

    try {
      // Ensure index exists with proper mapping
      await this.ensureIndex();

      // Prepare bulk operations
      const body = [];
      for (const doc of docsToIndex) {
        // Create unique document ID
        const docId = this.generateDocumentId(doc);

        body.push({ index: { _index: this.indexName, _id: docId } });
        body.push({
          ...doc,
          '@timestamp': new Date().toISOString(),
          'indexed_at': new Date().toISOString(),
        });
      }

      const response = await this.client.bulk({ body });

      if (response.body.errors) {
        const errorItems = response.body.items.filter(
          (item: any) =>
            item.index?.error || item.create?.error || item.update?.error,
        );
        this.logger.warn('Some documents failed to index', {
          total: docsToIndex.length,
          errors: errorItems.length,
          errorSample: errorItems.slice(0, 3),
        });
      } else {
        this.logger.info('Documents indexed successfully', {
          count: docsToIndex.length,
          index: this.indexName,
          duration: Date.now() - startTime,
        });
      }
    } catch (error) {
      this.logger.error('Failed to index documents', {
        count: docsToIndex.length,
        index: this.indexName,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }

  private async ensureIndex(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({
        index: this.indexName,
      });

      if (!exists.body) {
        await this.client.indices.create({
          index: this.indexName,
          body: {
            settings: {
              number_of_shards: 1,
              number_of_replicas: 0,
              analysis: {
                analyzer: {
                  search_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'stop', 'snowball', 'word_delimiter'],
                  },
                },
                filter: {
                  word_delimiter: {
                    type: 'word_delimiter',
                    generate_word_parts: true,
                    generate_number_parts: true,
                    catenate_words: true,
                  },
                },
              },
            },
            mappings: {
              properties: {
                'title': {
                  type: 'text',
                  analyzer: 'search_analyzer',
                  fields: {
                    keyword: { type: 'keyword' },
                  },
                },
                'text': {
                  type: 'text',
                  analyzer: 'search_analyzer',
                },
                'location': {
                  type: 'keyword',
                },
                '@timestamp': {
                  type: 'date',
                },
                'indexed_at': {
                  type: 'date',
                },
                'authorization': {
                  properties: {
                    resourceRef: { type: 'keyword' },
                  },
                },
              },
              // Dynamic templates for flexible document types
              dynamic_templates: [
                {
                  strings: {
                    match_mapping_type: 'string',
                    mapping: {
                      type: 'text',
                      fields: {
                        keyword: { type: 'keyword', ignore_above: 256 },
                      },
                    },
                  },
                },
              ],
            },
          },
        });

        this.logger.info('Created OpenSearch index', { index: this.indexName });
      }
    } catch (error) {
      this.logger.error('Failed to ensure index exists', {
        index: this.indexName,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private generateDocumentId(doc: IndexableDocument): string {
    // Create stable document ID based on location and type
    const location = doc.location || doc.title;
    return Buffer.from(location).toString('base64url');
  }
}
