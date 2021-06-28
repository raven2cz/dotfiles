#!/usr/bin/env node
'use strict';

var path = require('path');
var index = require('./index');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

if (process.argv.length !== 3) {
  console.error('Usage: atom-package-deps <directory>');
  process.exit(1);
}

const [,, directory, hideUserPromptStr] = process.argv;
const hideUserPrompt = hideUserPromptStr === 'true';

async function main() {
  const resolved = path__default['default'].resolve(process.cwd(), directory);
  await index.install(resolved, hideUserPrompt);
  console.log('All Done!');
}

main().catch(error => {
  if (process.env.STEELBRAIN_DEBUG) {
    var _error$stack;

    console.error('Error:', (_error$stack = error === null || error === void 0 ? void 0 : error.stack) !== null && _error$stack !== void 0 ? _error$stack : error);
  } else {
    console.error('Error:', error.message);
    process.exit(1);
  }
});
