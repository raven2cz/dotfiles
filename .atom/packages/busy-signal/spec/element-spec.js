/* @flow */

import Element from "../lib/element";

describe("Element", function() {
  let element;

  beforeEach(function() {
    element = new Element();
    spyOn(element, "setTooltip").andCallThrough();
    spyOn(element, "setBusy").andCallThrough();
  });
  afterEach(function() {
    element.dispose();
  });

  function validateSetTooltip(call: number, html: string) {
    expect(element.setTooltip.calls[call].args[0].innerHTML).toEqual(html);
  }

  it("sets a title properly", function() {
    element.update([{ title: "Hello" }], []);
    expect(element.setBusy).toHaveBeenCalledWith(true);
    validateSetTooltip(0, "<strong>Current:</strong><div>Hello</div>");
  });
  it("escapes the given texts", function() {
    element.update([{ title: "<div>" }], []);
    expect(element.setBusy).toHaveBeenCalledWith(true);
    validateSetTooltip(0, "<strong>Current:</strong><div>&lt;div&gt;</div>");
  });
  it("shows idle message when nothing is provided", function() {
    element.update([], []);
    expect(element.setBusy).toHaveBeenCalledWith(false);
    validateSetTooltip(0, "Idle");
  });
  it("shows only history when current is not present", function() {
    element.update([], [{ title: "Yo", duration: "1m" }]);
    expect(element.setBusy).toHaveBeenCalledWith(false);
    validateSetTooltip(0, "<strong>History:</strong><div>Yo (1m)</div>");
  });
  it("shows both history and current when both are present", function() {
    element.update([{ title: "Hey" }], [{ title: "Yo", duration: "1m" }]);
    expect(element.setBusy).toHaveBeenCalledWith(true);
    validateSetTooltip(
      0,
      "<strong>History:</strong><div>Yo (1m)</div><strong>Current:</strong><div>Hey</div>"
    );
  });
});
