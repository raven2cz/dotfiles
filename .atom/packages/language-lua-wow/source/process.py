#
# This script generates the patterns used in lua-wow.cson
#
# Copy the relevate bits from the following sites into the specified file then
# run the script! `python process.py > chunks.cson`
#
#   https://wow.gamepedia.com/Global_functions#FrameXML_Functions
#     - Copy the FrameXML functions into raw_framexml
#   http://wowprogramming.com/docs/widgets
#     - Copy the left-side headers and functions into raw_widget
#   https://www.townlong-yak.com/framexml/
#     - Extract the Helix folder
#     - Run export_helix.lua to generate raw_api and raw_events
#

from __future__ import with_statement, print_function
import re
import sys


class Parser(object):
    def __init__(self, filename):
        self.filename = filename

    @property
    def raw_data(self):
        with open(self.filename) as fp:
            return fp.readlines()


class APIParser(Parser):
    re_split_c = re.compile(ur"^(.+)\.(.+)$")

    chunk_pattern = """  {
    'match': '(?<![^.]\\\\.|:)\\\\b(%s)\\\\b(?=\\\\s*(?:[({"\\\']|\\\\[\\\\[))'
    'name': 'support.function.wow.%s'
  }"""

    # standard env for lua 5.1.4
    std_lua = [
        '_G', '_VERSION', 'assert', 'collectgarbage',
        'coroutine.create', 'coroutine.resume', 'coroutine.running', 'coroutine.status', 'coroutine.wrap', 'coroutine.yield',
        'debug.debug', 'debug.getfenv', 'debug.gethook', 'debug.getinfo', 'debug.getlocal', 'debug.getmetatable', 'debug.getregistry',
        'debug.getupvalue', 'debug.setfenv', 'debug.sethook', 'debug.setlocal', 'debug.setmetatable', 'debug.setupvalue', 'debug.traceback',
        'dofile', 'error', 'gcinfo', 'getfenv', 'getmetatable',
        'io.close', 'io.flush', 'io.input', 'io.lines', 'io.open', 'io.output', 'io.popen', 'io.read', 'io.stderr', 'io.stdin', 'io.stdout',
        'io.tmpfile', 'io.type', 'io.write',
        'ipairs', 'load', 'loadfile', 'loadstring',
        'math.abs', 'math.acos', 'math.asin', 'math.atan', 'math.atan2', 'math.ceil', 'math.cos', 'math.cosh', 'math.deg',
        'math.exp', 'math.floor', 'math.fmod', 'math.frexp', 'math.ldexp', 'math.log', 'math.log10', 'math.max', 'math.min',
        'math.modf', 'math.pow', 'math.rad', 'math.random', 'math.sin', 'math.sinh', 'math.sqrt', 'math.tan', 'math.tanh',
        'module', 'newproxy', 'next',
        'os.clock', 'os.date', 'os.difftime', 'os.execute', 'os.exit', 'os.getenv', 'os.remove', 'os.rename', 'os.setlocale', 'os.time', 'os.tmpname',
        'pairs', 'pcall', 'rawequal', 'rawget', 'rawset', 'require', 'select', 'setfenv', 'setmetatable',
        'string.byte', 'string.char', 'string.dump', 'string.find', 'string.format', 'string.gfind', 'string.gmatch', 'string.gsub',
        'string.len', 'string.lower', 'string.match', 'string.rep', 'string.reverse', 'string.sub', 'string.upper',
        'table.concat', 'table.foreach', 'table.foreachi', 'table.getn', 'table.insert', 'table.maxn', 'table.pack',
        'table.remove', 'table.setn', 'table.sort',
        'tonumber', 'tostring', 'type', 'unpack', 'xpcall'
    ]

    def clean(self, data):
        api = []
        lua = []

        tables = {}
        last_table = None

        for line in data:
            line = line.strip()

            if line:
                cleaned = api
                if line == line.lower():
                    cleaned = lua
                    if line in self.std_lua:
                        continue

                # compress collections
                if '.' in line:
                    table, func = self.re_split_c.match(line).groups()
                    if table not in tables:
                        if last_table:
                            cleaned.append(ur'%s\\.(%s)' % (last_table, u'|'.join(tables[last_table])))

                        tables[table] = []
                        last_table = table

                    tables[table].append(func)
                else:
                    if last_table:
                        cleaned.append(ur'%s\\.(%s)' % (last_table, u'|'.join(tables[last_table])))
                        last_table = None

                    cleaned.append(line)

        return { 'lua': lua, 'api': api }

    @property
    def data(self):
        return self.clean(self.raw_data)

    def process(self):
        data = None
        try:
            data = self.data
        except IOError, message:
            print(message, file=sys.stderr)
            return

        for header, group in data.iteritems():
            print(self.chunk_pattern % (u'|'.join(group), header))


class FrameXMLParser(Parser):
    chunk_pattern = """  {
    'match': '(?<![^.]\\\\.|:)\\\\b(%s)\\\\b(?=\\\\s*(?:[({"\\\']|\\\\[\\\\[))'
    'name': 'support.function.wow.framexml'
  }"""

    @property
    def data(self):
        cleaned = []

        for line in self.raw_data:
            cleaned.append(line.strip())

        return cleaned

    def process(self):
        data = None
        try:
            data = self.data
        except IOError, message:
            print(message, file=sys.stderr)
            return

        print(self.chunk_pattern % u'|'.join(data))



