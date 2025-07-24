export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  // Jest has trouble with ES Modules, this helps
  transform: {},
};