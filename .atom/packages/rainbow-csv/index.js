const path = require('path');
const os = require('os');
const fs = require('fs');
const child_process = require('child_process');

const csv_utils = require('./rbql_core/rbql-js/csv_utils.js');

var rbql_csv = null;

const num_rainbow_colors = 10;

// Develop/debug/test instruction: https://stackoverflow.com/a/38270061/2898283


var status_bar_tile_column = null;
var status_bar_tile_rbql = null;
var last_rbql_queries = new Map();
var autodetection_stoplist = new Set();

var rbql_panel = null;


// TODO implement improved dialect detection algorithm


const autodetection_dialects = [
    {delim: ',', policy: 'quoted'},
    {delim: ';', policy: 'quoted'},
    {delim: '\t', policy: 'simple'},
    {delim: '|', policy: 'simple'}
];


function remove_element(id) {
    let elem = document.getElementById(id);
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
}


function get_field_by_line_position(fields, query_pos) {
    if (!fields.length)
        return null;
    var col_num = 0;
    var cpos = fields[col_num].length + 1;
    while (query_pos > cpos && col_num + 1 < fields.length) {
        col_num += 1;
        cpos = cpos + fields[col_num].length + 1;
    }
    return col_num;
}


function prepare_colors() {
    var css_code = '';
    for (let i = 0; i < num_rainbow_colors; i++) {
        let color_name = 'rainbow' + (i + 1);
        let color_value = atom.config.get('rainbow-csv.' + color_name);
        css_code += `.syntax--${color_name} { color: ${color_value}; }`;
    }
    css_code += '.syntax--rainbowerror { color: #FFFFFF; background-color: #FF0000; }';

    const style_node_id = 'rainbow_colors_hack_css';

    remove_element(style_node_id);
    var patch_style_node = document.createElement('style');
    patch_style_node.id = style_node_id;
    patch_style_node.type = 'text/css';
    patch_style_node.innerHTML = css_code;
    document.getElementsByTagName('head')[0].appendChild(patch_style_node);
}


function get_document_header(editor, delim, policy) {
    if (editor.getLineCount() < 1)
        return [];
    let first_line = editor.lineTextForBufferRow(0);
    var split_result = csv_utils.smart_split(first_line, delim, policy, false);
    return split_result[0];
}


function get_column_color(col_num) {
    let css_class_name = '.syntax--rainbow' + (col_num % num_rainbow_colors + 1);
    try {
        let elem = document.querySelector(css_class_name);
        let style = getComputedStyle(elem);
        return style.color;
    } catch (e) {
        return '#bfbfbf';
    }
}


function display_position_info(editor, position, delim, policy, ui_column_display) {
    var line_num = position.row;
    var column = position.column;
    var line_text = editor.lineTextForBufferRow(line_num);
    var split_result = csv_utils.smart_split(line_text, delim, policy, true);
    if (split_result[1]) {
        return; 
    }
    var line_fields = split_result[0];
    var col_num = get_field_by_line_position(line_fields, column + 1);
    if (col_num === null)
        return;
    var ui_text = 'Col #' + (col_num + 1);
    var header = get_document_header(editor, delim, policy);
    if (col_num < header.length) {
        const max_label_len = 50;
        var column_label = header[col_num].substr(0, max_label_len);
        if (column_label != header[col_num])
            column_label = column_label + '...';
        ui_text += ': "' + column_label + '"';
    }
    if (line_fields.length != header.length) {
        ui_text += "; WARN: inconsistent with Header line";
    }
    ui_column_display.setAttribute('style', 'color:' + get_column_color(col_num));
    ui_column_display.textContent = ui_text;
}


function get_rainbow_scope(grammar) {
    if (!grammar || !grammar.scopeName)
        return null;
    var rainbow_scope_regex = /^text\.rbcs([mt])([0-9]+)$/;
    var matched = grammar.scopeName.match(rainbow_scope_regex);
    if (!matched)
        return null;
    var policy = (matched[1] == 'm' ? 'simple' : 'quoted');
    var delim = String.fromCharCode(matched[2]);
    return {'scope_name': grammar.scopeName, 'delim': delim, 'policy': policy};
}


