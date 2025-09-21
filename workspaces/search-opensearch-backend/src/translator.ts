// Query translator for OpenSearch
import { SearchQuery } from '@backstage/plugin-search-common';

export class OpenSearchQueryTranslator {
  translateQuery(query: SearchQuery): any {
    const { term, filters = {} } = query;

    // Build the base query
    const mustClauses = [];
    const filterClauses: any[] = [];

    // Handle search term
    if (term && term.trim()) {
      const searchTerm = term.trim();

      // Check if it's a phrase search (quoted)
      if (searchTerm.startsWith('"') && searchTerm.endsWith('"')) {
        const phrase = searchTerm.slice(1, -1);
        mustClauses.push({
          multi_match: {
            query: phrase,
            type: 'phrase',
            fields: ['title^3', 'text'],
          },
        });
      } else {
        // Multi-field search with boosting
        mustClauses.push({
          bool: {
            should: [
              // Exact title match (highest boost)
              {
                match: {
                  'title.keyword': {
                    query: searchTerm,
                    boost: 5,
                  },
                },
              },
              // Title prefix match
              {
                prefix: {
                  'title.keyword': {
                    value: searchTerm.toLowerCase(),
                    boost: 3,
                  },
                },
              },
              // Title fuzzy match
              {
                match: {
                  title: {
                    query: searchTerm,
                    fuzziness: 'AUTO',
                    boost: 2,
                  },
                },
              },
              // Content match
              {
                match: {
                  text: {
                    query: searchTerm,
                    fuzziness: 'AUTO',
                    boost: 1,
                  },
                },
              },
              // Wildcard for partial matches
              {
                wildcard: {
                  'title.keyword': {
                    value: `*${searchTerm.toLowerCase()}*`,
                    boost: 1.5,
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        });
      }
    }

    // Always exclude Location entities
    filterClauses.push({
      bool: {
        must_not: {
          term: {
            'kind.keyword': 'Location',
          },
        },
      },
    });

    // Handle filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (Array.isArray(value)) {
          // Multiple values - use terms query
          filterClauses.push({
            terms: {
              [`${key}.keyword`]: value,
            },
          });
        } else {
          // Single value - use term query
          filterClauses.push({
            term: {
              [`${key}.keyword`]: value,
            },
          });
        }
      }
    });

    // Build final query
    let esQuery;

    if (mustClauses.length === 0 && filterClauses.length === 0) {
      // No search term or filters - match all
      esQuery = { match_all: {} };
    } else if (mustClauses.length === 0 && filterClauses.length > 0) {
      // Only filters, no search term - use filtered match_all
      esQuery = {
        bool: {
          must: [{ match_all: {} }],
          filter: filterClauses,
        },
      };
    } else {
      esQuery = {
        bool: {
          ...(mustClauses.length > 0 && { must: mustClauses }),
          ...(filterClauses.length > 0 && { filter: filterClauses }),
        },
      };
    }

    return esQuery;
  }
}
