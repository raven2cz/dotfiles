(function() {
  var Animal, OPERATOR, grade, heredoc, hi, math, race, square, two,
    slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  grade = function(student, period, messages) {
    if (period == null) {
      period = (typeof b !== "undefined" && b !== null ? 7 : 6);
    }
    if (messages == null) {
      messages = {
        "A": "Excellent"
      };
    }
    if (student.excellentWork) {
      return "A+";
    } else if (student.okayStuff) {
      if (student.triedHard) {
        return "B";
      } else {
        return "B-";
      }
    } else {
      return "C";
    }
  };

  square = function(x) {
    return x * x;
  };

  two = function() {
    return 2;
  };

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

  Animal = (function(superClass) {
    extend(Animal, superClass);

    function Animal(name) {
      this.name = name;
    }

    Animal.prototype.move = function(meters) {
      return alert(this.name + (" moved " + meters + "m."));
    };

    return Animal;

  })(Being);

  hi = function() {
  return [document.title, "Hello JavaScript"].join(": ");
};

  heredoc = "CoffeeScript subst test " + (0x8 + 0xf / 0x2 + ("nested string " + /\n/));


  /*
  CoffeeScript Compiler v1.2.0
  Released under the MIT License
   */

  OPERATOR = /^(?:[-=]>)/;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2dydXZib3gvc3BlYy9jb2ZmZWVzY3JpcHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2REFBQTtJQUFBOzs7O0VBQUEsS0FBQSxHQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsRUFBd0MsUUFBeEM7O01BQVUsU0FBTyxDQUFJLHNDQUFILEdBQVcsQ0FBWCxHQUFrQixDQUFuQjs7O01BQXVCLFdBQVM7UUFBQyxHQUFBLEVBQUssV0FBTjs7O0lBQ3ZELElBQUcsT0FBTyxDQUFDLGFBQVg7YUFDRSxLQURGO0tBQUEsTUFFSyxJQUFHLE9BQU8sQ0FBQyxTQUFYO01BQ0gsSUFBRyxPQUFPLENBQUMsU0FBWDtlQUEwQixJQUExQjtPQUFBLE1BQUE7ZUFBbUMsS0FBbkM7T0FERztLQUFBLE1BQUE7YUFHSCxJQUhHOztFQUhDOztFQVFSLE1BQUEsR0FBUyxTQUFDLENBQUQ7V0FBTyxDQUFBLEdBQUk7RUFBWDs7RUFFVCxHQUFBLEdBQU0sU0FBQTtXQUFHO0VBQUg7O0VBRU4sSUFBQSxHQUNFO0lBQUEsSUFBQSxFQUFRLElBQUksQ0FBQyxJQUFiO0lBQ0EsTUFBQSxFQUFRLE1BRFI7SUFFQSxJQUFBLEVBQVEsU0FBQyxDQUFEO2FBQU8sQ0FBQSxHQUFJLE1BQUEsQ0FBTyxDQUFQO0lBQVgsQ0FGUjs7O0VBSUYsSUFBQSxHQUFPLFNBQUE7QUFDTCxRQUFBO0lBRE0sdUJBQVE7V0FDZCxLQUFBLENBQU0sTUFBTixFQUFjLE9BQWQ7RUFESzs7RUFHRDs7O0lBQ1MsZ0JBQUMsSUFBRDtNQUFDLElBQUMsQ0FBQSxPQUFEO0lBQUQ7O3FCQUViLElBQUEsR0FBTSxTQUFDLE1BQUQ7YUFDSixLQUFBLENBQU0sSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFBLFNBQUEsR0FBVSxNQUFWLEdBQWlCLElBQWpCLENBQWQ7SUFESTs7OztLQUhhOztFQU1yQixFQUFBLEdBQUs7Ozs7RUFJTCxPQUFBLEdBQVUsMEJBQUEsR0FDZSxDQUFFLEdBQUEsR0FBUSxHQUFBLEdBQU0sR0FBZCxHQUFxQixDQUFBLGdCQUFBLEdBQWtCLElBQWxCLENBQXZCOzs7QUFHekI7Ozs7O0VBS0EsUUFBQSxHQUFXO0FBdkNYIiwic291cmNlc0NvbnRlbnQiOlsiZ3JhZGUgPSAoc3R1ZGVudCwgcGVyaW9kPShpZiBiPyB0aGVuIDcgZWxzZSA2KSwgbWVzc2FnZXM9e1wiQVwiOiBcIkV4Y2VsbGVudFwifSkgLT5cbiAgaWYgc3R1ZGVudC5leGNlbGxlbnRXb3JrXG4gICAgXCJBK1wiXG4gIGVsc2UgaWYgc3R1ZGVudC5va2F5U3R1ZmZcbiAgICBpZiBzdHVkZW50LnRyaWVkSGFyZCB0aGVuIFwiQlwiIGVsc2UgXCJCLVwiXG4gIGVsc2VcbiAgICBcIkNcIlxuXG5zcXVhcmUgPSAoeCkgLT4geCAqIHhcblxudHdvID0gLT4gMlxuXG5tYXRoID1cbiAgcm9vdDogICBNYXRoLnNxcnRcbiAgc3F1YXJlOiBzcXVhcmVcbiAgY3ViZTogICAoeCkgLT4geCAqIHNxdWFyZSB4XG5cbnJhY2UgPSAod2lubmVyLCBydW5uZXJzLi4uKSAtPlxuICBwcmludCB3aW5uZXIsIHJ1bm5lcnNcblxuY2xhc3MgQW5pbWFsIGV4dGVuZHMgQmVpbmdcbiAgY29uc3RydWN0b3I6IChAbmFtZSkgLT5cblxuICBtb3ZlOiAobWV0ZXJzKSAtPlxuICAgIGFsZXJ0IEBuYW1lICsgXCIgbW92ZWQgI3ttZXRlcnN9bS5cIlxuXG5oaSA9IGBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtkb2N1bWVudC50aXRsZSwgXCJIZWxsbyBKYXZhU2NyaXB0XCJdLmpvaW4oXCI6IFwiKTtcbn1gXG5cbmhlcmVkb2MgPSBcIlwiXCJcbkNvZmZlZVNjcmlwdCBzdWJzdCB0ZXN0ICN7IDBvMDEwICsgMHhmIC8gMGIxMCArIFwibmVzdGVkIHN0cmluZyAjeyAvXFxuLyB9XCJ9XG5cIlwiXCJcblxuIyMjXG5Db2ZmZWVTY3JpcHQgQ29tcGlsZXIgdjEuMi4wXG5SZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2VcbiMjI1xuXG5PUEVSQVRPUiA9IC8vLyBeIChcbj86IFstPV0+ICAgICAgICAgICAgICMgZnVuY3Rpb25cbikgLy8vXG4iXX0=