function is_delimited_table(sampled_lines, delim, policy) {
    if (sampled_lines.length < 2)
        return false;
    var split_result = csv_utils.smart_split(sampled_lines[0], delim, policy, false);
    if (split_result[1])
        return false;
    var num_fields = split_result[0].length;
    if (num_fields < 2)
        return false;
    for (var i = 1; i < sampled_lines.length; i++) {
        split_result = csv_utils.smart_split(sampled_lines[i], delim, policy, false);
        if (split_result[1])
            return false;
        if (split_result[0].length != num_fields)
            return false;
    }
    return true;
}


function sample_lines(editor) {
    var sampled_lines = [];
    var num_lines = editor.getLineCount();
    var head_count = 10;
    if (num_lines <= head_count * 2) {
        for (var i = 0; i < num_lines; i++) {
            sampled_lines.push(editor.lineTextForBufferRow(i));
        }
    } else {
        for (var i = 0; i < head_count; i++) {
            sampled_lines.push(editor.lineTextForBufferRow(i));
        }
        for (var i = num_lines - head_count; i < num_lines; i++) {
            sampled_lines.push(editor.lineTextForBufferRow(i));
        }
    }
    while (sampled_lines.length) {
        var last = sampled_lines[sampled_lines.length - 1];
        if (last != "")
            break;
        sampled_lines.pop();
    }
    return sampled_lines;
}


function autodetect_dialect(editor) {
    var sampled_lines = sample_lines(editor);
    for (var i = 0; i < autodetection_dialects.length; i++) {
        if (is_delimited_table(sampled_lines, autodetection_dialects[i].delim, autodetection_dialects[i].policy))
            return autodetection_dialects[i];
    }
    return null;
}


function hide_statusbar_tiles() {
    if (status_bar_tile_column) {
        var elem = status_bar_tile_column.getItem();
        if (elem) {
            elem.textContent = '';
        }
    }
    if (status_bar_tile_rbql) {
        var elem = status_bar_tile_rbql.getItem();
        if (elem) {
            elem.textContent = '';
        }
    }
}


function show_statusbar_tiles(editor, delim, policy, event=null) {
    if (status_bar_tile_rbql) {
        var elem = status_bar_tile_rbql.getItem();
        if (elem) {
            elem.textContent = 'RBQL';
        }
    }
    if (editor.hasMultipleCursors())
        return;
    if (!status_bar_tile_column)
        return;
    var ui_column_display = status_bar_tile_column.getItem();
    if (ui_column_display) {
        let position = event ? event.newBufferPosition : editor.getCursorBufferPosition();
        display_position_info(editor, position, delim, policy, ui_column_display);
    }
}


function process_editor_switch(editor) {
    if (!editor) {
        hide_statusbar_tiles();
        return;
    }
    var rainbow_scope = get_rainbow_scope(editor.getGrammar());
    if (rainbow_scope) {
        show_statusbar_tiles(editor, rainbow_scope.delim, rainbow_scope.policy);
    } else {
        hide_statusbar_tiles();
    }
}


function unescape_index_record(record) {
    if (record.length >= 2 && record[1] == 'TAB')
        record[1] = '\t';
    return record;
}


function try_get_file_record(file_path) {
    var home_dir = os.homedir();
    var index_path = path.join(home_dir, '.rbql_table_index');
    var records = try_read_index(index_path);
    for (var i = 0; i < records.length; i++) {
        if (records[i].length && records[i][0] == file_path) {
            return unescape_index_record(records[i]);
        }
    }
    return null;
}


function do_set_rainbow_grammar(editor, delim, policy, backup_old_grammar=true, save_new_grammar=true) {
    var grammar = find_suitable_grammar(delim, policy);
    if (!grammar) {
        console.error('Rainbow grammar was not found');
        return;
    }
    if (backup_old_grammar) {
        var old_grammar = editor.getGrammar();
        if (old_grammar && old_grammar.scopeName != 'text.plain.null-grammar') {
            // We don't want to save null-grammar, because it doesn't cancel rainbow grammar
            editor['rcsv__package_old_grammar'] = old_grammar;
        }
    }
    if (save_new_grammar) {
        var file_path = editor.getPath();
        if (file_path) {
            update_table_record(file_path, delim, policy);
        }
    }
    editor.setGrammar(grammar);
    var disposable_subscription = editor.onDidChangeCursorPosition(event => { show_statusbar_tiles(editor, delim, policy, event); });
    editor['rcsv__package_ds'] = disposable_subscription;
}


