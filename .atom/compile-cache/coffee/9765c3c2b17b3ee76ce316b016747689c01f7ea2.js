(function() {
  module.exports = {
    query: function(el) {
      return document.querySelector(el);
    },
    queryAll: function(el) {
      return document.querySelectorAll(el);
    },
    addClass: function(el, className) {
      return this.toggleClass('add', el, className);
    },
    removeClass: function(el, className) {
      return this.toggleClass('remove', el, className);
    },
    toggleClass: function(action, el, className) {
      var i, results;
      if (el !== null) {
        i = 0;
        results = [];
        while (i < el.length) {
          el[i].classList[action](className);
          results.push(i++);
        }
        return results;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL3NldGktdWkvbGliL2RvbS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsS0FBQSxFQUFPLFNBQUMsRUFBRDthQUNMLFFBQVEsQ0FBQyxhQUFULENBQXVCLEVBQXZCO0lBREssQ0FBUDtJQUdBLFFBQUEsRUFBVSxTQUFDLEVBQUQ7YUFDUixRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsRUFBMUI7SUFEUSxDQUhWO0lBTUEsUUFBQSxFQUFVLFNBQUMsRUFBRCxFQUFLLFNBQUw7YUFDUixJQUFDLENBQUEsV0FBRCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsRUFBd0IsU0FBeEI7SUFEUSxDQU5WO0lBU0EsV0FBQSxFQUFhLFNBQUMsRUFBRCxFQUFLLFNBQUw7YUFDWCxJQUFDLENBQUEsV0FBRCxDQUFhLFFBQWIsRUFBdUIsRUFBdkIsRUFBMkIsU0FBM0I7SUFEVyxDQVRiO0lBWUEsV0FBQSxFQUFhLFNBQUMsTUFBRCxFQUFTLEVBQVQsRUFBYSxTQUFiO0FBQ1gsVUFBQTtNQUFBLElBQUcsRUFBQSxLQUFNLElBQVQ7UUFDRSxDQUFBLEdBQUk7QUFDSjtlQUFNLENBQUEsR0FBSSxFQUFFLENBQUMsTUFBYjtVQUNFLEVBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUFVLENBQUEsTUFBQSxDQUFoQixDQUF3QixTQUF4Qjt1QkFDQSxDQUFBO1FBRkYsQ0FBQTt1QkFGRjs7SUFEVyxDQVpiOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBxdWVyeTogKGVsKSAtPlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgZWxcblxuICBxdWVyeUFsbDogKGVsKSAtPlxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgZWxcblxuICBhZGRDbGFzczogKGVsLCBjbGFzc05hbWUpIC0+XG4gICAgQHRvZ2dsZUNsYXNzICdhZGQnLCBlbCwgY2xhc3NOYW1lXG5cbiAgcmVtb3ZlQ2xhc3M6IChlbCwgY2xhc3NOYW1lKSAtPlxuICAgIEB0b2dnbGVDbGFzcyAncmVtb3ZlJywgZWwsIGNsYXNzTmFtZVxuXG4gIHRvZ2dsZUNsYXNzOiAoYWN0aW9uLCBlbCwgY2xhc3NOYW1lKSAtPlxuICAgIGlmIGVsICE9IG51bGxcbiAgICAgIGkgPSAwXG4gICAgICB3aGlsZSBpIDwgZWwubGVuZ3RoXG4gICAgICAgIGVsW2ldLmNsYXNzTGlzdFthY3Rpb25dIGNsYXNzTmFtZVxuICAgICAgICBpKytcbiJdfQ==
