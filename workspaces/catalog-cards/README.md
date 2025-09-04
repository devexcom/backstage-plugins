# Catalog Cards Plugin

A drop-in Backstage frontend plugin that transforms your catalog experience with rich card views, infinite scroll, and seamless table/cards view switching.

## 🚀 Features

### ✅ **Drop-in Integration**
- Zero backend changes required
- Reuses existing Catalog APIs and filters
- Preserves all search, filtering, and sorting functionality
- Seamless integration with existing CatalogPage

### ✅ **Rich Card Views**
- **Readable descriptions** with expand/collapse functionality
- **Key metadata display**: Owner, Type, System, Lifecycle, Tags
- **Quick actions**: Open Entity, TechDocs, Source, APIs, Star/Unstar
- **Smart badges**: TechDocs availability, API counts
- **Responsive design**: 1-4 columns based on viewport

### ✅ **Infinite Scroll & Performance**
- **Virtualization** for datasets with 5k+ entities
- **Progressive loading** with intersection observer
- **Skeleton loading** states
- **Minimal API requests** with optimized field selection

### ✅ **View Toggle & Persistence**
- **Instant switching** between Table ↔ Cards
- **URL synchronization**: `?view=cards` for shareable links
- **User preference storage** via Backstage Storage API
- **Keyboard accessible** toggle controls

### ✅ **Enterprise Ready**
- **Accessibility compliant** with ARIA labels and keyboard navigation
- **Analytics integration** with view toggle and interaction tracking
- **Error boundaries** and graceful degradation
- **Responsive breakpoints** for mobile/tablet/desktop

## 📦 Installation

```bash
yarn add @devexcom/plugin-catalog-cards
```

## 🔧 Integration

### Basic Setup

Replace your existing catalog table with the enhanced cards component:

```typescript
// In your CatalogPage component
import { CatalogCardsContent } from '@devexcom/plugin-catalog-cards';

// Replace this:
// <CatalogTable />

// With this:
<CatalogCardsContent
  initialView="table"
  showViewToggle={true}
  pageSize={50}
  density="comfortable"
/>
```

### Advanced Integration

For full control, use individual components:

```typescript
import {
  CatalogViewToggle,
  CatalogCardGrid,
  useCatalogViewState,
  useInfiniteEntityList,
} from '@devexcom/plugin-catalog-cards';

function CustomCatalogPage() {
  const { view, setView } = useCatalogViewState('cards');
  const { entities, loading, hasNextPage, loadMore } = useInfiniteEntityList();

  return (
    <EntityListProvider>
      {/* Your existing search and filters */}
      <CatalogIndexPageFilters />
      
      {/* View toggle in toolbar */}
      <CatalogViewToggle view={view} onViewChange={setView} />
      
      {/* Conditional rendering */}
      {view === 'table' ? (
        <CatalogTable />
      ) : (
        <CatalogCardGrid
          entities={entities}
          loading={loading}
          hasNextPage={hasNextPage}
          onLoadMore={loadMore}
          density="comfortable"
          enableVirtualization={entities.length > 1000}
        />
      )}
    </EntityListProvider>
  );
}
```

## ⚙️ Configuration

### Component Props

#### `CatalogCardsContent`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialView` | `'table' \| 'cards'` | `'table'` | Initial view preference |
| `showViewToggle` | `boolean` | `true` | Whether to show the view toggle |
| `tableComponent` | `ComponentType` | `CatalogTable` | Custom table component |
| `pageSize` | `number` | `50` | Items per page for infinite scroll |
| `enableVirtualization` | `boolean` | `false` | Enable virtualization for large datasets |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | Card density setting |
| `expandDescriptionsDefault` | `boolean` | `false` | Show expanded descriptions by default |

#### `CatalogCardGrid`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entities` | `Entity[]` | `[]` | List of entities to display |
| `loading` | `boolean` | `false` | Loading state |
| `hasNextPage` | `boolean` | `false` | Whether more items can be loaded |
| `onLoadMore` | `() => void` | - | Callback to load more items |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | Card size |
| `enableVirtualization` | `boolean` | `false` | Enable virtualization |
| `quickActions` | `EntityQuickAction[]` | `[]` | Custom quick actions |

