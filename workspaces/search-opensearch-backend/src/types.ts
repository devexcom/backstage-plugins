export interface OpenSearchAuth {
  type: 'basic' | 'aws' | 'none';
  username?: string;
  password?: string;
  region?: string;
}

export interface OpenSearchOptions {
  endpoint: string;
  auth?: OpenSearchAuth;
  indexPrefix?: string;
  batchSize?: number;
  maxConcurrency?: number;
  ssl?: {
    verifyHostname?: boolean;
    ca?: string;
  };
}

export interface OpenSearchConfig {
  search: {
    opensearch: OpenSearchOptions;
  };
}

export interface SearchDocument {
  title: string;
  text: string;
  location: string;
  [key: string]: any;
}

export interface IndexableDocument extends SearchDocument {
  authorization?: {
    resourceRef: string;
  };
}

export interface SearchQuery {
  term: string;
  types?: string[];
  filters?: Record<string, any>;
  pageLimit?: number;
  pageCursor?: string;
}

export interface SearchResult {
  type: string;
  document: SearchDocument;
  highlight?: Record<string, string[]>;
  rank?: number;
}
