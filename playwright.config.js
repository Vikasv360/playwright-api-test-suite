
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  reporter: 'html',

  use: {

    trace: 'on-first-retry',
    // browserName:'chromium',
    headless:false,
    ignoreHTTPSErrors:true
  }


});

