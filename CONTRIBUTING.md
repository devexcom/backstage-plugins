# Contributing to Backstage Plugins

Thank you for your interest in contributing to our Backstage plugins repository!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `yarn install`
3. Create a new branch for your changes

## Plugin Development Guidelines

### Creating a New Plugin

1. Choose the appropriate workspace directory based on your plugin's domain
2. Use the Backstage CLI to scaffold your plugin
3. Follow existing patterns in similar plugins
4. Ensure your plugin has proper documentation

### Code Standards

- Follow the existing ESLint and Prettier configuration
- Write tests for your functionality
- Document your APIs and configuration options
- Follow semantic versioning for releases

### Plugin Structure

Each plugin should include:

- `package.json` with proper metadata
- `README.md` with setup and usage instructions  
- Test coverage for core functionality
- TypeScript definitions
- Proper error handling

## Release Process

1. Make your changes in a feature branch
2. Add a changeset: `yarn changeset`
3. Select the appropriate packages and change type
4. Commit both your changes and the changeset file
5. Create a pull request

The automated release process will:

- Create a "Version Packages" PR when changesets are merged
- Publish packages to npm when the version PR is merged
- Update package versions according to semantic versioning

## Testing

Run the full test suite before submitting:

```bash
# Run all tests
yarn test

# Run linting
yarn lint

# Build all packages
yarn build
```

## Workspace Guidelines

### Choosing a Workspace

- **Analytics**: Metrics, dashboards, reporting
- **Monitoring**: Observability, alerting, health checks
- **Security**: Scanning, compliance, access control
- **Data**: Integrations, ETL, databases
- **Scaffolder Actions**: Custom scaffolder functionality

### Cross-Workspace Dependencies

Plugins can depend on other plugins in the repository. Declare these as regular npm dependencies in your `package.json`.

## Questions?

If you have questions about contributing, please:

1. Check the existing documentation
2. Look at similar plugins for examples
3. Open an issue for discussion
4. Reach out to the maintainers

We appreciate your contributions!