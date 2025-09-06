#!/bin/bash

# Generate TypeScript declaration files for Backstage plugins
# This is a workaround for the "No declaration files found" issue in monorepos

echo "Generating TypeScript declaration files for Backstage plugins..."

# Create dist-types directory structure
mkdir -p dist-types/workspaces/catalog-cards/src

# Generate basic declaration files for catalog-cards plugin
cat > dist-types/workspaces/catalog-cards/src/index.d.ts << 'EOF'
export * from './plugin';
EOF

cat > dist-types/workspaces/catalog-cards/src/plugin.d.ts << 'EOF'
export declare const plugin: any;
export declare const CatalogCardsPage: any;
export declare const CatalogViewToggle: any; 
export declare const CatalogCardGrid: any;
EOF

echo "Declaration files generated successfully!"