# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Airbnb POC

## Setup

1. Copy the example env file and fill in your secrets:
   ```sh
   cp .env.example .env
   # Edit .env to set your actual credentials
   ```

2. Source your environment variables before running the dev server:
   ```sh
   source .env
   ```

3. Install dependencies:
   ```sh
   pnpm install
   ```

4. Run database migrations (requires [dbmate](https://github.com/amacneil/dbmate)):
   ```sh
   dbmate --url "$DATABASE_URL" up
   ```

5. Start the dev server:
   ```sh
   pnpm dev
   ```

## Notes
- All secrets and credentials must be set in your .env file.
- Migrations are managed with dbmate and raw SQL in the `migrations/` folder.
- Static assets are stored in S3-compatible storage (MinIO for dev, but any S3-compatible provider works with S3_ env vars).
