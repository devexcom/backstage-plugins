#!/bin/bash

# Build only plugins that have changes
echo "Detecting changed plugins..."

# Get list of changed files in workspaces directory
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD | grep "^workspaces/" || true)

if [ -z "$CHANGED_FILES" ]; then
    echo "No changes detected in workspaces directory"
    exit 0
fi

echo "Changed files:"
echo "$CHANGED_FILES"

# Extract changed plugin directories
CHANGED_PLUGINS=""
for file in $CHANGED_FILES; do
    if [[ $file =~ ^workspaces/([^/]+)/ ]]; then
        plugin_dir="${BASH_REMATCH[1]}"
        if [[ ! " $CHANGED_PLUGINS " =~ " $plugin_dir " ]]; then
            CHANGED_PLUGINS="$CHANGED_PLUGINS $plugin_dir"
        fi
    fi
done

if [ -z "$CHANGED_PLUGINS" ]; then
    echo "No plugin changes detected"
    exit 0
fi

echo "Building changed plugins: $CHANGED_PLUGINS"

# Generate types first
./scripts/generate-types.sh

# Build each changed plugin
for plugin in $CHANGED_PLUGINS; do
    echo "Building plugin: $plugin"
    if [ -d "workspaces/$plugin" ]; then
        cd "workspaces/$plugin"
        if yarn build; then
            echo "✅ Successfully built $plugin"
        else
            echo "❌ Failed to build $plugin"
            cd ../..
            exit 1
        fi
        cd ../..
    else
        echo "Warning: Plugin directory workspaces/$plugin not found"
    fi
done

echo "All changed plugins built successfully!"