function is_plain_text_grammar(grammar) {
    var plain_text_grammars = ['text.plain', 'text.plain.null-grammar'];
    return (grammar && plain_text_grammars.indexOf(grammar.scopeName) != -1);
}


function handle_new_editor(editor) {
    if (!editor)
        return;
    var file_path = editor.getPath();
    if (autodetection_stoplist.has(file_path)) {
        return;
    }
    var file_record = try_get_file_record(file_path);
    if (file_record && file_record.length >= 3) {
        var delim = file_record[1];
        var policy = file_record[2];
        if (delim != 'disabled') {
            // We need this timeout hack here because of a race condition: 
            // sometimes this callback gets executed before Atom sets a default grammar for the editor
            setTimeout(function() { do_set_rainbow_grammar(editor, delim, policy); }, 2000);
        }
        return;
    }
    var grammar = editor.getGrammar();
    if (!grammar) {
        console.log('Unknown error: unable to get current grammar');
        return;
    }
    var autodetection_enabled = atom.config.get('rainbow-csv.autodetection');
    if (is_plain_text_grammar(grammar) && autodetection_enabled) {
        var detected_dialect = autodetect_dialect(editor);
        if (detected_dialect) {
            do_set_rainbow_grammar(editor, detected_dialect.delim, detected_dialect.policy);
        }
    }
    if (file_path) {
        if (file_path.toLowerCase().endsWith('.csv')) {
            do_set_rainbow_grammar(editor, ',', 'quoted');
        }
        if (file_path.toLowerCase().endsWith('.tsv')) {
            do_set_rainbow_grammar(editor, '\t', 'simple');
        }
    }
}


function do_disable_rainbow(editor) {
    // TODO add grammar change subscriber to handle situation when user disables rainbow grammar by another mechanism
    if (editor.hasOwnProperty('rcsv__package_old_grammar')) {
        editor.setGrammar(editor['rcsv__package_old_grammar']);
        delete editor['rcsv__package_old_grammar'];
    } else {
        editor.setGrammar(atom.grammars.grammarForScopeName('text.plain'));
    }
    if (editor.hasOwnProperty('rcsv__package_ds')) {
        editor['rcsv__package_ds'].dispose();
        delete editor['rcsv__package_ds'];
    }
    hide_statusbar_tiles();
    var file_path = editor.getPath();
    if (file_path) {
        update_table_record(file_path, 'disabled', '');
    }
}


function handle_color_customization(_config_event) {
    prepare_colors();
}


function activate(_state) {
    prepare_colors();
    atom.config.onDidChange('rainbow-csv', handle_color_customization);
    atom.workspace.observeTextEditors(handle_new_editor);
    atom.workspace.onDidChangeActiveTextEditor(process_editor_switch);
    atom.commands.add('atom-text-editor', 'rainbow-csv:disable', disable_rainbow);
    atom.commands.add('atom-text-editor', 'rainbow-csv:enable-standard', enable_rainbow_quoted);
    atom.commands.add('atom-text-editor', 'rainbow-csv:enable-simple', enable_rainbow_simple);
    atom.commands.add('atom-text-editor', 'rainbow-csv:rbql', start_rbql);
    var submenu_entries = [];
    submenu_entries.push({label: 'Disable', command: 'rainbow-csv:disable'});
    submenu_entries.push({label: 'Set as separator: Standard dialect', command: 'rainbow-csv:enable-standard'});
    submenu_entries.push({label: 'Set as separator: Simple dialect', command: 'rainbow-csv:enable-simple'});
    submenu_entries.push({label: 'Run SQL-like RBQL query', command: 'rainbow-csv:rbql'});
    var context_items = {'atom-text-editor': [{label: 'Rainbow CSV', submenu: submenu_entries}]};
    atom.contextMenu.add(context_items);
}


function deactivate() {
    if (status_bar_tile_column)
        status_bar_tile_column.destroy();
    status_bar_tile_column = null;
    if (status_bar_tile_rbql)
        status_bar_tile_rbql.destroy();
    status_bar_tile_rbql = null;
}


