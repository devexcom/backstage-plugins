# Getting Started

This guide will help you get started with developing and contributing to the Backstage plugins in this repository.

## Prerequisites

- Node.js 18 or 20
- Yarn package manager
- Git

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/backstage-plugins.git
   cd backstage-plugins
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up Git hooks**
   ```bash
   yarn prepare
   ```

## Creating Your First Plugin

Use the provided script to create a new plugin:

```bash
# Create a frontend plugin (will be named @devexcom/my-metrics-plugin)
yarn create-plugin -n my-metrics-plugin

# Create a backend plugin (will be named @devexcom/prometheus-backend)
yarn create-plugin -n prometheus-backend -t backend

# Create a scaffolder action (will be named @devexcom/custom-action)
yarn create-plugin -n custom-action -t scaffolder-action
```

All plugins are automatically:
- Created under the `workspaces/` directory
- Scoped under the `@devexcom` npm organization
- Configured with proper repository metadata

## Development Workflow

### Building Plugins

```bash
# Build all plugins
yarn build:all

# Build specific plugin
yarn workspace catalog-cards build

# Build in development mode
yarn dev
```

### Testing

```bash
# Run all tests
yarn test:all

# Run tests for specific plugin
yarn workspace linkedin-learning-card test

# Run tests with coverage
yarn test --coverage
```

### Linting and Formatting

```bash
# Lint all code
yarn lint:all

# Fix linting issues
yarn lint:fix

# Format code (handled automatically by pre-commit hooks)
```

## Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-plugin
   ```

2. **Make your changes**
   - Implement your plugin functionality
   - Add tests
   - Update documentation

3. **Create a changeset**
   ```bash
   yarn changeset
   ```
   
   Follow the prompts to:
   - Select which packages changed
   - Choose the type of change (major, minor, patch)
   - Write a clear description

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(analytics): add new metrics plugin"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/my-new-plugin
   ```

## Plugin Structure

Each plugin should follow this structure:

```
workspaces/[plugin-name]/
├── package.json          # Plugin metadata and dependencies
├── README.md            # Plugin documentation
├── src/
│   ├── index.ts         # Main plugin export
│   ├── plugin.ts        # Plugin definition
│   └── components/      # React components (for frontend plugins)
├── dev/
│   └── index.tsx        # Development server setup
└── dist/                # Built output
```

## Release Process

1. Changes with changesets are automatically processed
2. A "Version Packages" PR is created when changesets are detected
3. Merging the version PR publishes packages to npm
4. Packages are versioned according to semantic versioning

## Plugin Guidelines

Each plugin is self-contained and should:

- **Follow naming conventions**: Use kebab-case for plugin names
- **Include comprehensive docs**: README with setup and usage instructions
- **Have proper testing**: Unit tests and integration tests where applicable
- **Use TypeScript**: Full type definitions for better developer experience
- **Follow Backstage patterns**: Use official Backstage components and APIs

## Getting Help

- Check existing plugins for examples
- Review the [contributing guide](../CONTRIBUTING.md)
- Open an issue for questions
- Join the team Slack for discussions

## Next Steps

- Explore existing plugins like `catalog-cards` and `linkedin-learning-card`
- Read the Backstage plugin development documentation
- Start building your first plugin!