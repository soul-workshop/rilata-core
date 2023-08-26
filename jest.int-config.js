const intJestConfig = require('@rilata/project-configs/src/base-configs/contracts/jest.int-config');

module.exports = {
  ...intJestConfig,
  transformIgnorePatterns: [
    "node_modules/(?!(.*(@rilata)))/"
  ],
};