function get_grammar_name(rainbow_delim, policy) {
    var delim_map = new Map();
    delim_map.set('<', 'less-than');
    delim_map.set('>', 'greater-than');
    delim_map.set(':', 'colon');
    delim_map.set('"', 'double-quote');
    delim_map.set('/', 'slash');
    delim_map.set('\\', 'backslash');
    delim_map.set('|', 'pipe');
    delim_map.set('?', 'question-mark');
    delim_map.set('*', 'asterisk');
    delim_map.set('\t', 'tab');
    delim_map.set(' ', 'space');
    var delim_name_part = '[' + rainbow_delim + ']';
    if (delim_map.has(rainbow_delim)) {
        delim_name_part = delim_map.get(rainbow_delim);
    }
    var policy_name_part = (policy === 'simple' ? 'Simple' : 'Standard');
    return 'Rainbow ' + delim_name_part + ' ' + policy_name_part + '.cson';
}


function find_suitable_grammar(rainbow_delim, policy) {
    var rainbow_package_path = atom.packages.resolvePackagePath('rainbow-csv');
    var grammar_name = get_grammar_name(rainbow_delim, policy);
    var grammar_path = path.join(rainbow_package_path, 'custom_grammars', grammar_name);
    var grammar = atom.grammars.readGrammarSync(grammar_path);
    return grammar;
}


function update_records(records, record_key, new_record) {
    for (var i = 0; i < records.length; i++) {
        if (records[i].length && records[i][0] == record_key) {
            records[i] = new_record;
            return;
        }
    }
    records.push(new_record);
}


function write_index(records, index_path) {
    var lines = [];
    for (var i = 0; i < records.length; i++) {
        var record = records[i].slice(0);
        if (record.length >= 2 && record[1] == '\t')
            record[1] = 'TAB';
        lines.push(record.join('\t'));
    }
    fs.writeFileSync(index_path, lines.join('\n'));
}


function try_read_index(index_path) {
    var content = null;
    try {
        content = fs.readFileSync(index_path, 'utf-8');
    } catch (e) {
        console.log('An error has occured while reading index ' + index_path + '; Error: ' + e);
        return [];
    }
    var lines = content.split('\n');
    var records = [];
    for (var i = 0; i < lines.length; i++) {
        if (!lines[i])
            continue;
        var record = lines[i].split('\t');
        records.push(unescape_index_record(record));
    }
    return records;
}


function update_table_record(file_path, delim, policy) {
    if (!file_path)
        return;
    var home_dir = os.homedir();
    var index_path = path.join(home_dir, '.rbql_table_index');
    var records = try_read_index(index_path);
    var new_record = [file_path, delim, policy, ''];
    var record_key = file_path;
    update_records(records, record_key, new_record);
    if (records.length > 100) {
        records.splice(0, 1);
    }
    write_index(records, index_path);
}


function enable_for_selected_delim(policy) {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
        console.log('delim selection failure: editor not found');
        return;
    }
    var rainbow_delim = editor.getSelectedText();
    if (rainbow_delim.length != 1) {
        atom.notifications.addError('Please select exactly one character to use as rainbow delimiter');
        return;
    }
    var standard_delims = '\t|,;';
    var simple_delims = '\t !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    if (simple_delims.indexOf(rainbow_delim) == -1) {
        atom.notifications.addError('Selected separator is not supported');
        return;
    }
    if (policy == 'quoted' && standard_delims.indexOf(rainbow_delim) == -1) {
        // By limiting number of standard dialect delims we are helping users to make the right dialect choice
        atom.notifications.addError('"Standard" dialect should not be used with unconventional separators. Try "Simple" dialect instead');
        return;
    }
    do_set_rainbow_grammar(editor, rainbow_delim, policy);
}


function enable_rainbow_quoted() {
    enable_for_selected_delim('quoted');
}


function enable_rainbow_simple() {
    enable_for_selected_delim('simple');
}


function disable_rainbow() {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor)
        return;
    if (get_rainbow_scope(editor.getGrammar())) {
        do_disable_rainbow(editor);
    }
}


