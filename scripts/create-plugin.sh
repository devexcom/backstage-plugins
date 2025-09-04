#!/bin/bash

# Script to create a new Backstage plugin in the appropriate workspace

set -e

PLUGIN_NAME=""
PLUGIN_TYPE="plugin"  # plugin, backend, scaffolder-action

print_usage() {
    echo "Usage: $0 -n <plugin-name> [-t <type>]"
    echo ""
    echo "Options:"
    echo "  -n <plugin-name>  Name of the plugin"
    echo "  -t <type>         Plugin type (plugin, backend, scaffolder-action) [default: plugin]"
    echo ""
    echo "Examples:"
    echo "  $0 -n my-metrics-plugin"
    echo "  $0 -n prometheus-backend -t backend"
    echo "  $0 -n custom-action -t scaffolder-action"
    echo ""
    echo "Note: Plugins are created directly under workspaces/ directory"
}

while getopts "n:t:h" opt; do
    case ${opt} in
        n )
            PLUGIN_NAME=$OPTARG
            ;;
        t )
            PLUGIN_TYPE=$OPTARG
            ;;
        h )
            print_usage
            exit 0
            ;;
        \? )
            print_usage
            exit 1
            ;;
    esac
done

if [[ -z "$PLUGIN_NAME" ]]; then
    echo "Error: Plugin name is required"
    print_usage
    exit 1
fi

PLUGIN_PATH="workspaces/$PLUGIN_NAME"

if [[ -d "$PLUGIN_PATH" ]]; then
    echo "Error: Plugin directory $PLUGIN_PATH already exists"
    exit 1
fi

echo "Creating $PLUGIN_TYPE plugin: @devexcom/$PLUGIN_NAME in workspaces/"

cd "workspaces"

case $PLUGIN_TYPE in
    "plugin")
        npx @backstage/create-app@latest --skip-install --path "$PLUGIN_NAME"
        ;;
    "backend")
        npx @backstage/create-app@latest --skip-install --path "$PLUGIN_NAME" --backend
        ;;
    "scaffolder-action")
        npx @backstage/create-app@latest --skip-install --path "$PLUGIN_NAME" --scaffolder-action
        ;;
    *)
        echo "Error: Unknown plugin type: $PLUGIN_TYPE"
        echo "Supported types: plugin, backend, scaffolder-action"
        exit 1
        ;;
esac

# Update package.json to use @devexcom scope
if [ -f "$PLUGIN_NAME/package.json" ]; then
    cd "$PLUGIN_NAME"
    # Update the name field to include @devexcom scope
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.name = '@devexcom/' + pkg.name.split('/').pop();
        pkg.publishConfig = { access: 'public' };
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
    cd ..
fi

cd - > /dev/null

echo "Plugin created successfully at: $PLUGIN_PATH"
echo "Plugin name: @devexcom/$PLUGIN_NAME"
echo ""
echo "Next steps:"
echo "1. cd $PLUGIN_PATH"
echo "2. Review the package.json (already updated with @devexcom scope)"
echo "3. Implement your plugin functionality"
echo "4. Add tests and documentation"
echo "5. Create a changeset when ready to publish to npm as @devexcom/$PLUGIN_NAME"