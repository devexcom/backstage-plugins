// Mock useSearch hook for development
// This will be replaced by @backstage/plugin-search-react in production

export const useSearch = () => {
  return {
    term: '',
    setTerm: (_term: string) => {},
    filters: {} as Record<string, any>,
    setFilters: (_filters: Record<string, any>) => {},
    loading: false,
    error: undefined as { message: string } | undefined,
    results: [] as any[],
  };
};