function handle_rbql_report(report, delim, policy) {
    if (!report) {
        console.error('Empty rbql report');
        return;
    }
    if (report.hasOwnProperty('error_type') || report.hasOwnProperty('error_msg')) {
        let error_type = report['error type'] || 'Error';
        let error_msg = report['error_msg'] || 'Unknown Error';
        atom.notifications.addError(`${error_type}: ${error_msg}`, {'dismissable': true});
        return;
    }
    var warnings = [];
    if (report.hasOwnProperty('warnings')) {
        warnings = report['warnings'];
    }
    for (let i = 0; i < warnings.length; i++) {
        atom.notifications.addWarning(warnings[i], {'dismissable': true});
    }
    if (!report.hasOwnProperty('result_path')) {
        atom.notifications.addError('Something went terribly wrong: RBQL JSON report is missing result_path attribute');
        return;
    }
    var dst_table_path = report['result_path'];
    console.log('dst_table_path: ' + dst_table_path);
    autodetection_stoplist.add(dst_table_path);
    atom.workspace.open(dst_table_path).then(editor => {
        if (!editor || policy == 'monocolumn')
            return;
        do_set_rainbow_grammar(editor, delim, policy, false, false);
    });
}


function handle_command_result(output_path, error_code, stdout, stderr, report_handler) {
    console.log('error_code: ' + String(error_code));
    console.log('stdout: ' + String(stdout));
    console.log('stderr: ' + String(stderr));

    var report = null;
    var json_report = stdout;
    if (error_code || !json_report.length || stderr.length) {
        let error_msg = "Unknown Integration Error";
        if (stderr.length) {
            error_msg += '\nstderr: ' + stderr;
        }
        report = {"error_type": "Integration", "error_msg": error_msg};
    } else {
        try {
            report = JSON.parse(json_report);
        } catch (e) {
            report = {"error_type": "Integration", "error_msg": "Report JSON parsing error"};
        }
    }
    report['result_path'] = output_path;
    report_handler(report);
}


function run_command(cmd, args, close_and_error_guard, callback_func) {
    var command = child_process.spawn(cmd, args, {'windowsHide': true});
    var stdout = '';
    var stderr = '';
    command.stdout.on('data', function(data) {
        stdout += data.toString();
    });
    command.stderr.on('data', function(data) {
        stderr += data.toString();
    });
    command.on('close', function(code) {
        console.log('child_process got "close" event');
        if (!close_and_error_guard['process_reported']) {
            close_and_error_guard['process_reported'] = true;
            callback_func(code, stdout, stderr);
        }
    });
    command.on('error', function(error) {
        console.log('child_process got "error" event');
        let error_msg = error ? error.name + ': ' + error.message : '';
        if (!close_and_error_guard['process_reported']) {
            close_and_error_guard['process_reported'] = true;
            callback_func(1, '', 'Something went wrong. Make sure you have python installed and added to PATH variable in your OS. Or you can use it with JavaScript instead - it should work out of the box\nDetails:\n' + error_msg);
        }
    });
}


function get_dst_table_name(input_path, output_delim) {
    var table_name = path.basename(input_path);
    var orig_extension = path.extname(table_name);
    var delim_ext_map = {'\t': '.tsv', ',': '.csv'};
    var dst_extension = '.txt';
    if (delim_ext_map.hasOwnProperty(output_delim)) {
        dst_extension = delim_ext_map[output_delim];
    } else if (orig_extension.length > 1) {
        dst_extension = orig_extension;
    }
    return table_name + dst_extension;
}



function exception_to_error_info(e) {
    let exceptions_type_map = {
        'RbqlRuntimeError': 'query execution',
        'RbqlParsingError': 'query parsing',
        'RbqlIOHandlingError': 'IO handling'
    };
    let error_type = 'unexpected';
    if (e.constructor && e.constructor.name && exceptions_type_map.hasOwnProperty(e.constructor.name)) {
        error_type = exceptions_type_map[e.constructor.name];
    }
    let error_msg = e.hasOwnProperty('message') ? e.message : String(e);
    return [error_type, error_msg];
}


function run_rbql_native(input_path, query, delim, policy, output_path, output_delim, output_policy, csv_encoding, report_handler) {
    if (rbql_csv === null)
        rbql_csv = require('./rbql_core/rbql-js/rbql_csv.js');
    let warnings = [];
    rbql_csv.query_csv(query, input_path, delim, policy, output_path, output_delim, output_policy, csv_encoding, warnings, false, '', {'bulk_read': true}).then(() => {
        report_handler({'result_path': output_path, 'warnings': warnings});
    }).catch(e => {
        let [error_type, error_msg] = exception_to_error_info(e);
        report_handler({'result_type': error_type, 'error_msg': error_msg});
    });
}


