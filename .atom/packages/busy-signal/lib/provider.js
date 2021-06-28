/* @flow */

// eslint-disable-next-line import/no-unresolved
import { CompositeDisposable, Emitter } from "atom";
import { generateRandom } from "./helpers";
import type { SignalOptions } from "./types";

export default class Provider {
  id: string;
  emitter: Emitter;
  subscriptions: CompositeDisposable;

  constructor() {
    this.id = generateRandom();
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public
  add(title: string, options?: ?SignalOptions) {
    this.emitter.emit("did-add", { title, options });
  }
  // Public
  remove(title: string) {
    this.emitter.emit("did-remove", title);
  }
  // Public
  changeTitle(title: string, oldTitle: string) {
    this.emitter.emit("did-change-title", { title, oldTitle });
  }
  // Public
  clear() {
    this.emitter.emit("did-clear");
  }

  onDidAdd(
    callback: (add: { title: string, options: ?SignalOptions }) => any
  ): IDisposable {
    return this.emitter.on("did-add", callback);
  }
  onDidRemove(callback: (title: string) => any): IDisposable {
    return this.emitter.on("did-remove", callback);
  }
  onDidChangeTitle(
    callback: (change: { title: string, oldTitle: string }) => any
  ): IDisposable {
    return this.emitter.on("did-change-title", callback);
  }
  onDidClear(callback: () => any): IDisposable {
    return this.emitter.on("did-clear", callback);
  }
  onDidDispose(callback: Function): IDisposable {
    return this.emitter.on("did-dispose", callback);
  }

  dispose() {
    this.emitter.emit("did-dispose");
    this.subscriptions.dispose();
  }
}
