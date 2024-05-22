# MyApp

## Overview

This project is designed to demonstrate some basic features of building a Single Page Application (SPA) using Angular and SKY UX.

**Start command:** serve the SPA while developing locally

```bash
npx ng serve --open
```

**Test command:** run unit tests in the browser

```bash
npx ng test
```

**Lint command:** check the syntax of the code

```bash
npx ng lint
```

**Test command for continuous integration:** run unit tests in a headless browser

```bash
npx ng test --browsers=ChromeHeadless --no-watch --no-progress
```

## Steps used to create this project

### Create the project

- Basic Angular application.
- ES Lint and Prettier for code quality.
- SKY UX design system to provide a consistent look and feel.

Start with the Angular CLI to create a new project.

```bash
npx @angular/cli@^17 new my-app \
  --routing \
  --skip-git \
  --style=scss \
  --no-ssr
cd my-app
```

Add ES Lint and Prettier support:

```bash
npx ng add @angular-eslint/schematics --skip-confirmation
npm i -D \
  prettier \
  prettier-eslint \
  eslint-config-prettier \
  eslint-plugin-prettier
npx ng add @skyux-sdk/eslint-config --skip-confirmation
```

Add `@skyux/packages` to the project, which adds SKY UX stylesheets and sets up upgrades:

```bash
npx ng add @skyux/packages \
  --project my-app \
  --skip-confirmation
```

Install NPM packages that we plan to use:

```bash
npm install \
  @ng-web-apis/common \
  @skyux-sdk/testing \
  @skyux/ag-grid \
  @skyux/data-manager \
  @skyux/forms \
  @skyux/indicators \
  @skyux/lookup \
  @skyux/modals \
  @skyux/pages
```

(code changes)

Format and commit:

```bash
npx prettier -w .
git init
git add -A
git commit -m "Initial commit"
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/johnhwhite/my-app/tree/00-create-project?template=node)

### Create an HTTP Service

```bash
npx ng g service services/data/data
npx ng g service services/data/persistence
```

- Wire up HTTP client.
- Write tests.
- Write test service to simplify testing consuming components.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/johnhwhite/my-app/tree/01-create-http-service?template=node&file=src%2Fapp%2Fservices%2Frecords-data%2Frecords-data.service.ts)

### Create a Form

```bash
npx ng g c records/edit
```

- Use reactive forms for more programmatic control.
- Use SKY UX components for a consistent look and feel.
- Provide informative `labelText` for accessibility.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/johnhwhite/my-app/tree/02-create-form?template=node&file=src%2Fapp%2Frecords%2Fedit%2Fedit.component.html)

### Add a Data Grid

```bash
npx ng g c records/list
npx ng g @skyux/packages:add-ag-grid-styles --project my-app
```

(code changes)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/johnhwhite/my-app/tree/03-data-grid?template=node&file=src%2Fapp%2Frecords%2Flist%2Flist.component.html)

### Use Action Hub

```bash
npx ng g c hub
```

(code changes)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/johnhwhite/my-app/tree/04-action-hub?template=node&file=src%2Fapp%2Fhub%2Fhub.component.html)
