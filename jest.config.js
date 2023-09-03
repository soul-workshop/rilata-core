const unitJestConfig = require('@rilata/project-configs/src/base-configs/contracts/jest.unit-config');

module.exports = {
  ...unitJestConfig,
  transformIgnorePatterns: [
    "node_modules/(?!(.*(@rilata|@anthill|@anthill-subjects|@orderly-anthill|thread-chat-bot)))/"
  ],
};
