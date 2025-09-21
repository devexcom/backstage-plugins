export interface Config {
  search?: {
    opensearch?: {
      /**
       * OpenSearch endpoint URL
       * @visibility backend
       */
      endpoint: string;

      /**
       * Authentication configuration
       * @visibility backend
       */
      auth?: {
        /**
         * Authentication type
         * @visibility backend
         */
        type?: 'basic' | 'aws' | 'none';

        /**
         * Username for basic auth
         * @visibility secret
         */
        username?: string;

        /**
         * Password for basic auth
         * @visibility secret
         */
        password?: string;

        /**
         * AWS region for AWS auth
         * @visibility backend
         */
        region?: string;
      };

      /**
       * Index prefix for all Backstage indices
       * @default "backstage"
       * @visibility backend
       */
      indexPrefix?: string;

      /**
       * Batch size for bulk operations
       * @default 100
       * @visibility backend
       */
      batchSize?: number;

      /**
       * Maximum concurrent operations
       * @default 5
       * @visibility backend
       */
      maxConcurrency?: number;

      /**
       * SSL configuration
       * @visibility backend
       */
      ssl?: {
        /**
         * Verify hostname in SSL certificates
         * @default true
         * @visibility backend
         */
        verifyHostname?: boolean;

        /**
         * Custom CA certificate
         * @visibility backend
         */
        ca?: string;
      };
    };
  };
}
