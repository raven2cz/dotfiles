'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

let helpers;

const REGEX = /^.+?:.+?:(\d+):\s+(.+?(?:near (.+)|$))/g;

const loadDeps = () => {
  if (!helpers) {
    helpers = require('atom-linter');
  }
};

const parseLuacOutput = (output, file, editor) => {
  const messages = [];
  let match = REGEX.exec(output);
  while (match !== null) {
    const line = Number.parseInt(match[1], 10) - 1;
    messages.push({
      severity: 'error',
      excerpt: match[2],
      location: {
        file,
        position: helpers.generateRange(editor, line),
      },
    });
    match = REGEX.exec(output);
  }
  return messages;
};

module.exports = {
  activate() {
    this.idleCallbacks = new Set();
    let depsCallbackID;
    const installLinterLuaDeps = () => {
      this.idleCallbacks.delete(depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-lua');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterLuaDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.config.observe(
        'linter-lua.executablePath',
        (value) => { this.executablePath = value; },
      ),
    );
  },

  deactivate() {
    this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Lua',
      grammarScopes: ['source.lua'],
      scope: 'file',
      lintsOnChange: true,
      lint: async (editor) => {
        if (!atom.workspace.isTextEditor(editor)) {
          // If we somehow get fed an invalid TextEditor just immediately return
          return null;
        }

        const filePath = editor.getPath();
        if (!filePath) {
          return null;
        }

        loadDeps();

        const args = [];

        if (this.executablePath.indexOf('luajit') !== -1) {
          args.push('-bl');
        } else {
          args.push('-p');
        }

        args.push('-'); // to indicate that the input is in stdin

        const stdin = editor.getText();

        const execOptions = {
          stdin,
          stream: 'stderr',
          uniqueKey: `linter-lua::${filePath}`,
          allowEmptyStderr: true,
        };

        let output;
        try {
          output = await helpers.exec(this.executablePath, args, execOptions);
        } catch (e) {
          if (e.message === 'Process execution timed out') {
            atom.notifications.addInfo(`linter-lua: ${this.executablePath} timed out`, {
              description: `A timeout occured while executing ${this.executablePath}, it could be due to lower resources `
                           + 'or a temporary overload.',
            });
          } else {
            atom.notifications.addError('linter-lua: Unexpected error', { description: e.message });
          }
          return null;
        }

        if (editor.getText() !== stdin || output === null) {
          // File has changed since the lint was triggered, tell Linter not to update or
          // process was canceled by newer process
          return null;
        }

        return parseLuacOutput(output, filePath, editor);
      },
    };
  },
};
