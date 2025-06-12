# Blank
*Blank* is a simple, open-source, easily-branded blog application, built with
the [*SvelteKit*](https://kit.svelte.dev/docs/kit) framework.

## Deployment
The built [*SvelteKit*](https://kit.svelte.dev/docs/kit) server-side application
is configured to be deployed to a [*Node.js*](https://nodejs.org/) environment.
Before building and running the application, all necessary development
dependencies must be installed.
```bash
npm install
```

### Development
The application can be started locally using [*Vite*](https://vitejs.dev/)'s
development server.
```bash
npm run dev
```

### Production
Run the build command to create an optimized production build, which can also
be served locally using [*Vite*](https://vitejs.dev/).
```bash
npm run build
npm run preview
```
