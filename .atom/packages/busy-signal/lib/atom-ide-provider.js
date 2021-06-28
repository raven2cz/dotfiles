/* @flow */

// eslint-disable-next-line import/no-unresolved
import type { BusySignalOptions, BusyMessage } from "atom-ide/busy-signal";
import type Provider from "./provider";

export class AtomIdeProvider {
  createProvider: () => Provider;
  messages: Set<BusyMessage> = new Set();

  constructor(createProvider: () => Provider) {
    this.createProvider = createProvider;
  }

  async reportBusyWhile<T>(
    title: string,
    f: () => Promise<T>,
    options?: BusySignalOptions
  ): Promise<T> {
    const busyMessage = this.reportBusy(title, options);
    try {
      return await f();
    } finally {
      busyMessage.dispose();
    }
  }

  reportBusy(title: string, options?: BusySignalOptions): BusyMessage {
    const provider = this.createProvider();

    if (options) {
      // TODO: options not implemented yet
    }

    provider.add(title);

    const busyMessage = {
      setTitle: (newTitle: string) => {
        provider.changeTitle(newTitle, title);
        // Cache the current title for consecutive title changes
        title = newTitle
      },
      dispose: () => {
        provider.dispose();
        this.messages.delete(busyMessage);
      }
    };
    this.messages.add(busyMessage);

    return busyMessage;
  }

  dispose(): void {
    this.messages.forEach(msg => {
      msg.dispose();
    });
    this.messages.clear();
  }
}
