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

