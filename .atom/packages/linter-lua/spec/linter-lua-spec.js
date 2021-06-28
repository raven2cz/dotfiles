'use babel';

import * as path from 'path';
import {
  // eslint-disable-next-line no-unused-vars
  it, fit, wait, beforeEach, afterEach,
} from 'jasmine-fix';

const { lint } = require('../lib/init.js').provideLinter();

const badFile = path.join(__dirname, 'fixtures', 'bad.lua');
const goodFile = path.join(__dirname, 'fixtures', 'good.lua');

describe('The Lua provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-lua');
  });

  it('checks a file with syntax error with luac and reports the correct message', async () => {
    atom.config.set('linter-lua.executablePath', 'luac');
    const excerpt = "')' expected (to close '(' at line 18) near 'end'";
    const editor = await atom.workspace.open(badFile);
    const messages = await lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(excerpt);
    expect(messages[0].location.file).toBe(badFile);
    expect(messages[0].location.position).toEqual([[18, 0], [18, 3]]);
  });

  it('checks a file with syntax error with luajit and reports the correct message', async () => {
    atom.config.set('linter-lua.executablePath', 'luajit');
    const excerpt = "')' expected (to close '(' at line 18) near 'end'";
    const editor = await atom.workspace.open(badFile);
    const messages = await lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(excerpt);
    expect(messages[0].location.file).toBe(badFile);
    expect(messages[0].location.position).toEqual([[18, 0], [18, 3]]);
  });

  it('finds nothing wrong with a valid file using luac', async () => {
    atom.config.set('linter-lua.executablePath', 'luac');
    const editor = await atom.workspace.open(goodFile);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });

  it('finds nothing wrong with a valid file using luajit', async () => {
    atom.config.set('linter-lua.executablePath', 'luajit');
    const editor = await atom.workspace.open(goodFile);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });
});
