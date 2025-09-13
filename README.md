# Blank
*Blank* is a simple, open-source, easily-branded blog application, built with
the [*SvelteKit*](https://kit.svelte.dev/docs/kit) framework.

## Customization
Aside from [deployment configuration](#configuration), the application is
customized via static configuration, locale, and theming files. These files
are expected to be served from the root of the internal `BASE_URL` path.

### Config File
To customize application settings, add a `config.json` file to the `/static`
folder. The [default configuration](src/lib/utils/config.ts) defines the
expected configuration object structure and default values. Values not defined
in the `config.json` file will fall back to the default configuration values.

### Locale File
A locale can be set in `locale.json`, located in the `/static` folder. Values
found in the `locale.json` file will be used to populate application text. The
[default locale](src/lib/utils/locale.ts) defines all expected values.

### Theming File
Adding a custom `theme.json` file to the `/static` folder will populate the
application with the provided theme settings. The theme shown in the client is
determined by the `theme` local storage key. If no theme is set, the default
theme will be used.
```json
{
  "themes": {
    "default": {},
    "custom": {}
  }
}
```

The theme definitions can define colour palettes, scale values, backgrounds,
typography, and other graphics. Fonts are defined per theme; palettes, scales,
backgrounds, typography, and graphics are defined per section. Colour values,
size values, and typography fonts are expected to be keys associated with the
theme applicable palette, scale, or fonts, respectively. If SVG images are
sourced in backgrounds or graphics, SVG element colour can be defined by
mapping element class names to colour palette keys. An example theme definition
can be found in the [theme](src/lib/utils/theme.ts) utility file, along with
expected type definitions.

## Deployment
The built [*SvelteKit*](https://kit.svelte.dev/docs/kit) server-side application
is configured to be deployed to a [*Node.js*](https://nodejs.org/) environment.
Before building and running the application, all necessary development
dependencies must be installed.
```bash
npm install
```

### Configuration
Optional environment variables can be defined in a `.env` file at the root of
the project. A sample `.env` file is provided as [`.env.example`](.env.example).

#### Application
By default, the application will not set a head favicon link. To add a
favicon, set the `PUBLIC_FAVICON` environment variable to the desired favicon
href link.

By default, all local resources are served from the root path (`/`). The base
path used by the client can be set using the `PUBLIC_BASE_URL` environment
variable. To provide a base path for the server data loading, set the private
`BASE_URL` environment variable. This can be useful for including static
resources or customization files after building the application which bundles
the `/static` folder.

#### Logging
Server side events are automatically logged and formatted using
[*Pino*](https://getpino.io/). Events are sent to the application's standard
output to capture logs in the console or environment log files. In development,
[`pino-pretty`](https://github.com/pinojs/pino-pretty) is used to format the log
output.

#### Error Monitoring & Performance Tracking
To enable [*Sentry*](https://docs.sentry.io/platforms/javascript/guides/svelte/)
error tracking and performance monitoring, add the necessary environment
variables:
- `PUBLIC_SENTRY_DSN`: The public DSN for your Sentry project,
- `SENTRY_ORG`: Your Sentry organization slug,
- `SENTRY_PROJECT`: Your Sentry project slug,
- `SENTRY_AUTH_TOKEN`: Your Sentry authentication token.

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

### Testing
Unit tests and end-to-end integration test are included. Application and
configuration unit tests can be run using [*Vitest*](https://vitest.dev/);
Integration tests are ran via [*Playwright*](https://playwright.dev/). Both are
included in the package test script:
```bash
npm run test
```

Before running end-to-end tests, *Playwright* browser dependencies must be
installed:
```bash
npx playwright install
```
