import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { z } from 'zod';
import { OpenSearchEngine } from './engine';
import { createWebhookRouter } from './router';

const OpenSearchAuthSchema = z.object({
  type: z.enum(['basic', 'aws', 'none']).default('none'),
  username: z.string().optional(),
  password: z.string().optional(),
  region: z.string().optional(),
});

const OpenSearchConfigSchema = z.object({
  endpoint: z.string(),
  auth: OpenSearchAuthSchema.optional(),
  indexPrefix: z.string().default('backstage'),
  batchSize: z.number().default(100),
  maxConcurrency: z.number().default(5),
  ssl: z
    .object({
      verifyHostname: z.boolean().default(true),
      ca: z.string().optional(),
    })
    .optional(),
});

export const searchModuleOpensearchEngine = createBackendModule({
  pluginId: 'search',
  moduleId: 'opensearch-engine',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        httpRouter: coreServices.httpRouter,
        searchEngine: searchEngineRegistryExtensionPoint,
      },
      async init({ config, logger, httpRouter, searchEngine }) {
        const opensearchConfig = config.getOptionalConfig('search.opensearch');

        if (!opensearchConfig) {
          logger.info(
            'OpenSearch search backend not configured - skipping initialization',
          );
          return;
        }

        // Validate configuration
        const options = OpenSearchConfigSchema.parse({
          endpoint: opensearchConfig.getString('endpoint'),
          auth: opensearchConfig.getOptionalConfig('auth')
            ? {
                type: opensearchConfig.getOptionalString('auth.type') || 'none',
                username: opensearchConfig.getOptionalString('auth.username'),
                password: opensearchConfig.getOptionalString('auth.password'),
                region: opensearchConfig.getOptionalString('auth.region'),
              }
            : undefined,
          indexPrefix:
            opensearchConfig.getOptionalString('indexPrefix') || 'backstage',
          batchSize: opensearchConfig.getOptionalNumber('batchSize') || 100,
          maxConcurrency:
            opensearchConfig.getOptionalNumber('maxConcurrency') || 5,
          ssl: opensearchConfig.getOptionalConfig('ssl')
            ? {
                verifyHostname:
                  opensearchConfig.getOptionalBoolean('ssl.verifyHostname') ??
                  true,
                ca: opensearchConfig.getOptionalString('ssl.ca'),
              }
            : undefined,
        });

        logger.info('Initializing OpenSearch search engine', {
          endpoint: options.endpoint,
          indexPrefix: options.indexPrefix,
        });

        // Create OpenSearch engine
        const engine = new OpenSearchEngine(options, logger);

        // Register the search engine
        searchEngine.setSearchEngine(engine);

        // Setup webhook endpoints for real-time indexing
        const webhookRouter = createWebhookRouter({
          searchEngine: engine,
          logger,
        });

        httpRouter.use(webhookRouter);

        logger.info('OpenSearch search engine initialized successfully');
      },
    });
  },
});
