(function() {
  var extend, k, stds,
    slice = [].slice;

  extend = function() {
    var args, dst, i, k, len, src, v;
    dst = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (dst == null) {
      dst = {};
    }
    for (i = 0, len = args.length; i < len; i++) {
      src = args[i];
      if (typeof src === 'object') {
        for (k in src) {
          v = src[k];
          dst[k] = v;
        }
      }
    }
    return dst;
  };

  stds = {};

  stds.lua51 = {
    _G: true,
    "package": true,
    _VERSION: true,
    arg: true,
    assert: true,
    collectgarbage: true,
    coroutine: true,
    debug: true,
    dofile: true,
    error: true,
    gcinfo: true,
    getfenv: true,
    getmetatable: true,
    io: true,
    ipairs: true,
    load: true,
    loadfile: true,
    loadstring: true,
    math: true,
    module: true,
    newproxy: true,
    next: true,
    os: true,
    pairs: true,
    pcall: true,
    print: true,
    rawequal: true,
    rawget: true,
    rawset: true,
    require: true,
    select: true,
    setfenv: true,
    setmetatable: true,
    string: true,
    table: true,
    tonumber: true,
    tostring: true,
    type: true,
    unpack: true,
    xpcall: true
  };

  stds.lua52 = {
    _ENV: true,
    _G: true,
    "package": true,
    _VERSION: true,
    arg: true,
    assert: true,
    bit32: true,
    collectgarbage: true,
    coroutine: true,
    debug: true,
    dofile: true,
    error: true,
    getmetatable: true,
    io: true,
    ipairs: true,
    load: true,
    loadfile: true,
    math: true,
    next: true,
    os: true,
    pairs: true,
    pcall: true,
    print: true,
    rawequal: true,
    rawget: true,
    rawlen: true,
    rawset: true,
    require: true,
    select: true,
    setmetatable: true,
    string: true,
    table: true,
    tonumber: true,
    tostring: true,
    type: true,
    xpcall: true
  };

  stds.lua53 = {
    _ENV: true,
    _G: true,
    "package": true,
    _VERSION: true,
    arg: true,
    assert: true,
    collectgarbage: true,
    coroutine: true,
    debug: true,
    dofile: true,
    error: true,
    getmetatable: true,
    io: true,
    ipairs: true,
    load: true,
    loadfile: true,
    math: true,
    next: true,
    os: true,
    pairs: true,
    pcall: true,
    print: true,
    rawequal: true,
    rawget: true,
    rawlen: true,
    rawset: true,
    require: true,
    select: true,
    setmetatable: true,
    string: true,
    table: true,
    tonumber: true,
    tostring: true,
    type: true,
    utf8: true,
    xpcall: true
  };

  stds.luajit = {
    _G: true,
    "package": true,
    _VERSION: true,
    arg: true,
    assert: true,
    bit: true,
    collectgarbage: true,
    coroutine: true,
    debug: true,
    dofile: true,
    error: true,
    gcinfo: true,
    getfenv: true,
    getmetatable: true,
    io: true,
    ipairs: true,
    jit: true,
    load: true,
    loadfile: true,
    loadstring: true,
    math: true,
    module: true,
    newproxy: true,
    next: true,
    os: true,
    pairs: true,
    pcall: true,
    print: true,
    rawequal: true,
    rawget: true,
    rawset: true,
    require: true,
    select: true,
    setfenv: true,
    setmetatable: true,
    string: true,
    table: true,
    tonumber: true,
    tostring: true,
    type: true,
    unpack: true,
    xpcall: true
  };

  stds.min = {};

  for (k in stds.lua51) {
    if (stds.lua52[k] && stds.lua53[k] && stds.luajit[k]) {
      stds.min[k] = true;
    }
  }

  stds.max = extend({}, stds.lua51, stds.lua52, stds.lua53, stds.luajit);

  stds.none = {};

  module.exports = stds;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1sdWEtZmluZGdsb2JhbHMvbGliL3N0ZHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxlQUFBO0lBQUE7O0VBQUEsTUFBQSxHQUFTLFNBQUE7QUFDUCxRQUFBO0lBRFEsb0JBQUs7SUFDYixJQUFnQixXQUFoQjtNQUFBLEdBQUEsR0FBTSxHQUFOOztBQUNBLFNBQUEsc0NBQUE7O1VBQXFCLE9BQU8sR0FBUCxLQUFjO0FBQ2pDLGFBQUEsUUFBQTs7VUFDRSxHQUFJLENBQUEsQ0FBQSxDQUFKLEdBQVM7QUFEWDs7QUFERjtXQUdBO0VBTE87O0VBU1QsSUFBQSxHQUFPOztFQUVQLElBQUksQ0FBQyxLQUFMLEdBQ0M7SUFBQSxFQUFBLEVBQUksSUFBSjtJQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtJQUVBLFFBQUEsRUFBVSxJQUZWO0lBR0EsR0FBQSxFQUFLLElBSEw7SUFJQSxNQUFBLEVBQVEsSUFKUjtJQUtBLGNBQUEsRUFBZ0IsSUFMaEI7SUFNQSxTQUFBLEVBQVcsSUFOWDtJQU9BLEtBQUEsRUFBTyxJQVBQO0lBUUEsTUFBQSxFQUFRLElBUlI7SUFTQSxLQUFBLEVBQU8sSUFUUDtJQVVBLE1BQUEsRUFBUSxJQVZSO0lBV0EsT0FBQSxFQUFTLElBWFQ7SUFZQSxZQUFBLEVBQWMsSUFaZDtJQWFBLEVBQUEsRUFBSSxJQWJKO0lBY0EsTUFBQSxFQUFRLElBZFI7SUFlQSxJQUFBLEVBQU0sSUFmTjtJQWdCQSxRQUFBLEVBQVUsSUFoQlY7SUFpQkEsVUFBQSxFQUFZLElBakJaO0lBa0JBLElBQUEsRUFBTSxJQWxCTjtJQW1CQSxNQUFBLEVBQVEsSUFuQlI7SUFvQkEsUUFBQSxFQUFVLElBcEJWO0lBcUJBLElBQUEsRUFBTSxJQXJCTjtJQXNCQSxFQUFBLEVBQUksSUF0Qko7SUF1QkEsS0FBQSxFQUFPLElBdkJQ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QVMsSUFqQ1Q7SUFrQ0EsWUFBQSxFQUFjLElBbENkO0lBbUNBLE1BQUEsRUFBUSxJQW5DUjtJQW9DQSxLQUFBLEVBQU8sSUFwQ1A7SUFxQ0EsUUFBQSxFQUFVLElBckNWO0lBc0NBLFFBQUEsRUFBVSxJQXRDVjtJQXVDQSxJQUFBLEVBQU0sSUF2Q047SUF3Q0EsTUFBQSxFQUFRLElBeENSO0lBeUNBLE1BQUEsRUFBUSxJQXpDUjs7O0VBMkNELElBQUksQ0FBQyxHQUFMLEdBQVc7O0FBQ1gsT0FBQSxlQUFBO0lBQ0MsSUFBc0IsSUFBSSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVgsSUFBa0IsSUFBSSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQTdCLElBQW9DLElBQUksQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUF0RTtNQUFBLElBQUksQ0FBQyxHQUFJLENBQUEsQ0FBQSxDQUFULEdBQWMsS0FBZDs7QUFERDs7RUFHQSxJQUFJLENBQUMsR0FBTCxHQUFXLE1BQUEsQ0FBTyxFQUFQLEVBQVcsSUFBSSxDQUFDLEtBQWhCLEVBQXVCLElBQUksQ0FBQyxLQUE1QixFQUFtQyxJQUFJLENBQUMsS0FBeEMsRUFBK0MsSUFBSSxDQUFDLE1BQXBEOztFQUVYLElBQUksQ0FBQyxJQUFMLEdBQVk7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFyTGpCIiwic291cmNlc0NvbnRlbnQiOlsiZXh0ZW5kID0gKGRzdCwgYXJncy4uLikgLT5cbiAgZHN0ID0ge30gdW5sZXNzIGRzdD9cbiAgZm9yIHNyYyBpbiBhcmdzIHdoZW4gdHlwZW9mIHNyYyBpcyAnb2JqZWN0J1xuICAgIGZvciBrLCB2IG9mIHNyY1xuICAgICAgZHN0W2tdID0gdlxuICBkc3RcblxuIyB0aGlzIGlzIG1vc3RseSBmcm9tIGx1YWNoZWNrXG5cbnN0ZHMgPSB7fVxuXG5zdGRzLmx1YTUxID1cblx0X0c6IHRydWVcblx0cGFja2FnZTogdHJ1ZVxuXHRfVkVSU0lPTjogdHJ1ZVxuXHRhcmc6IHRydWVcblx0YXNzZXJ0OiB0cnVlXG5cdGNvbGxlY3RnYXJiYWdlOiB0cnVlXG5cdGNvcm91dGluZTogdHJ1ZVxuXHRkZWJ1ZzogdHJ1ZVxuXHRkb2ZpbGU6IHRydWVcblx0ZXJyb3I6IHRydWVcblx0Z2NpbmZvOiB0cnVlXG5cdGdldGZlbnY6IHRydWVcblx0Z2V0bWV0YXRhYmxlOiB0cnVlXG5cdGlvOiB0cnVlXG5cdGlwYWlyczogdHJ1ZVxuXHRsb2FkOiB0cnVlXG5cdGxvYWRmaWxlOiB0cnVlXG5cdGxvYWRzdHJpbmc6IHRydWVcblx0bWF0aDogdHJ1ZVxuXHRtb2R1bGU6IHRydWVcblx0bmV3cHJveHk6IHRydWVcblx0bmV4dDogdHJ1ZVxuXHRvczogdHJ1ZVxuXHRwYWlyczogdHJ1ZVxuXHRwY2FsbDogdHJ1ZVxuXHRwcmludDogdHJ1ZVxuXHRyYXdlcXVhbDogdHJ1ZVxuXHRyYXdnZXQ6IHRydWVcblx0cmF3c2V0OiB0cnVlXG5cdHJlcXVpcmU6IHRydWVcblx0c2VsZWN0OiB0cnVlXG5cdHNldGZlbnY6IHRydWVcblx0c2V0bWV0YXRhYmxlOiB0cnVlXG5cdHN0cmluZzogdHJ1ZVxuXHR0YWJsZTogdHJ1ZVxuXHR0b251bWJlcjogdHJ1ZVxuXHR0b3N0cmluZzogdHJ1ZVxuXHR0eXBlOiB0cnVlXG5cdHVucGFjazogdHJ1ZVxuXHR4cGNhbGw6IHRydWVcblxuc3Rkcy5sdWE1MiA9XG5cdF9FTlY6IHRydWVcblx0X0c6IHRydWVcblx0cGFja2FnZTogdHJ1ZVxuXHRfVkVSU0lPTjogdHJ1ZVxuXHRhcmc6IHRydWVcblx0YXNzZXJ0OiB0cnVlXG5cdGJpdDMyOiB0cnVlXG5cdGNvbGxlY3RnYXJiYWdlOiB0cnVlXG5cdGNvcm91dGluZTogdHJ1ZVxuXHRkZWJ1ZzogdHJ1ZVxuXHRkb2ZpbGU6IHRydWVcblx0ZXJyb3I6IHRydWVcblx0Z2V0bWV0YXRhYmxlOiB0cnVlXG5cdGlvOiB0cnVlXG5cdGlwYWlyczogdHJ1ZVxuXHRsb2FkOiB0cnVlXG5cdGxvYWRmaWxlOiB0cnVlXG5cdG1hdGg6IHRydWVcblx0bmV4dDogdHJ1ZVxuXHRvczogdHJ1ZVxuXHRwYWlyczogdHJ1ZVxuXHRwY2FsbDogdHJ1ZVxuXHRwcmludDogdHJ1ZVxuXHRyYXdlcXVhbDogdHJ1ZVxuXHRyYXdnZXQ6IHRydWVcblx0cmF3bGVuOiB0cnVlXG5cdHJhd3NldDogdHJ1ZVxuXHRyZXF1aXJlOiB0cnVlXG5cdHNlbGVjdDogdHJ1ZVxuXHRzZXRtZXRhdGFibGU6IHRydWVcblx0c3RyaW5nOiB0cnVlXG5cdHRhYmxlOiB0cnVlXG5cdHRvbnVtYmVyOiB0cnVlXG5cdHRvc3RyaW5nOiB0cnVlXG5cdHR5cGU6IHRydWVcblx0eHBjYWxsOiB0cnVlXG5cbnN0ZHMubHVhNTMgPVxuXHRfRU5WOiB0cnVlXG5cdF9HOiB0cnVlXG5cdHBhY2thZ2U6IHRydWVcblx0X1ZFUlNJT046IHRydWVcblx0YXJnOiB0cnVlXG5cdGFzc2VydDogdHJ1ZVxuXHRjb2xsZWN0Z2FyYmFnZTogdHJ1ZVxuXHRjb3JvdXRpbmU6IHRydWVcblx0ZGVidWc6IHRydWVcblx0ZG9maWxlOiB0cnVlXG5cdGVycm9yOiB0cnVlXG5cdGdldG1ldGF0YWJsZTogdHJ1ZVxuXHRpbzogdHJ1ZVxuXHRpcGFpcnM6IHRydWVcblx0bG9hZDogdHJ1ZVxuXHRsb2FkZmlsZTogdHJ1ZVxuXHRtYXRoOiB0cnVlXG5cdG5leHQ6IHRydWVcblx0b3M6IHRydWVcblx0cGFpcnM6IHRydWVcblx0cGNhbGw6IHRydWVcblx0cHJpbnQ6IHRydWVcblx0cmF3ZXF1YWw6IHRydWVcblx0cmF3Z2V0OiB0cnVlXG5cdHJhd2xlbjogdHJ1ZVxuXHRyYXdzZXQ6IHRydWVcblx0cmVxdWlyZTogdHJ1ZVxuXHRzZWxlY3Q6IHRydWVcblx0c2V0bWV0YXRhYmxlOiB0cnVlXG5cdHN0cmluZzogdHJ1ZVxuXHR0YWJsZTogdHJ1ZVxuXHR0b251bWJlcjogdHJ1ZVxuXHR0b3N0cmluZzogdHJ1ZVxuXHR0eXBlOiB0cnVlXG5cdHV0Zjg6IHRydWVcblx0eHBjYWxsOiB0cnVlXG5cbnN0ZHMubHVhaml0ID1cblx0X0c6IHRydWVcblx0cGFja2FnZTogdHJ1ZVxuXHRfVkVSU0lPTjogdHJ1ZVxuXHRhcmc6IHRydWVcblx0YXNzZXJ0OiB0cnVlXG5cdGJpdDogdHJ1ZVxuXHRjb2xsZWN0Z2FyYmFnZTogdHJ1ZVxuXHRjb3JvdXRpbmU6IHRydWVcblx0ZGVidWc6IHRydWVcblx0ZG9maWxlOiB0cnVlXG5cdGVycm9yOiB0cnVlXG5cdGdjaW5mbzogdHJ1ZVxuXHRnZXRmZW52OiB0cnVlXG5cdGdldG1ldGF0YWJsZTogdHJ1ZVxuXHRpbzogdHJ1ZVxuXHRpcGFpcnM6IHRydWVcblx0aml0OiB0cnVlXG5cdGxvYWQ6IHRydWVcblx0bG9hZGZpbGU6IHRydWVcblx0bG9hZHN0cmluZzogdHJ1ZVxuXHRtYXRoOiB0cnVlXG5cdG1vZHVsZTogdHJ1ZVxuXHRuZXdwcm94eTogdHJ1ZVxuXHRuZXh0OiB0cnVlXG5cdG9zOiB0cnVlXG5cdHBhaXJzOiB0cnVlXG5cdHBjYWxsOiB0cnVlXG5cdHByaW50OiB0cnVlXG5cdHJhd2VxdWFsOiB0cnVlXG5cdHJhd2dldDogdHJ1ZVxuXHRyYXdzZXQ6IHRydWVcblx0cmVxdWlyZTogdHJ1ZVxuXHRzZWxlY3Q6IHRydWVcblx0c2V0ZmVudjogdHJ1ZVxuXHRzZXRtZXRhdGFibGU6IHRydWVcblx0c3RyaW5nOiB0cnVlXG5cdHRhYmxlOiB0cnVlXG5cdHRvbnVtYmVyOiB0cnVlXG5cdHRvc3RyaW5nOiB0cnVlXG5cdHR5cGU6IHRydWVcblx0dW5wYWNrOiB0cnVlXG5cdHhwY2FsbDogdHJ1ZVxuXG5zdGRzLm1pbiA9IHt9XG5mb3IgayBvZiBzdGRzLmx1YTUxXG5cdHN0ZHMubWluW2tdID0gdHJ1ZSBpZiBzdGRzLmx1YTUyW2tdIGFuZCBzdGRzLmx1YTUzW2tdIGFuZCBzdGRzLmx1YWppdFtrXVxuXG5zdGRzLm1heCA9IGV4dGVuZCh7fSwgc3Rkcy5sdWE1MSwgc3Rkcy5sdWE1Miwgc3Rkcy5sdWE1Mywgc3Rkcy5sdWFqaXQpXG5cbnN0ZHMubm9uZSA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gc3Rkc1xuIl19
