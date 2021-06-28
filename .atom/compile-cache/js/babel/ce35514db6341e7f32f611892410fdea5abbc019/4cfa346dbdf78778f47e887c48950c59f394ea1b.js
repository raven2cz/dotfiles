var getTestFile = _asyncToGenerator(function* (filePath) {
  var numParagraphs = arguments.length <= 1 || arguments[1] === undefined ? 30 : arguments[1];
  var numSentences = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

  var str = '';
  var parLengths = new Array(numParagraphs);
  for (var i = 0; i < numParagraphs; i++) {
    var par = chance.paragraph({ sentences: numSentences });
    str = str.concat(par, '\n');
    parLengths[i] = par.length;
  }
  yield writeFile(filePath, str);
  return { fileLegth: str.length, parLengths: parLengths };
}

/* ************************************************************************* */

);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _chance = require('chance');

var _atom = require('atom');

var _distEditor = require('../dist/editor');

var _distEditor2 = _interopRequireDefault(_distEditor);

var _fs = require('fs');

var _util = require('util');

var chance = new _chance.Chance();

var writeFile = (0, _util.promisify)(_fs.writeFile);

/* ************************************************************************* */

function getRanomPoint(parLengths) {
  var randomRow = chance.integer({ min: 0, max: parLengths.length });
  var randomColumn = chance.integer({ min: 0, max: parLengths[randomRow] });
  return [randomRow, randomColumn];
}

function getRandomRange(parLengths) {
  var pointsSorted = [getRanomPoint(parLengths), getRanomPoint(parLengths)].sort(function (p1, p2) {
    return p1[0] - p2[0];
  });
  return _atom.Range.fromObject(pointsSorted);
}

function generateRandomMessage(filePath) {
  var range = arguments.length <= 1 || arguments[1] === undefined ? getRandomRange() : arguments[1];
  var severity = arguments.length <= 2 || arguments[2] === undefined ? chance.pickone(['error', 'warning', 'info']) : arguments[2];

  return {
    key: chance.unique(chance.string, 1)[0],
    version: 2,
    severity: severity,
    excerpt: String(chance.integer()),
    location: { file: filePath, position: range },
    description: chance.sentence({ words: 20 })
  };
}

