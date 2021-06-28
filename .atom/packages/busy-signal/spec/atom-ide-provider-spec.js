/* @flow */

import { it, wait } from "jasmine-fix";
import Registry from "../lib/registry";
import { AtomIdeProvider } from "../lib/atom-ide-provider";
import type { SignalInternal } from "../lib/types";

describe("Atom IDE Provider", function() {
  let registry;
  let atomIdeProvider;

  beforeEach(function() {
    registry = new Registry();
    atomIdeProvider = new AtomIdeProvider(() => registry.create());
  });
  afterEach(function() {
    atomIdeProvider.dispose();
    registry.dispose();
  });

  function validateTiles(
    actual: Array<SignalInternal>,
    expected: Array<string>
  ) {
    expect(actual.length).toBe(expected.length);

    actual.forEach((entry, index) => {
      expect(entry.title).toBe(expected[index]);
    });
  }
  function validateOldTiles(
    oldTitles: Array<{ title: string, duration: string }>,
    titles: Array<string>,
    checkDuration: boolean = true
  ) {
    expect(oldTitles.length).toBe(titles.length);

    titles.forEach(function(title, index) {
      expect(oldTitles[index].title).toBe(title);
      if (checkDuration) {
        expect(
          oldTitles[index].duration === "1ms" ||
            oldTitles[index].duration === "0ms"
        ).toBe(true);
      }
    });
  }

  describe("reportBusy", function() {
    it("adds titles", function() {
      atomIdeProvider.reportBusy("Hello");
      validateTiles(registry.getTilesActive(), ["Hello"]);
    });
    it("adds removed ones to history", async function() {
      atomIdeProvider.reportBusy("Boy");
      await wait(1);
      const msg = atomIdeProvider.reportBusy("Hey");

      validateTiles(registry.getTilesActive(), ["Hey", "Boy"]);
      expect(registry.getTilesOld()).toEqual([]);

      msg.dispose();
      validateTiles(registry.getTilesActive(), ["Boy"]);
      validateOldTiles(registry.getTilesOld(), ["Hey"], false);
    });
    it("can set a new title", function() {
      const msg = atomIdeProvider.reportBusy("Hi");
      validateTiles(registry.getTilesActive(), ["Hi"]);
      msg.setTitle("Howdy");
      validateTiles(registry.getTilesActive(), ["Howdy"]);
      msg.setTitle("Whatsup")
      validateTiles(registry.getTilesActive(), ["Whatsup"]);
      msg.dispose();
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Whatsup"], false);
    });
  });
  describe("reportBusyWhile", function() {
    function waitWithValue(timeout, v) {
      return new Promise(function(resolve) {
        setTimeout(() => resolve(v), timeout);
      });
    }
    it("adds titles", async function() {
      const prom = atomIdeProvider.reportBusyWhile("Hello", () =>
        waitWithValue(1, "Bazinga!")
      );
      validateTiles(registry.getTilesActive(), ["Hello"]);
      const v = await prom;
      expect(v).toBe("Bazinga!");
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Hello"], false);
    });
  });
});
