import { Client } from '@opensearch-project/opensearch';
import { Writable } from 'stream';
import { LoggerService } from '@backstage/backend-plugin-api';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { QueryRequestOptions } from '@backstage/plugin-search-common';
import { SearchQuery } from '@backstage/plugin-search-common';
import { OpenSearchOptions, SearchResult } from './types';
import { OpenSearchIndexer } from './indexer';
import { OpenSearchQueryTranslator } from './translator';

export class OpenSearchEngine implements SearchEngine {
  private translator: OpenSearchQueryTranslator;
  private readonly client: Client;
  private readonly indexPrefix: string;
  private readonly logger: LoggerService;

  constructor(options: OpenSearchOptions, logger: LoggerService) {
    this.logger = logger;
    this.indexPrefix = options.indexPrefix || 'backstage';

    // Initialize OpenSearch client
    this.client = new Client({
      node: options.endpoint,
      auth:
        options.auth?.type === 'basic'
          ? {
              username: options.auth.username!,
              password: options.auth.password!,
            }
          : undefined,
      ssl: {
        rejectUnauthorized: options.ssl?.verifyHostname !== false,
        ca: options.ssl?.ca,
      },
    });

    this.translator = new OpenSearchQueryTranslator();
  }

  private decodePageCursor(pageCursor?: string): { page: number } {
    if (!pageCursor) {
      return { page: 0 };
    }
    const page = Number(Buffer.from(pageCursor, 'base64').toString('utf-8'));
    return { page: isNaN(page) ? 0 : page };
  }

  private encodePageCursor({ page }: { page: number }): string {
    return Buffer.from(`${page}`, 'utf-8').toString('base64');
  }

  setTranslator(): void {
    // OpenSearch uses its own query translator
  }

  async getIndexer(type: string): Promise<Writable> {
    const indexName = `${this.indexPrefix}-${type}`;
    return new OpenSearchIndexer(this.client, indexName, this.logger);
  }

  async query(
    query: SearchQuery,
    _options?: QueryRequestOptions,
  ): Promise<any> {
    const startTime = Date.now();

    try {
      this.logger.info('Search query received', {
        term: query.term,
        filters: query.filters,
        pageLimit: query.pageLimit,
        pageCursor: query.pageCursor,
      });

      const translatedQuery = this.translator.translateQuery(query);
      this.logger.info('Translated OpenSearch query', {
        translatedQuery: JSON.stringify(translatedQuery, null, 2),
      });
      const indices = [`${this.indexPrefix}-*`];

      const { page } = this.decodePageCursor(query.pageCursor);
      const pageSize = query.pageLimit || 25;
      const fromOffset = page * pageSize;

      this.logger.info('Pagination params', {
        pageCursor: query.pageCursor,
        page,
        pageSize,
        fromOffset,
      });

      const searchParams = {
        index: indices.join(','),
        body: {
          query: translatedQuery,
          highlight: {
            fields: {
              'title': { number_of_fragments: 0 },
              'text': { fragment_size: 150, number_of_fragments: 3 },
              'title.keyword': { number_of_fragments: 0 },
            },
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            require_field_match: false,
          },
          from: fromOffset,
          size: pageSize,
          sort: [{ _score: { order: 'desc' } }],
          aggs: {
            kinds: {
              terms: {
                field: 'kind.keyword',
                size: 20,
                missing: 'Unknown',
              },
            },
            lifecycles: {
              terms: {
                field: 'lifecycle.keyword',
                size: 10,
                missing: 'N/A',
              },
            },
            namespaces: {
              terms: {
                field: 'namespace.keyword',
                size: 20,
                missing: 'default',
              },
            },
            owners: {
              terms: {
                field: 'owner.keyword',
                size: 20,
                missing: 'N/A',
              },
            },
          },
        },
      };

      const response = await this.client.search(searchParams);
      const duration = Date.now() - startTime;

      this.logger.info('OpenSearch query completed', {
        query: query.term,
        duration,
        total: response.body.hits.total.value,
        indices: indices.length,
      });

      const results: SearchResult[] = response.body.hits.hits
        .filter((hit: any) => hit._source && hit._source.title) // Filter out documents without title
        .filter((hit: any) => hit._source.kind !== 'Location') // Exclude Location entities
        .map((hit: any) => {
          const document = {
            title: hit._source.title || 'Untitled',
            text: hit._source.text || hit._source.title || '',
            location: hit._source.location || hit._source.url || '#',
            ...hit._source, // Include all other fields
          };

          return {
            type: hit._index.replace(`${this.indexPrefix}-`, ''),
            document,
            highlight: hit.highlight || {},
            rank: hit._score || 0,
          };
        });

      // Calculate next page cursor
      const totalHits = response.body.hits.total.value;
      const hasNextPage = totalHits > (page + 1) * pageSize;
      const hasPreviousPage = page > 0;

      const nextPageCursor = hasNextPage
        ? this.encodePageCursor({ page: page + 1 })
        : undefined;

      // Extract aggregation data for faceted search
      const aggregations = response.body.aggregations || {};
      const facets = {
        kinds:
          aggregations.kinds?.buckets?.map((bucket: any) => ({
            value: bucket.key,
            count: bucket.doc_count,
          })) || [],
        lifecycles:
          aggregations.lifecycles?.buckets?.map((bucket: any) => ({
            value: bucket.key,
            count: bucket.doc_count,
          })) || [],
        namespaces:
          aggregations.namespaces?.buckets?.map((bucket: any) => ({
            value: bucket.key,
            count: bucket.doc_count,
          })) || [],
        owners:
          aggregations.owners?.buckets?.map((bucket: any) => ({
            value: bucket.key,
            count: bucket.doc_count,
          })) || [],
      };

      return {
        results,
        nextPageCursor,
        previousPageCursor: hasPreviousPage
          ? this.encodePageCursor({ page: page - 1 })
          : undefined,
        facets,
      };
    } catch (error) {
      this.logger.error('OpenSearch query failed', {
        term: query.term,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }
}
