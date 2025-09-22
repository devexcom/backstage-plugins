---
'@devexcom/plugin-search-backend-module-opensearch': patch
'@devexcom/plugin-search-opensearch': patch
---

Add OpenSearch authentication support and fix critical bugs

- Add production-ready authentication setup with admin:admin default credentials
- Fix dynamic_templates mapping configuration that prevented document indexing
- Update SearchResults component to use proper useSearch hook instead of render props
- Add comprehensive authentication documentation for both development and production
- Include indexing progress monitoring commands and timing expectations
- Resolve TypeScript compilation errors in frontend components