describe('Editor benchmark', function () {
  // parameters
  var numParagraphs = 300;
  var numSentences = 10;
  var filePath = './benchmark/benchmarkTestFile.txt';
  var messageNumlist = [5, 10, 20, 50, 70, 100, 200, 500, 800, 1000]; // test for different number of messages

  var editor = undefined;
  var textEditor = undefined;
  var parLengths = undefined;
  // let fileLength: number
  beforeEach(_asyncToGenerator(function* () {
    // make a test file
    var testFileProps = yield getTestFile(filePath, numParagraphs, numSentences);
    parLengths = testFileProps.parLengths;
    // fileLength = testFileProps.fileLength

    // open the test file
    yield atom.workspace.open(filePath);

    // make a linter editor instance
    textEditor = atom.workspace.getActiveTextEditor();
    // Attache text editor
    jasmine.attachToDOM(textEditor.getElement());

    // create linter Editor instance
    editor = new _distEditor2['default'](textEditor);

    // Activate linter-ui-default
    atom.packages.triggerDeferredActivationHooks();
    atom.packages.triggerActivationHook('core:loaded-shell-environment');

    atom.packages.loadPackage('linter-ui-default');
  }));

  it('apply benchmark', function () {
    console.log('it adds the messages to the editor and then removes them');

    // test for different number of messages
    for (var messageNum of messageNumlist) {
      // get linter messages
      var messages = new Array(messageNum);
      for (var i = 0; i < messageNum; i++) {
        messages[i] = generateRandomMessage(filePath, getRandomRange(parLengths));
      }

      console.log('\n number of messages are ' + messageNum + ' \n');

      // Add
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);

      var ti_add = window.performance.now();

      editor.apply(messages, []);

      var tf_add = window.performance.now();

      expect(textEditor.getBuffer().getMarkerCount()).toBe(messageNum);
      console.log('Adding ' + messageNum + ' linter messages took ' + ' '.repeat(50 - messageNum.toString().length) + ' ' + (tf_add - ti_add).toFixed(3) + ' ms');

      // Remove
      var ti_remove = window.performance.now();

      editor.apply([], messages);

      var tf_remove = window.performance.now();

      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
      console.log('Removing ' + messageNum + ' linter messages took ' + ' '.repeat(48 - messageNum.toString().length) + ' ' + (tf_remove - ti_remove).toFixed(3) + ' ms');
    }
  });

  afterEach(function () {
    editor.dispose();
    atom.workspace.destroyActivePaneItem();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9iZW5jaG1hcmsvYmVuY2htYXJrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJJQXlDZSxXQUFXLHFCQUExQixXQUEyQixRQUFnQixFQUF5RDtNQUF2RCxhQUFxQix5REFBRyxFQUFFO01BQUUsWUFBb0IseURBQUcsRUFBRTs7QUFDaEcsTUFBSSxHQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLE1BQU0sVUFBb0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNyRCxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLFFBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQTtBQUN6RCxPQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDM0IsY0FBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUE7R0FDM0I7QUFDRCxRQUFNLFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDOUIsU0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsQ0FBQTtDQUM3Qzs7Ozs7Ozs7OztzQkFsRHNCLFFBQVE7O29CQUdULE1BQU07OzBCQUVULGdCQUFnQjs7OztrQkFDTyxJQUFJOztvQkFDcEIsTUFBTTs7QUFOaEMsSUFBTSxNQUFNLEdBQUcsb0JBQVksQ0FBQTs7QUFPM0IsSUFBTSxTQUFTLEdBQUcsbUNBQXVCLENBQUE7Ozs7QUFJekMsU0FBUyxhQUFhLENBQUMsVUFBb0IsRUFBb0I7QUFDN0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0FBQ3BFLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQzNFLFNBQU8sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUE7Q0FDakM7O0FBRUQsU0FBUyxjQUFjLENBQUMsVUFBb0IsRUFBRTtBQUM1QyxNQUFNLFlBQVksR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQzNGLFdBQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUNyQixDQUFDLENBQUE7QUFDRixTQUFPLFlBQU0sVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO0NBQ3RDOztBQUVELFNBQVMscUJBQXFCLENBQzVCLFFBQWlCLEVBR1I7TUFGVCxLQUFhLHlEQUFHLGNBQWMsRUFBRTtNQUNoQyxRQUFpQix5REFBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFaEUsU0FBTztBQUNMLE9BQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFdBQU8sRUFBRSxDQUFDO0FBQ1YsWUFBUSxFQUFSLFFBQVE7QUFDUixXQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQyxZQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7QUFDN0MsZUFBVyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7R0FDNUMsQ0FBQTtDQUNGOztBQWdCRCxRQUFRLENBQUMsa0JBQWtCLEVBQUUsWUFBWTs7QUFFdkMsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFBO0FBQ3pCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQTtBQUN2QixNQUFNLFFBQVEsR0FBRyxtQ0FBbUMsQ0FBQTtBQUNwRCxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBOztBQUVwRSxNQUFJLE1BQWMsWUFBQSxDQUFBO0FBQ2xCLE1BQUksVUFBc0IsWUFBQSxDQUFBO0FBQzFCLE1BQUksVUFBa0IsWUFBQSxDQUFBOztBQUV0QixZQUFVLG1CQUFDLGFBQWtCOztBQUUzQixRQUFNLGFBQWEsR0FBRyxNQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQzlFLGNBQVUsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFBOzs7O0FBSXJDLFVBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7OztBQUduQyxjQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBOztBQUVqRCxXQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBOzs7QUFHNUMsVUFBTSxHQUFHLDRCQUFXLFVBQVUsQ0FBQyxDQUFBOzs7QUFHL0IsUUFBSSxDQUFDLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRSxDQUFBO0FBQzlDLFFBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsK0JBQStCLENBQUMsQ0FBQTs7QUFFcEUsUUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtHQUMvQyxFQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLGlCQUFpQixFQUFFLFlBQVk7QUFDaEMsV0FBTyxDQUFDLEdBQUcsQ0FBQywwREFBMEQsQ0FBQyxDQUFBOzs7QUFHdkUsU0FBSyxJQUFNLFVBQVUsSUFBSSxjQUFjLEVBQUU7O0FBRXZDLFVBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3RDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDbkMsZ0JBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7T0FDMUU7O0FBRUQsYUFBTyxDQUFDLEdBQUcsZ0NBQThCLFVBQVUsU0FBTSxDQUFBOzs7QUFHekQsWUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFdkQsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTs7QUFFdkMsWUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRTFCLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUE7O0FBRXZDLFlBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDaEUsYUFBTyxDQUFDLEdBQUcsYUFDQyxVQUFVLDhCQUF5QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQUksQ0FDNUYsTUFBTSxHQUFHLE1BQU0sQ0FBQSxDQUNmLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FDYixDQUFBOzs7QUFHRCxVQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFBOztBQUUxQyxZQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFMUIsVUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTs7QUFFMUMsWUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN2RCxhQUFPLENBQUMsR0FBRyxlQUNHLFVBQVUsOEJBQXlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBSSxDQUM5RixTQUFTLEdBQUcsU0FBUyxDQUFBLENBQ3JCLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FDYixDQUFBO0tBQ0Y7R0FDRixDQUFDLENBQUE7O0FBRUYsV0FBUyxDQUFDLFlBQVk7QUFDcEIsVUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtHQUN2QyxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2JlbmNobWFyay9iZW5jaG1hcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IHsgQ2hhbmNlIH0gZnJvbSAnY2hhbmNlJ1xuY29uc3QgY2hhbmNlID0gbmV3IENoYW5jZSgpXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2UgfSBmcm9tICcuLi9saWIvdHlwZXMuZCdcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRWRpdG9yIGZyb20gJy4uL2Rpc3QvZWRpdG9yJ1xuaW1wb3J0IHsgd3JpdGVGaWxlIGFzIHdyaXRlRmlsZVJhdyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcbmNvbnN0IHdyaXRlRmlsZSA9IHByb21pc2lmeSh3cml0ZUZpbGVSYXcpXG5cbi8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cblxuZnVuY3Rpb24gZ2V0UmFub21Qb2ludChwYXJMZW5ndGhzOiBudW1iZXJbXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCByYW5kb21Sb3cgPSBjaGFuY2UuaW50ZWdlcih7IG1pbjogMCwgbWF4OiBwYXJMZW5ndGhzLmxlbmd0aCB9KVxuICBjb25zdCByYW5kb21Db2x1bW4gPSBjaGFuY2UuaW50ZWdlcih7IG1pbjogMCwgbWF4OiBwYXJMZW5ndGhzW3JhbmRvbVJvd10gfSlcbiAgcmV0dXJuIFtyYW5kb21Sb3csIHJhbmRvbUNvbHVtbl1cbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tUmFuZ2UocGFyTGVuZ3RoczogbnVtYmVyW10pIHtcbiAgY29uc3QgcG9pbnRzU29ydGVkID0gW2dldFJhbm9tUG9pbnQocGFyTGVuZ3RocyksIGdldFJhbm9tUG9pbnQocGFyTGVuZ3RocyldLnNvcnQoKHAxLCBwMikgPT4ge1xuICAgIHJldHVybiBwMVswXSAtIHAyWzBdXG4gIH0pXG4gIHJldHVybiBSYW5nZS5mcm9tT2JqZWN0KHBvaW50c1NvcnRlZClcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVSYW5kb21NZXNzYWdlKFxuICBmaWxlUGF0aDogP3N0cmluZyxcbiAgcmFuZ2U6ID9SYW5nZSA9IGdldFJhbmRvbVJhbmdlKCksXG4gIHNldmVyaXR5OiA/c3RyaW5nID0gY2hhbmNlLnBpY2tvbmUoWydlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nXSksXG4pOiBNZXNzYWdlIHtcbiAgcmV0dXJuIHtcbiAgICBrZXk6IGNoYW5jZS51bmlxdWUoY2hhbmNlLnN0cmluZywgMSlbMF0sXG4gICAgdmVyc2lvbjogMixcbiAgICBzZXZlcml0eSxcbiAgICBleGNlcnB0OiBTdHJpbmcoY2hhbmNlLmludGVnZXIoKSksXG4gICAgbG9jYXRpb246IHsgZmlsZTogZmlsZVBhdGgsIHBvc2l0aW9uOiByYW5nZSB9LFxuICAgIGRlc2NyaXB0aW9uOiBjaGFuY2Uuc2VudGVuY2UoeyB3b3JkczogMjAgfSksXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0VGVzdEZpbGUoZmlsZVBhdGg6IHN0cmluZywgbnVtUGFyYWdyYXBoczogbnVtYmVyID0gMzAsIG51bVNlbnRlbmNlczogbnVtYmVyID0gMTApIHtcbiAgbGV0IHN0cjogc3RyaW5nID0gJydcbiAgY29uc3QgcGFyTGVuZ3RoczogbnVtYmVyW10gPSBuZXcgQXJyYXkobnVtUGFyYWdyYXBocylcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1QYXJhZ3JhcGhzOyBpKyspIHtcbiAgICBjb25zdCBwYXIgPSBjaGFuY2UucGFyYWdyYXBoKHsgc2VudGVuY2VzOiBudW1TZW50ZW5jZXMgfSlcbiAgICBzdHIgPSBzdHIuY29uY2F0KHBhciwgJ1xcbicpXG4gICAgcGFyTGVuZ3Roc1tpXSA9IHBhci5sZW5ndGhcbiAgfVxuICBhd2FpdCB3cml0ZUZpbGUoZmlsZVBhdGgsIHN0cilcbiAgcmV0dXJuIHsgZmlsZUxlZ3RoOiBzdHIubGVuZ3RoLCBwYXJMZW5ndGhzIH1cbn1cblxuLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuXG5kZXNjcmliZSgnRWRpdG9yIGJlbmNobWFyaycsIGZ1bmN0aW9uICgpIHtcbiAgLy8gcGFyYW1ldGVyc1xuICBjb25zdCBudW1QYXJhZ3JhcGhzID0gMzAwXG4gIGNvbnN0IG51bVNlbnRlbmNlcyA9IDEwXG4gIGNvbnN0IGZpbGVQYXRoID0gJy4vYmVuY2htYXJrL2JlbmNobWFya1Rlc3RGaWxlLnR4dCdcbiAgY29uc3QgbWVzc2FnZU51bWxpc3QgPSBbNSwgMTAsIDIwLCA1MCwgNzAsIDEwMCwgMjAwLCA1MDAsIDgwMCwgMTAwMF0gLy8gdGVzdCBmb3IgZGlmZmVyZW50IG51bWJlciBvZiBtZXNzYWdlc1xuXG4gIGxldCBlZGl0b3I6IEVkaXRvclxuICBsZXQgdGV4dEVkaXRvcjogVGV4dEVkaXRvclxuICBsZXQgcGFyTGVuZ3RoczogbnVtYmVyXG4gIC8vIGxldCBmaWxlTGVuZ3RoOiBudW1iZXJcbiAgYmVmb3JlRWFjaChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgLy8gbWFrZSBhIHRlc3QgZmlsZVxuICAgIGNvbnN0IHRlc3RGaWxlUHJvcHMgPSBhd2FpdCBnZXRUZXN0RmlsZShmaWxlUGF0aCwgbnVtUGFyYWdyYXBocywgbnVtU2VudGVuY2VzKVxuICAgIHBhckxlbmd0aHMgPSB0ZXN0RmlsZVByb3BzLnBhckxlbmd0aHNcbiAgICAvLyBmaWxlTGVuZ3RoID0gdGVzdEZpbGVQcm9wcy5maWxlTGVuZ3RoXG5cbiAgICAvLyBvcGVuIHRoZSB0ZXN0IGZpbGVcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKVxuXG4gICAgLy8gbWFrZSBhIGxpbnRlciBlZGl0b3IgaW5zdGFuY2VcbiAgICB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgLy8gQXR0YWNoZSB0ZXh0IGVkaXRvclxuICAgIGphc21pbmUuYXR0YWNoVG9ET00odGV4dEVkaXRvci5nZXRFbGVtZW50KCkpXG5cbiAgICAvLyBjcmVhdGUgbGludGVyIEVkaXRvciBpbnN0YW5jZVxuICAgIGVkaXRvciA9IG5ldyBFZGl0b3IodGV4dEVkaXRvcilcblxuICAgIC8vIEFjdGl2YXRlIGxpbnRlci11aS1kZWZhdWx0XG4gICAgYXRvbS5wYWNrYWdlcy50cmlnZ2VyRGVmZXJyZWRBY3RpdmF0aW9uSG9va3MoKVxuICAgIGF0b20ucGFja2FnZXMudHJpZ2dlckFjdGl2YXRpb25Ib29rKCdjb3JlOmxvYWRlZC1zaGVsbC1lbnZpcm9ubWVudCcpXG5cbiAgICBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdsaW50ZXItdWktZGVmYXVsdCcpXG4gIH0pXG5cbiAgaXQoJ2FwcGx5IGJlbmNobWFyaycsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnaXQgYWRkcyB0aGUgbWVzc2FnZXMgdG8gdGhlIGVkaXRvciBhbmQgdGhlbiByZW1vdmVzIHRoZW0nKVxuXG4gICAgLy8gdGVzdCBmb3IgZGlmZmVyZW50IG51bWJlciBvZiBtZXNzYWdlc1xuICAgIGZvciAoY29uc3QgbWVzc2FnZU51bSBvZiBtZXNzYWdlTnVtbGlzdCkge1xuICAgICAgLy8gZ2V0IGxpbnRlciBtZXNzYWdlc1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBuZXcgQXJyYXkobWVzc2FnZU51bSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzc2FnZU51bTsgaSsrKSB7XG4gICAgICAgIG1lc3NhZ2VzW2ldID0gZ2VuZXJhdGVSYW5kb21NZXNzYWdlKGZpbGVQYXRoLCBnZXRSYW5kb21SYW5nZShwYXJMZW5ndGhzKSlcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coYFxcbiBudW1iZXIgb2YgbWVzc2FnZXMgYXJlICR7bWVzc2FnZU51bX0gXFxuYClcblxuICAgICAgLy8gQWRkXG4gICAgICBleHBlY3QodGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRNYXJrZXJDb3VudCgpKS50b0JlKDApXG5cbiAgICAgIGNvbnN0IHRpX2FkZCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuXG4gICAgICBlZGl0b3IuYXBwbHkobWVzc2FnZXMsIFtdKVxuXG4gICAgICBjb25zdCB0Zl9hZGQgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcblxuICAgICAgZXhwZWN0KHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TWFya2VyQ291bnQoKSkudG9CZShtZXNzYWdlTnVtKVxuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBBZGRpbmcgJHttZXNzYWdlTnVtfSBsaW50ZXIgbWVzc2FnZXMgdG9vayAkeycgJy5yZXBlYXQoNTAgLSBtZXNzYWdlTnVtLnRvU3RyaW5nKCkubGVuZ3RoKX0gJHsoXG4gICAgICAgICAgdGZfYWRkIC0gdGlfYWRkXG4gICAgICAgICkudG9GaXhlZCgzKX0gbXNgLFxuICAgICAgKVxuXG4gICAgICAvLyBSZW1vdmVcbiAgICAgIGNvbnN0IHRpX3JlbW92ZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuXG4gICAgICBlZGl0b3IuYXBwbHkoW10sIG1lc3NhZ2VzKVxuXG4gICAgICBjb25zdCB0Zl9yZW1vdmUgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcblxuICAgICAgZXhwZWN0KHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TWFya2VyQ291bnQoKSkudG9CZSgwKVxuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBSZW1vdmluZyAke21lc3NhZ2VOdW19IGxpbnRlciBtZXNzYWdlcyB0b29rICR7JyAnLnJlcGVhdCg0OCAtIG1lc3NhZ2VOdW0udG9TdHJpbmcoKS5sZW5ndGgpfSAkeyhcbiAgICAgICAgICB0Zl9yZW1vdmUgLSB0aV9yZW1vdmVcbiAgICAgICAgKS50b0ZpeGVkKDMpfSBtc2AsXG4gICAgICApXG4gICAgfVxuICB9KVxuXG4gIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgZWRpdG9yLmRpc3Bvc2UoKVxuICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG4gIH0pXG59KVxuIl19