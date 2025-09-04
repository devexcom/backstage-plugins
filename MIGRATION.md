# Repository Structure Migration

This document outlines the migration from nested workspace organization to a flat plugin structure.

## Before (Nested Structure)

```
workspaces/
├── analytics/
│   ├── linkedin-learning-card/
│   └── catalog-cards/
├── monitoring/
├── security/
├── data/
└── scaffolder-actions/
```

## After (Flat Structure)

```
workspaces/
├── catalog-cards/           # Direct plugin directory
├── linkedin-learning-card/  # Direct plugin directory  
└── [future-plugins]/       # Each plugin gets its own directory
```

## Changes Made

### 1. **Directory Structure**
- Moved plugins from `workspaces/analytics/[plugin]` to `workspaces/[plugin]`
- Removed empty category directories (`analytics`, `monitoring`, etc.)
- Each plugin now has its own root-level directory under `workspaces/`

### 2. **Updated Scripts**
- **create-plugin.sh**: Simplified to create plugins directly under `workspaces/`
  - Old: `./scripts/create-plugin.sh -w analytics -n my-plugin`
  - New: `./scripts/create-plugin.sh -n my-plugin`

### 3. **Updated Documentation**
- **README.md**: Updated repository structure documentation
- **getting-started.md**: Updated examples and workspace references
- **Package.json files**: Updated repository directory paths

### 4. **Package Configurations**
- Updated `repository.directory` in package.json files:
  - From: `workspaces/analytics/catalog-cards`
  - To: `workspaces/catalog-cards`

## Benefits of New Structure

### **Simplified Organization**
- **Easier navigation**: Plugins are directly under `workspaces/`
- **Less nesting**: No need to navigate through category folders
- **Clear naming**: Plugin names are self-descriptive

### **Better Scalability**
- **No artificial categorization**: Plugins aren't forced into categories
- **Flexible naming**: Plugin names can indicate their purpose naturally
- **Independent development**: Each plugin stands alone

### **Improved Developer Experience**
- **Simpler commands**: `yarn workspace catalog-cards build`
- **Direct access**: `cd workspaces/my-plugin`
- **Clear structure**: Obvious where each plugin lives

## Migration Steps Completed

1. ✅ Moved existing plugins to new structure
2. ✅ Updated create-plugin.sh script
3. ✅ Updated all documentation
4. ✅ Fixed package.json repository paths
5. ✅ Verified workspace configuration still works

## Usage Examples

### Creating New Plugins
```bash
# Create frontend plugin
./scripts/create-plugin.sh -n my-awesome-plugin

# Create backend plugin  
./scripts/create-plugin.sh -n my-backend -t backend

# Create scaffolder action
./scripts/create-plugin.sh -n my-action -t scaffolder-action
```

### Working with Plugins
```bash
# Build specific plugin
yarn workspace catalog-cards build

# Test specific plugin
yarn workspace linkedin-learning-card test

# Start development
cd workspaces/my-plugin && yarn start
```

### Publishing
```bash
# Create changeset for plugin
cd workspaces/my-plugin
yarn changeset

# Packages are still published as @devexcom/plugin-name
```

The migration maintains full backward compatibility with existing CI/CD pipelines and publishing workflows while providing a cleaner, more intuitive structure for plugin development.