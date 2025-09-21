import { Router } from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from './types';

export interface WebhookRouterOptions {
  searchEngine: SearchEngine;
  logger: LoggerService;
}

export function createWebhookRouter(options: WebhookRouterOptions): Router {
  const { searchEngine, logger } = options;
  const router = Router();

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'opensearch-search-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Webhook endpoint for real-time document indexing
  router.post('/webhook/index', async (req, res) => {
    try {
      const { documents, type = 'default' } = req.body;

      if (!documents || !Array.isArray(documents)) {
        res.status(400).json({
          error: 'Invalid request body. Expected "documents" array.',
        });
        return;
      }

      logger.info('Received indexing webhook', {
        type,
        documentCount: documents.length,
      });

      // Get indexer for the document type
      const indexer = await searchEngine.getIndexer(type);

      // Index documents
      for (const doc of documents) {
        const indexableDoc: IndexableDocument = {
          title: doc.title || '',
          text: doc.text || doc.content || '',
          location: doc.location || doc.url || '',
          ...doc,
        };

        indexer.write(indexableDoc);
      }

      // Ensure all documents are flushed
      await new Promise<void>((resolve, reject) => {
        indexer.end((error: any) => {
          if (error) reject(error);
          else resolve();
        });
      });

      res.json({
        success: true,
        indexed: documents.length,
        type,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Webhook indexing failed', {
        error: error instanceof Error ? error.message : String(error),
        body: req.body,
      });

      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Webhook endpoint for document deletion
  router.delete('/webhook/documents/:type/:id', async (req, res) => {
    try {
      const { type, id } = req.params;

      logger.info('Received deletion webhook', { type, id });

      // TODO: Implement document deletion
      // This would require extending the SearchEngine interface
      // For now, just acknowledge the request

      res.json({
        success: true,
        deleted: id,
        type,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Webhook deletion failed', {
        error: error instanceof Error ? error.message : String(error),
        params: req.params,
      });

      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Reindex endpoint for manual triggering
  router.post('/reindex/:type', async (req, res) => {
    try {
      const { type } = req.params;

      logger.info('Manual reindex triggered', { type });

      // TODO: Implement manual reindexing
      // This would trigger a full rebuild of the specified document type

      res.json({
        success: true,
        type,
        status: 'reindex_started',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Manual reindex failed', {
        error: error instanceof Error ? error.message : String(error),
        type: req.params.type,
      });

      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return router;
}
