# Blockbeat.ai

The project is managed with Yarn Berry and utilizes the Plug'n'Play feature for efficient dependency management.

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (^18.18.0 || >=20.0.0)
- [Yarn](https://yarnpkg.com/) (>= 3.x - Yarn Berry)

### Installation

1. Make sure you have corepack installed and stable version of yarn in your system

2. Clone the repository:

3. Install dependencies using Yarn:

   ```bash
   yarn install

   ```

4. Install the recommended VSCode extensions (mainly ZipFS for Yarn):
   It should show prompt to install all it, if not:

   - Install the recommended extensions, especially ZipFS for Yarn
   - Open the command palette in VSCode (Ctrl+Shift+P or Cmd+Shift+P on Mac)
   - Search for and select “Extensions: Show Recommended Extensions”

5. Enable TypeScript version to the workspace version in VSCode:
   It should show prompt to enable it, if not:

   - Open the command palette in VSCode (Ctrl+Shift+P or Cmd+Shift+P on Mac)
   - Search for and select “TypeScript: Select TypeScript Version…”
   - Choose “Use Workspace Version”

### Running the Development Server

To start the development server, run:

```bash
yarn run dev

```

This will start the application at `http://localhost:3000`.

### Running Storybook

To start Storybook, a tool for developing UI components in isolation, run:

```bash
yarn run storybook

```

This will start Storybook at `http://localhost:6006`.

## Editor Setup

For seamless development, it is recommended to use Visual Studio Code (VSCode) with the following extensions:

- ZipFS: Support for Yarn Berry (`arcanis.vscode-zipfs`)
- ESLint: Linting for JavaScript and TypeScript (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter: Code formatting (`esbenp.prettier-vscode`)
- Prettier ESLint: Integration of Prettier and ESLint (`rvest.vs-code-prettier-eslint`)
- JSDoc: JSDoc support (`lllllllqw.jsdoc`)
- Better Comments: Improve your code commenting (`aaron-bond.better-comments`)

### VSCode Settings

Ensure your workspace settings in VSCode include recommendations for the necessary extensions. Add the following to your `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "arcanis.vscode-zipfs",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "rvest.vs-code-prettier-eslint",
    "lllllllqw.jsdoc",
    "aaron-bond.better-comments"
  ]
}
```

## Folder Structure

We follow the folder structure principles as outlined in the article ["Screaming Architecture: Evolution of a React Folder Structure"](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25?source=post_page-----cc7ecdc73550--------------------------------). This helps in maintaining a clean, organized, and scalable codebase.

## Routing

Routing in this project is managed using [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing). We use file-based routing with route file and folder prefixes as ~. This approach allows for a clear and maintainable routing structure.

Example route file:

```javascript
// ~routes/~tokens/index.ts
import { createFileRoute } from '@tanstack/react-router';

export const TokensRoute = createFileRoute('/tokens')({
  component: () => <div>Tokens Page</div>,
});
```

## Scripts

- `yarn install`: Install dependencies
- `yarn run dev`: Start the development server
- `yarn run storybook`: Start Storybook

## Acknowledgments

- React: [https://reactjs.org/](https://reactjs.org/)
- TypeScript: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
- Vite: [https://vitejs.dev/](https://vitejs.dev/)
- Yarn Berry: [https://yarnpkg.com/](https://yarnpkg.com/)
