export interface SearchPageProps {
  title?: string;
  subtitle?: string;
  noResultsComponent?: React.ComponentType;
}

export interface SearchBarProps {
  placeholder?: string;
  showFilters?: boolean;
  autoFocus?: boolean;
}

export interface SearchFilter {
  name: string;
  label: string;
  type: 'select' | 'multiselect' | 'text';
  options?: { value: string; label: string; count?: number }[];
  value?: string | string[];
}

export interface SearchFacet {
  field: string;
  label: string;
  buckets: Array<{
    key: string;
    count: number;
  }>;
}

export interface SearchResultItem {
  type: string;
  document: {
    title: string;
    text: string;
    location: string;
    [key: string]: any;
  };
  highlight?: Record<string, string[]>;
  rank?: number;
}

export interface SearchState {
  query: string;
  filters: Record<string, string | string[]>;
  results: SearchResultItem[];
  facets: SearchFacet[];
  loading: boolean;
  error?: string;
  total: number;
  page: number;
  hasMore: boolean;
}