function run_rbql_query(input_path, delim, policy, backend_language, rbql_query, report_handler) {
    last_rbql_queries.set(input_path, rbql_query);
    var cmd = 'python';
    const test_marker = 'test ';
    let close_and_error_guard = {'process_reported': false};
    var output_delim = delim;
    var output_policy = policy;
    let encoding = atom.config.get('rainbow-csv.rbql_encoding');
    let output_path = path.join(os.tmpdir(), get_dst_table_name(input_path, output_delim));
    if (rbql_query.startsWith(test_marker)) {
        if (rbql_query.indexOf('nopython') != -1) {
            cmd = 'nopython';
        }
        let mock_script_path = path.join(atom.packages.resolvePackagePath('rainbow-csv'), 'rbql mock', 'rbql_mock.py');
        let args = [mock_script_path, rbql_query];
        run_command(cmd, args, close_and_error_guard, function(error_code, stdout, stderr) { handle_command_result(output_path, error_code, stdout, stderr, report_handler); });
        return;
    }
    if (backend_language == 'JavaScript') {
        run_rbql_native(input_path, rbql_query, delim, policy, output_path, output_delim, output_policy, encoding, report_handler);
    } else {
        let rbql_exec_path = path.join(atom.packages.resolvePackagePath('rainbow-csv'), 'rbql_core', 'vscode_rbql.py');
        let cmd_safe_query = Buffer.from(rbql_query, "utf-8").toString("base64");
        let args = [rbql_exec_path, cmd_safe_query, input_path, delim, policy, output_path, output_delim, output_policy, encoding];
        run_command(cmd, args, close_and_error_guard, function(error_code, stdout, stderr) { handle_command_result(output_path, error_code, stdout, stderr, report_handler); });
    }
}


function close_rbql_panel() {
    if (rbql_panel) {
        rbql_panel.destroy();
    }
    rbql_panel = null;
}


function start_rbql() {
    if (rbql_panel)
        return;
    let editor = atom.workspace.getActiveTextEditor();
    if (!editor)
        return;
    let delim = '';
    let policy = 'monocolumn';
    let rainbow_scope = get_rainbow_scope(editor.getGrammar());
    if (rainbow_scope) {
        delim = rainbow_scope.delim;
        policy = rainbow_scope.policy;
    }
    let backend_language = atom.config.get('rainbow-csv.rbql_backend');
    let file_path = editor.getPath();

    let cursor_position = editor.getCursorBufferPosition();
    let line_num = cursor_position ? cursor_position.row : 0;
    let aligning_line = editor.lineTextForBufferRow(line_num);
    if (aligning_line == '') {
        aligning_line = editor.lineTextForBufferRow(0);
    }
    let fields = csv_utils.smart_split(aligning_line, delim, policy, true)[0];

    let rbql_panel_node = document.createElement('div');
    let column_names_node = document.createElement('div');
    let input_node = document.createElement('input');
    let run_button = document.createElement('button');
    let cancel_button = document.createElement('button');
    let help_link = document.createElement('a');
    let backend_lang_info = document.createElement('span');

    backend_lang_info.textContent = backend_language + ' - backend language'
    help_link.textContent = 'Help';
    run_button.textContent = 'Run';
    run_button.setAttribute('style', 'color: #000000; background-color: #bfbfbf');
    cancel_button.textContent = 'Cancel';

    backend_lang_info.setAttribute('style', 'margin-left: 10px');
    help_link.setAttribute('href', 'https://github.com/mechatroner/RBQL#rbql-rainbow-query-language-description');
    cancel_button.setAttribute('style', 'margin-right: 20px; color: #000000; background-color: #bfbfbf');
    input_node.setAttribute('type', 'text');
    input_node.setAttribute('placeholder', 'select a1, a2 where a2 != "foobar" order by a1 limit 20');
    input_node.setAttribute('style', 'width: 70%; color: black');
    input_node.setAttribute('class', 'native-key-bindings'); // See https://discuss.atom.io/t/input-text-element-cant-backspace/4981/5

    let total_align_len = 0;
    let total_header_len = 0;
    let span_node = document.createElement('span');
    span_node.textContent = '\xa0NR' + '\xa0'.repeat(3);
    column_names_node.appendChild(span_node);
    for (let i = 0; i < fields.length; i++) {
        total_align_len += fields[i].length + 1;
        let span_node = document.createElement('span');
        span_node.setAttribute('style', 'color:' + get_column_color(i));
        let aligned_col_name = 'a' + (i + 1) + '\xa0';
        total_header_len += aligned_col_name.length;
        if (total_header_len < total_align_len) {
            aligned_col_name += '\xa0'.repeat(total_align_len - total_header_len);
            total_header_len = total_align_len;
        }
        span_node.textContent = aligned_col_name;
        column_names_node.appendChild(span_node);
    }
    rbql_panel_node.appendChild(column_names_node);
    rbql_panel_node.appendChild(input_node);
    rbql_panel_node.appendChild(run_button);
    rbql_panel_node.appendChild(cancel_button);
    rbql_panel_node.appendChild(help_link);
    rbql_panel_node.appendChild(backend_lang_info);
    rbql_panel_node.setAttribute('style', 'font-size: var(--editor-font-size); font-family: var(--editor-font-family); line-height: var(--editor-line-height)');
    rbql_panel = atom.workspace.addBottomPanel({'item': rbql_panel_node});
    if (last_rbql_queries.has(file_path)) {
        input_node.value = last_rbql_queries.get(file_path);
    }
    input_node.focus();

    var report_handler = function(report) {
        handle_rbql_report(report, delim, policy);
        if (!report || report['error_type'] || report['error_msg'])
            return;
        close_rbql_panel();
    }

    cancel_button.addEventListener("click", () => { close_rbql_panel(); });
    run_button.addEventListener("click", () => { 
        let rbql_query = input_node.value;
        run_rbql_query(file_path, delim, policy, backend_language, rbql_query, report_handler); 
    });
    input_node.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            let rbql_query = input_node.value;
            run_rbql_query(file_path, delim, policy, backend_language, rbql_query, report_handler);
        }
        if (event.keyCode == 27) {
            close_rbql_panel();
        }
    });
}


