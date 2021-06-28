/* @flow */

import ms from "ms";
// eslint-disable-next-line import/no-unresolved
import { CompositeDisposable, Emitter } from "atom";

import Provider from "./provider";
import type { SignalInternal, SignalOptions } from "./types";

export default class Registry {
  emitter: Emitter;
  providers: Set<Provider>;
  subscriptions: CompositeDisposable;

  statuses: Map<string, SignalInternal>;
  statusHistory: Array<SignalInternal>;

  constructor() {
    this.emitter = new Emitter();
    this.providers = new Set();
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(this.emitter);

    this.statuses = new Map();
    this.statusHistory = [];
  }
  // Public method
  create(): Provider {
    const provider = new Provider();
    provider.onDidAdd(({ title, options }) => {
      this.statusAdd(provider, title, options);
    });
    provider.onDidRemove(title => {
      this.statusRemove(provider, title);
    });
    provider.onDidChangeTitle(({ title, oldTitle }) => {
      this.statusChangeTitle(provider, title, oldTitle);
    });
    provider.onDidClear(() => {
      this.statusClear(provider);
    });
    provider.onDidDispose(() => {
      this.statusClear(provider);
      this.providers.delete(provider);
    });
    this.providers.add(provider);
    return provider;
  }
  statusAdd(provider: Provider, title: string, options?: ?SignalOptions): void {
    const key = `${provider.id}::${title}`;
    if (this.statuses.has(key)) {
      // This will help catch bugs in providers
      throw new Error(`Status '${title}' is already set`);
    }

    const entry = {
      key,
      title,
      provider,
      timeStarted: Date.now(),
      timeStopped: null,
      options
    };
    this.statuses.set(entry.key, entry);
    this.emitter.emit("did-update");
  }
  statusRemove(provider: Provider, title: string): void {
    const key = `${provider.id}::${title}`;
    const value = this.statuses.get(key);
    if (value) {
      this.pushIntoHistory(value);
      this.statuses.delete(key);
      this.emitter.emit("did-update");
    }
  }
  statusChangeTitle(provider: Provider, title: string, oldTitle: string): void {
    const oldKey = `${provider.id}::${oldTitle}`;
    const entry = this.statuses.get(oldKey);
    if (!entry) {
      return;
    }

    this.statuses.delete(oldKey);

    entry.title = title;
    entry.key = `${provider.id}::${title}`;

    this.statuses.set(entry.key, entry);
    this.emitter.emit("did-update");
  }
  statusClear(provider: Provider): void {
    let triggerUpdate = false;
    this.statuses.forEach(value => {
      if (value.provider === provider) {
        triggerUpdate = true;
        this.pushIntoHistory(value);
        this.statuses.delete(value.key);
      }
    });
    if (triggerUpdate) {
      this.emitter.emit("did-update");
    }
  }
  pushIntoHistory(status: SignalInternal): void {
    status.timeStopped = Date.now();
    let i = this.statusHistory.length;
    while (i--) {
      if (this.statusHistory[i].key === status.key) {
        this.statusHistory.splice(i, 1);
        break;
      }
    }
    this.statusHistory.push(status);
    this.statusHistory = this.statusHistory.slice(-10);
  }
  getTilesActive(): Array<SignalInternal> {
    return Array.from(this.statuses.values()).sort(
      (a, b) => b.timeStarted - a.timeStarted
    );
  }
  getTilesOld(): Array<{ title: string, duration: string }> {
    const oldTiles = [];

    this.statusHistory.forEach(entry => {
      if (this.statuses.has(entry.key)) return;
      oldTiles.push({
        title: entry.title,
        duration: ms((entry.timeStopped || 0) - entry.timeStarted)
      });
    });

    return oldTiles;
  }
  onDidUpdate(callback: Function): IDisposable {
    return this.emitter.on("did-update", callback);
  }
  dispose() {
    this.subscriptions.dispose();
    for (const provider of this.providers) {
      provider.dispose();
    }
  }
}