class EventParser(Parser):
    chunk_pattern = r"""  {
    'match': '(\'|")(%s)\\1'
    'name': 'constant.wow.event'
  }"""

    @property
    def data(self):
        cleaned = []

        for line in self.raw_data:
            cleaned.append(line.strip())

        return cleaned

    def process(self):
        data = None
        try:
            data = self.data
        except IOError, message:
            print(message, file=sys.stderr)
            return

        print(self.chunk_pattern % u'|'.join(data))


class WidgetParser(Parser):
    re_strip_forward = re.compile(ur"[^=]+= (\w+:\w+\().+")
    re_strip_desc = re.compile(ur"^([^\ ]+) ", re.I)
    re_parse = re.compile(ur"([^:]+):([^\(]+)", re.I)

    chunk_pattern = r"""  {
    'match': '(?<=[.:])\\s*\\b(%s)\\b(?=[( {])'
    'name': 'support.function.wow.widget.%s'
  }"""

    chunk_list = set([
        'ArchaeologyDigSiteFrame',
        'Alpha',
        'Animation',
        'AnimationGroup',
        'Button',
        'Browser',
        'CheckButton',
        'ColorSelect',
        'ControlPoint',
        'Cooldown',
        'DressUpModel',
        'EditBox',
        'Font',
        'FontInstance',
        'FontString',
        'Frame',
        'GameTooltip',
        'LayeredRegion',
        'MessageFrame',
        'Minimap',
        'MovieFrame',
        'ParentedObject',
        'Path',
        'PlayerModel',
        'QuestPOIFrame',
        'Region',
        'Rotation',
        'Scale',
        'ScenarioPOIFrame',
        'ScriptObject',
        'ScrollFrame',
        'ScrollingMessageFrame',
        'SimpleHTML',
        'Slider',
        'StatusBar',
        'TabardModel',
        'Texture',
        'Translation',
        'UIObject',
        'VisibleRegion'
    ])

    hierarchy = {
        # noqa
        'process_order': ['PlayerModel', 'Button', 'Frame', 'LayeredRegion', 'VisibleRegion', 'Region', 'Animation', 'ParentedObject', 'FontInstance', 'UIObject', 'ScriptObject'],

        'ScriptObject': ['Frame', 'Animation', 'AnimationGroup'],
        'UIObject': ['ParentedObject', 'FontInstance'],
            'FontInstance': ['FontString', 'Font', 'EditBox', 'MessageFrame', 'ScrollingMessageFrame'],
            'ParentedObject': ['Region', 'ControlPoint', 'AnimationGroup', 'Animation'],
                'Animation': ['Alpha', 'Path', 'Rotation', 'Scale', 'Translation'],
                'Region': ['VisibleRegion'],
                    'VisibleRegion': ['LayeredRegion', 'Frame'],
                        'LayeredRegion': ['Texture', 'FontString'],
                        'Frame': ['ArchaeologyDigSiteFrame', 'Browser', 'Button', 'ColorSelect', 'Cooldown', 'GameTooltip', 'Minimap', 'MovieFrame', 'PlayerModel', 'QuestPOIFrame', 'ScenarioPOIFrame', 'ScrollFrame', 'SimpleHTML', 'Slider', 'StatusBar', 'EditBox', 'MessageFrame', 'ScrollingMessageFrame'],
                            'Button': ['CheckButton'],
                            'PlayerModel': ['TabardModel', 'DressUpModel'],
    }

    @property
    def data(self):
        raw = self.raw_data
        cleaned = []

        for line in raw:
            line = line.strip()

            if not line:
                continue

            match = None
            if u"=" in line:
                match = self.re_strip_forward.match(line)

            if not match:
                match = self.re_strip_desc.match(line)

            if match:
                cleaned.append(match.groups()[0])

        return cleaned

    def clean_chunks(self, chunks):
        chunk_sets = dict((header, set(funcs)) for header, funcs in chunks.items())
        new_chunks = dict((header, set(funcs)) for header, funcs in chunks.items())

        # self.hierarchy['process_order'].reverse()
        for header in self.hierarchy['process_order']:
            children = self.hierarchy[header]

            # get common funcs
            common = chunk_sets[header].copy()
            for child in children:
                common.intersection_update(chunk_sets[child])

            for child in children:
                new_chunks[child].difference_update(common)

            diff = common == chunk_sets[header]

            if not diff:
                print('fuck', file=sys.stderr)
                print(header, chunk_sets[header].difference(common), file=sys.stderr)

        return new_chunks

    def process(self):
        data = None
        try:
            data = self.data
        except IOError, message:
            print(message, file=sys.stderr)
            return

        chunks = {}
        for line in data:
            if line.strip() in self.chunk_list:
                continue

            match = self.re_parse.match(line.strip())

            if not match:
                print("Line not matched: %s" % line, file=sys.stderr)
                continue

            header, func = match.groups()

            if header not in self.chunk_list:
                print("Header not found: %s" % header, file=sys.stderr)

            if header not in chunks:
                chunks[header] = []

            chunks[header].append(func)

        chunks = self.clean_chunks(chunks)

        for header, chunk in chunks.iteritems():
            print(self.chunk_pattern % (u'|'.join(chunk), header))


if __name__ == '__main__':
    APIParser('raw_api').process()
    FrameXMLParser('raw_framexml').process()
    WidgetParser('raw_widget').process()
    EventParser('raw_events').process()