function consumeStatusBar(status_bar) {
    var ui_column_display = document.createElement('div');
    ui_column_display.textContent = '';
    ui_column_display.setAttribute('class', 'inline-block');
    status_bar_tile_column = status_bar.addLeftTile({item: ui_column_display, priority: 10});

    var rbql_button = document.createElement('div');
    rbql_button.onclick = start_rbql;
    rbql_button.textContent = 'RBQL';
    rbql_button.setAttribute('class', 'inline-block');
    atom.tooltips.add(rbql_button, {title: 'Rainbow CSV: Run SQL-like RBQL query'})
    status_bar_tile_rbql = status_bar.addLeftTile({item: rbql_button, priority: 9});
}


let rainbow_config = {
    'autodetection': {type: 'boolean', default: true, title: "Table files autodetection", description: 'Enable content-based autodetection for csv and tsv files that do not have "*.csv" or "*.tsv" extensions'},
    'rbql_backend': {type: 'string', default: 'JavaScript', enum: ['JavaScript', 'Python'], title: "RBQL backend language", description: 'RBQL backend language. JavaScript works out of the box. To use Python you need python interpreter installed in your OS.'},
    'rbql_encoding': {type: 'string', default: 'utf-8', enum: ['utf-8', 'latin-1'], title: "RBQL encoding", description: 'RBQL encoding for input and output CSV files'},
    'rainbow1': {type: 'color', default: '#E6194B', title: "Rainbow Color 1"},
    'rainbow2': {type: 'color', default: '#3CB44B', title: "Rainbow Color 2"},
    'rainbow3': {type: 'color', default: '#FFE119', title: "Rainbow Color 3"},
    'rainbow4': {type: 'color', default: '#0082C8', title: "Rainbow Color 4"},
    'rainbow5': {type: 'color', default: '#FABEBE', title: "Rainbow Color 5"},
    'rainbow6': {type: 'color', default: '#46F0F0', title: "Rainbow Color 6"},
    'rainbow7': {type: 'color', default: '#F032E6', title: "Rainbow Color 7"},
    'rainbow8': {type: 'color', default: '#008080', title: "Rainbow Color 8"},
    'rainbow9': {type: 'color', default: '#F58231', title: "Rainbow Color 9"},
    'rainbow10': {type: 'color', default: '#FFFFFF', title: "Rainbow Color 10"}
};


exports.config = rainbow_config;
exports.activate = activate;
exports.deactivate = deactivate;
exports.consumeStatusBar = consumeStatusBar;
