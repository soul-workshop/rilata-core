const compJestConfig = require('@rilata/project-configs/src/base-configs/contracts/jest.comp-config');

module.exports = {
  ...compJestConfig,
  transformIgnorePatterns: [
    "node_modules/(?!(.*(@rilata)))/"
  ],
};
