const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000', 
    supportFile: false,
    screenshotOnRunFailure: true, // <--- ESTA LÍNEA ES ORO PARA TUS EVIDENCIAS
  },
});