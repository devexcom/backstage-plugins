# DevexCom Backstage Plugins

This repository contains a collection of Backstage plugins developed by DevexCom, organized by domain and functionality.

## Repository Structure

```
workspaces/
├── catalog-cards/           # Drop-in catalog cards view plugin
├── linkedin-learning-card/  # LinkedIn Learning recommendations plugin
├── [plugin-name]/          # Each plugin in its own directory
└── ...                     # More plugins as they are created
```

Plugins are organized directly under the `workspaces/` directory, with each plugin in its own folder.

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Build all plugins:

   ```bash
   yarn build
   ```

3. Run tests:
   ```bash
   yarn test
   ```

## Development

### Creating a New Plugin

Use the provided script to create a new plugin:

```bash
# Create a frontend plugin
./scripts/create-plugin.sh -n my-awesome-plugin

# Create a backend plugin
./scripts/create-plugin.sh -n my-backend-service -t backend

# Create a scaffolder action
./scripts/create-plugin.sh -n custom-action -t scaffolder-action
```

The script will:

- Create the plugin directory under `workspaces/`
- Set up the basic plugin structure
- Configure the `@devexcom` npm scope
- Add proper repository metadata

### Publishing Changes

This repository uses [Changesets](https://github.com/changesets/changesets) for version management:

1. Create a changeset:

   ```bash
   yarn changeset
   ```

2. Commit your changes along with the changeset file
3. The release workflow will automatically create a "Version Packages" PR
4. Merge the PR to publish the packages

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Plugin Organization

Plugins are organized as individual packages under the `workspaces/` directory:

- **catalog-cards**: Drop-in plugin that adds rich card views to Backstage catalog
- **linkedin-learning-card**: Personalized LinkedIn Learning course recommendations
- **[future-plugins]**: Additional plugins as they are developed

Each plugin is:

- **Self-contained** with its own package.json and dependencies
- **Independently versioned** using Changesets
- **Published separately** to npm under the `@devexcom` scope
- **Fully documented** with setup and usage instructions# Test commit to trigger workflow
