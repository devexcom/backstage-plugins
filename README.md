# DevexCom Backstage Plugins

This repository contains a collection of Backstage plugins developed by DevexCom, organized by domain and functionality.

## Repository Structure

```
workspaces/
├── catalog-cards/           # Drop-in catalog cards view plugin
├── [plugin-name]/          # Each plugin in its own directory
└── ...                     # More plugins as they are created
```

Plugins are organized directly under the `workspaces/` directory, with each plugin in its own folder.

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
- **[future-plugins]**: Additional plugins as they are developed

Each plugin is:

- **Self-contained** with its own package.json and dependencies
- **Independently versioned** using Changesets
- **Published separately** to npm under the `@devexcom` scope
- **Fully documented** with setup and usage instructions# Test commit to trigger workflow