### URL Parameters

- `?view=table` - Show table view
- `?view=cards` - Show cards view

Parameters sync automatically with user interactions and persist via Storage API.

## 🎨 Customization

### Custom Quick Actions

Add custom actions to entity cards:

```typescript
const customActions: EntityQuickAction[] = [
  {
    id: 'deploy',
    label: 'Deploy',
    icon: DeployIcon,
    onClick: (entity) => deployEntity(entity),
    isVisible: (entity) => entity.spec?.type === 'service',
    isDisabled: (entity) => entity.spec?.lifecycle === 'deprecated',
  },
];

<CatalogCardGrid quickActions={customActions} />
```

### Custom Styling

Override styles using Material-UI's makeStyles:

```typescript
const useCustomStyles = makeStyles(theme => ({
  // Override card styles
  '& .MuiCard-root': {
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
}));
```

## 📊 Analytics Events

The plugin automatically tracks these events via `analyticsApiRef`:

- `catalog_view_toggle` - When users switch between table/cards
- `catalog_card_click` - When users click on cards
- `catalog_card_title_click` - When users click on entity titles
- `catalog_card_star_toggle` - When users star/unstar entities
- `catalog_cards_load` - When new pages are loaded
- `catalog_cards_error` - When API errors occur

## 🔧 Performance Optimization

### For Large Catalogs (1000+ entities)

```typescript
<CatalogCardsContent
  enableVirtualization={true}
  pageSize={100}
  density="compact"
/>
```

### Memory Optimization

The plugin automatically:
- **Requests minimal fields** from Catalog API
- **Reuses entity list context** between table/cards views
- **Implements pagination** to avoid loading all entities at once
- **Provides virtualization** for very large datasets

## 🧪 Testing

```bash
# Run tests
yarn test

# Run with coverage
yarn test --coverage

# Watch mode
yarn test --watch
```

## 🚀 Development

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Open http://localhost:3000
```

### Building

```bash
# Build the plugin
yarn build

# Run linting
yarn lint

# Type checking
yarn tsc:full
```

## 🔄 Migration Guide

### From CatalogTable

1. **Install the plugin**:
   ```bash
   yarn add @devexcom/plugin-catalog-cards
   ```

2. **Update your CatalogPage**:
   ```typescript
   // Before
   <CatalogTable />
   
   // After
   <CatalogCardsContent initialView="table" />
   ```

3. **No other changes needed** - all existing filters, search, and functionality work identically.

### Gradual Rollout

1. **Start with table as default**:
   ```typescript
   <CatalogCardsContent initialView="table" />
   ```

2. **Monitor analytics** for view toggle usage

3. **Switch to cards default** when ready:
   ```typescript
   <CatalogCardsContent initialView="cards" />
   ```

## 📈 Roadmap

### v1.1 (Planned)
- **Sort controls**: Name, Owner, Type, Recently updated, Most starred
- **Density toggle**: Compact/Comfortable view switching
- **Enhanced virtualization**: Masonry grid support
- **Improved accessibility**: Screen reader optimizations

### v1.2 (Future)
- **Bulk actions**: Multi-select with bulk operations
- **Custom card templates**: Configurable card layouts
- **Advanced filters**: Entity-specific filter panels
- **Export functionality**: CSV/JSON export support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

Apache-2.0

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/devexcom/backstage-plugins/issues)
- **Discussions**: [GitHub Discussions](https://github.com/devexcom/backstage-plugins/discussions)
- **Documentation**: [Plugin Docs](https://github.com/devexcom/backstage-plugins/tree/main/workspaces/analytics/catalog-cards)

## 🙏 Acknowledgments

- Built with [Backstage](https://backstage.io/)
- Uses [@backstage/plugin-catalog-react](https://www.npmjs.com/package/@backstage/plugin-catalog-react)
- Virtualization powered by [react-window](https://github.com/bvaughn/react-window)