const allJestConfig = require('@rilata/project-configs/src/base-configs/contracts/jest.all-config');

module.exports = {
  ...allJestConfig,
  transformIgnorePatterns: [
    "node_modules/(?!(.*(@rilata)))/"
  ],
};
