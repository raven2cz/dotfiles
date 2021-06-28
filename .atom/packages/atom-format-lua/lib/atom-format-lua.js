'use babel'

import { CompositeDisposable, Disposable} from 'atom'
import process from 'child_process';
import path from 'path';
import helpers from './help';
import fs from 'fs';
import packageConfig from './config-schema.json';

let disposables = null;
export function activate() {
    disposables = new CompositeDisposable();
    disposables.add(atom.commands.add('atom-workspace', {
        'atom-format-lua:format': (event) => {
            format();
        }
    }))
}

export function deactivate() {
    disposables.dispose()
}

export const config = packageConfig;

function format() {
    let editor = null;
    let tempfile = null;
    let wkspc = null;
    let formatterScript = null;
    let lua51path = null;
    let params = null;

    editor = atom.workspace.getActiveTextEditor();

    if (editor.getGrammar().name == 'Lua') {
        tempfile = editor.getPath();
    } else {
        return;
    }

    tempfile = editor.getPath();

    editor.save();

    let pkgDirs = atom.packages.packageDirPaths;
    for (var index = 0; index < pkgDirs.length; index++) {
        let tmpWkspc = path.join(pkgDirs[index], 'atom-format-lua/luacode');
        try {
            let tmfFile = path.join(tmpWkspc, 'formatter.lua');
            let fstate = fs.statSync(tmfFile);
            if (fstate.isFile()) {
                formatterScript = tmfFile;
                wkspc = tmpWkspc;
            }
        } catch (e) {}
    }

    let osTypes = {
        'darwin': '/usr/local/bin/lua5.1',
        'freebsd': '/usr/local/bin/lua5.1',
        'linux': '/usr/bin/lua5.1',
        'sunos': 'I dont Know where the lua5.1',
        'win32': 'I dont Know where the lua5.1'
    };
    params = [formatterScript, '--file', tempfile, '--ts', atom.config.get('atom-format-lua.indentSize')];

    lua51path = atom.config.get("atom-format-lua.lua51");

    if (!lua51path) {
        lua51path = osTypes[helpers.getProcessPlatform()];
    }

    proc = process.spawn(lua51path, params, {
        cwd: wkspc
    })
    // proc.stdout.on('data', (data) => {
    //     console.log('out', data.asciiSlice())
    // })
    proc.stderr.on('data', (data) => {
        console.log('err', data.asciiSlice());
    })
}
