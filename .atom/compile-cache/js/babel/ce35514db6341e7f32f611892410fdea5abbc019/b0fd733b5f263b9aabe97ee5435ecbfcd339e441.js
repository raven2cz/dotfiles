'use babel';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = toCamelCase;

function toCamelCase(str) {
    return str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
    });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9oZWxwZXIvdG8tY2FtZWwtY2FzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVZLFdBQVc7O0FBQXBCLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUNyQyxXQUFPLEdBQUcsQ0FDTCxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUNsQixPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUNsQixPQUFPLENBQUMsUUFBUSxFQUFFLFVBQUEsRUFBRTtlQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7S0FBQSxDQUFDLENBQ3pDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQ2xCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBQSxFQUFFO2VBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtLQUFBLENBQUMsQ0FBQztDQUNoRCIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvaGVscGVyL3RvLWNhbWVsLWNhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9DYW1lbENhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvLS9nLCAnICcpXG4gICAgICAgIC5yZXBsYWNlKC9fL2csICcgJylcbiAgICAgICAgLnJlcGxhY2UoL1xccyguKS9nLCAkMSA9PiAkMS50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAucmVwbGFjZSgvXFxzL2csICcnKVxuICAgICAgICAucmVwbGFjZSgvXiguKS8sICQxID0+ICQxLnRvTG93ZXJDYXNlKCkpO1xufVxuIl19