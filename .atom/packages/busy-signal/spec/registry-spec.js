/* @flow */

import { it, wait } from "jasmine-fix";
import Registry from "../lib/registry";
import type { SignalInternal } from "../lib/types";

describe("Registry", function() {
  let registry;

  beforeEach(function() {
    registry = new Registry();
  });
  afterEach(function() {
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
    titles: Array<string>
  ) {
    expect(oldTitles.length).toBe(titles.length);

    titles.forEach(function(title, index) {
      expect(oldTitles[index].title).toBe(title);
      expect(
        oldTitles[index].duration === "1ms" ||
          oldTitles[index].duration === "0ms"
      ).toBe(true);
    });
  }

  describe("handling of providers", function() {
    it("registers providers properly and clears them out when they die", function() {
      const provider = registry.create();
      expect(registry.providers.has(provider)).toBe(true);
      provider.dispose();
      expect(registry.providers.has(provider)).toBe(false);
    });
    it("emits update event properly", function() {
      const provider = registry.create();
      const update = jasmine.createSpy("update");
      registry.onDidUpdate(update);
      expect(update).not.toHaveBeenCalled();
      provider.add("Hey");
      provider.remove("Hey");
      provider.clear();
      expect(update).toHaveBeenCalled();
      expect(update.calls.length).toBe(2);
    });
    it("adds and returns sorted titles", async function() {
      const provider = registry.create();
      provider.add("Hey");
      await wait(1);
      provider.add("Wow");
      await wait(1);
      provider.add("Hello");
      validateTiles(registry.getTilesActive(), ["Hello", "Wow", "Hey"]);
    });
    it("adds removed ones to history", async function() {
      const provider = registry.create();
      provider.add("Boy");
      await wait(1);
      provider.add("Hey");
      validateTiles(registry.getTilesActive(), ["Hey", "Boy"]);
      expect(registry.getTilesOld()).toEqual([]);

      provider.remove("Hey");
      validateTiles(registry.getTilesActive(), ["Boy"]);
      validateOldTiles(registry.getTilesOld(), ["Hey"]);
    });
    it("adds cleared ones to history", function() {
      const provider = registry.create();
      provider.add("Hello");
      provider.add("World");

      validateTiles(registry.getTilesActive(), ["Hello", "World"]);
      expect(registry.getTilesOld()).toEqual([]);

      provider.clear();
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Hello", "World"]);
    });
  });
  describe("getTilesOld", function() {
    it("excludes active ones from history", function() {
      const provider = registry.create();
      provider.add("Yo CJ");
      provider.add("Murica");
      provider.remove("Yo CJ");
      provider.remove("Murica");
      provider.add("Yo CJ");

      validateOldTiles(registry.getTilesOld(), ["Murica"]);
    });
    it("excludes duplicates and only returns the last one", function() {
      const provider = registry.create();

      provider.add("Some");
      provider.add("Things");
      provider.remove("Some");
      provider.remove("Things");
      provider.add("Some");
      provider.remove("Some");

      validateOldTiles(registry.getTilesOld(), ["Things", "Some"]);
    });
  });
});
