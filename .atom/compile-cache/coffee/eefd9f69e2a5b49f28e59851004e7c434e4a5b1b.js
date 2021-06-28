(function() {
  var cubes, list, math, num, number, opposite, race, square,
    slice = [].slice;

  number = 42;

  opposite = true;

  if (opposite) {
    number = -42;
  }

  square = function(x) {
    return x * x;
  };

  list = [1, 2, 3, 4, 5];

  math = {
    root: Math.sqrt,
    square: square,
    cube: function(x) {
      return x * square(x);
    }
  };

  race = function() {
    var runners, winner;
    winner = arguments[0], runners = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return print(winner, runners);
  };

  if (typeof elvis !== "undefined" && elvis !== null) {
    alert("I knew it!");
  }

  cubes = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = list.length; i < len; i++) {
      num = list[i];
      results.push(math.cube(num));
    }
    return results;
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9Db2ZmZVNjcmlwdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLHNEQUFBO0lBQUE7O0VBQUEsTUFBQSxHQUFXOztFQUNYLFFBQUEsR0FBVzs7RUFHWCxJQUFnQixRQUFoQjtJQUFBLE1BQUEsR0FBUyxDQUFDLEdBQVY7OztFQUdBLE1BQUEsR0FBUyxTQUFDLENBQUQ7V0FBTyxDQUFBLEdBQUk7RUFBWDs7RUFHVCxJQUFBLEdBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYjs7RUFHUCxJQUFBLEdBQ0U7SUFBQSxJQUFBLEVBQVEsSUFBSSxDQUFDLElBQWI7SUFDQSxNQUFBLEVBQVEsTUFEUjtJQUVBLElBQUEsRUFBUSxTQUFDLENBQUQ7YUFBTyxDQUFBLEdBQUksTUFBQSxDQUFPLENBQVA7SUFBWCxDQUZSOzs7RUFLRixJQUFBLEdBQU8sU0FBQTtBQUNMLFFBQUE7SUFETSx1QkFBUTtXQUNkLEtBQUEsQ0FBTSxNQUFOLEVBQWMsT0FBZDtFQURLOztFQUlQLElBQXNCLDhDQUF0QjtJQUFBLEtBQUEsQ0FBTSxZQUFOLEVBQUE7OztFQUdBLEtBQUE7O0FBQVM7U0FBQSxzQ0FBQTs7bUJBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWO0FBQUE7OztBQTFCVCIsInNvdXJjZXNDb250ZW50IjpbIiMgQXNzaWdubWVudDpcbm51bWJlciAgID0gNDJcbm9wcG9zaXRlID0gdHJ1ZVxuXG4jIENvbmRpdGlvbnM6XG5udW1iZXIgPSAtNDIgaWYgb3Bwb3NpdGVcblxuIyBGdW5jdGlvbnM6XG5zcXVhcmUgPSAoeCkgLT4geCAqIHhcblxuIyBBcnJheXM6XG5saXN0ID0gWzEsIDIsIDMsIDQsIDVdXG5cbiMgT2JqZWN0czpcbm1hdGggPVxuICByb290OiAgIE1hdGguc3FydFxuICBzcXVhcmU6IHNxdWFyZVxuICBjdWJlOiAgICh4KSAtPiB4ICogc3F1YXJlIHhcblxuIyBTcGxhdHM6XG5yYWNlID0gKHdpbm5lciwgcnVubmVycy4uLikgLT5cbiAgcHJpbnQgd2lubmVyLCBydW5uZXJzXG5cbiMgRXhpc3RlbmNlOlxuYWxlcnQgXCJJIGtuZXcgaXQhXCIgaWYgZWx2aXM/XG5cbiMgQXJyYXkgY29tcHJlaGVuc2lvbnM6XG5jdWJlcyA9IChtYXRoLmN1YmUgbnVtIGZvciBudW0gaW4gbGlzdClcbiJdfQ==
