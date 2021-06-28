/* @flow */

// eslint-disable-next-line import/no-unresolved
import { CompositeDisposable } from "atom";
import disposify from "disposify";
import Element from "./element";
import Registry from "./registry";
import { AtomIdeProvider } from "./atom-ide-provider";

export default class BusySignal {
  element: Element;
  registry: Registry;
  atomIdeProvider: AtomIdeProvider;
  subscriptions: CompositeDisposable;

  constructor() {
    this.element = new Element();
    this.registry = new Registry();
    this.atomIdeProvider = new AtomIdeProvider(() => this.registry.create());
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(this.element);
    this.subscriptions.add(this.registry);

    this.registry.onDidUpdate(() => {
      this.element.update(
        this.registry.getTilesActive(),
        this.registry.getTilesOld()
      );
    });
  }
  attach(statusBar: Object) {
    this.subscriptions.add(
      disposify(
        statusBar.addRightTile({
          item: this.element,
          priority: 500
        })
      )
    );
  }
  dispose() {
    this.subscriptions.dispose();
  }
}
