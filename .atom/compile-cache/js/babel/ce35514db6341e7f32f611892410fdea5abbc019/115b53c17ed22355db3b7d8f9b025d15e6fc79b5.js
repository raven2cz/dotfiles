Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

function writeConfigFile(content) {
    var reload = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    return new Promise(function (resolve, reject) {
        if (!content) return reject({ success: false, error: 'No content given' });

        _fs2['default'].writeFile(__dirname + '/../../styles/user-settings.less', content, 'utf8', function (error) {
            if (error) return reject({ success: false, error: 'Failed to write settings file' });

            if (reload) {
                (function () {
                    var amuPackage = atom.packages.getLoadedPackage('atom-material-ui');

                    if (amuPackage) {
                        amuPackage.deactivate();
                        setImmediate(function () {
                            return amuPackage.activate();
                        });
                    }
                })();
            }

            return resolve({ success: true, error: null });
        });

        return resolve({ success: true, error: null });
    });
}

exports['default'] = writeConfigFile;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9oZWxwZXIvd3JpdGUtY29uZmlnLWZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUVlLElBQUk7Ozs7QUFGbkIsV0FBVyxDQUFDOztBQUlaLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBa0I7UUFBaEIsTUFBTSx5REFBRyxLQUFLOztBQUM1QyxXQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUNwQyxZQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDOztBQUUzRSx3QkFBRyxTQUFTLENBQUksU0FBUyx1Q0FBb0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBSztBQUNyRixnQkFBSSxLQUFLLEVBQUUsT0FBTyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSwrQkFBK0IsRUFBRSxDQUFDLENBQUM7O0FBRXJGLGdCQUFJLE1BQU0sRUFBRTs7QUFDUix3QkFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUV0RSx3QkFBSSxVQUFVLEVBQUU7QUFDWixrQ0FBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3hCLG9DQUFZLENBQUM7bUNBQU0sVUFBVSxDQUFDLFFBQVEsRUFBRTt5QkFBQSxDQUFDLENBQUM7cUJBQzdDOzthQUNKOztBQUVELG1CQUFPLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDbEQsQ0FBQyxDQUFDOztBQUVILGVBQU8sT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNsRCxDQUFDLENBQUM7Q0FDTjs7cUJBRWMsZUFBZSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvaGVscGVyL3dyaXRlLWNvbmZpZy1maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmZ1bmN0aW9uIHdyaXRlQ29uZmlnRmlsZShjb250ZW50LCByZWxvYWQgPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGlmICghY29udGVudCkgcmV0dXJuIHJlamVjdCh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIGNvbnRlbnQgZ2l2ZW4nIH0pO1xuXG4gICAgICAgIGZzLndyaXRlRmlsZShgJHtfX2Rpcm5hbWV9Ly4uLy4uL3N0eWxlcy91c2VyLXNldHRpbmdzLmxlc3NgLCBjb250ZW50LCAndXRmOCcsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gcmVqZWN0KHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRmFpbGVkIHRvIHdyaXRlIHNldHRpbmdzIGZpbGUnIH0pO1xuXG4gICAgICAgICAgICBpZiAocmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYW11UGFja2FnZSA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZSgnYXRvbS1tYXRlcmlhbC11aScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFtdVBhY2thZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYW11UGFja2FnZS5kZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiBhbXVQYWNrYWdlLmFjdGl2YXRlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoeyBzdWNjZXNzOiB0cnVlLCBlcnJvcjogbnVsbCB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmUoeyBzdWNjZXNzOiB0cnVlLCBlcnJvcjogbnVsbCB9KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgd3JpdGVDb25maWdGaWxlO1xuIl19