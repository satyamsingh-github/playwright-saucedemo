# Playwright Saucedemo Framework (JavaScript, POM)

## Structure
```
playwright-saucedemo/
├── .env                    # real credentials (gitignored)
├── .env.example             # template to share/commit
├── playwright.config.js     # projects, baseURL, storageState wiring
├── data/
│   └── testData.json        # URLs, product fixtures, expected messages
├── pages/
│   ├── BasePage.js          # shared page actions
│   ├── LoginPage.js         # login screen POM
│   └── ProductsPage.js      # inventory/products screen POM
├── tests/
│   ├── auth.setup.js        # logs in once, saves session to auth/standardUser.json
│   ├── login.spec.js        # positive/negative login tests (no saved session)
│   └── products.spec.js     # product page tests (reuses saved session)
└── auth/                    # generated storageState json (gitignored)
```

## Install
```bash
npm install
npx playwright install
```

Copy `.env.example` to `.env` and adjust if needed (saucedemo's demo creds are already filled in).

## How the session storage part works
`tests/auth.setup.js` is registered as a Playwright **setup project** in `playwright.config.js`.
It runs once before the `chromium` project, logs in as `STANDARD_USERNAME`, and calls
`page.context().storageState({ path: "auth/standardUser.json" })`, which dumps cookies +
localStorage to disk.

Any spec that runs under the `chromium` project (currently `products.spec.js`) is configured
with `storageState: "auth/standardUser.json"`, so its browser context starts already logged in —
no login steps repeated in every test, and it's fast.

`login.spec.js` intentionally runs under a separate `chromium-no-auth` project with no
storageState, since it needs to test the login form itself (including the locked-out and
invalid-credential cases with the second credential set).

## Run
```bash
npx playwright test              # runs setup, then all specs
npm run test:login               # only login tests
npm run test:products             # only product tests (auto-runs setup first)
npx playwright test --ui          # interactive UI mode
npx playwright show-report        # view HTML report
```

## Extending
- Add new credential sets to `.env` + `.env.example`.
- Add new page objects under `pages/`, extending `BasePage`.
- Add new fixtures/expected data to `data/testData.json` rather than hardcoding in specs.
- For a second logged-in role (e.g. `problem_user`), add another `*.setup.js` + project entry
  with its own storageState file.
