/* @flow */

import type {
  BusySignalService,
  BusySignalOptions
} from "atom-ide/busy-signal"; // eslint-disable-line import/no-unresolved
import BusySignal from "./main";
import type SignalRegistry from "./registry";

module.exports = {
  activate() {
    this.instance = new BusySignal();
  },
  consumeStatusBar(statusBar: Object) {
    this.instance.attach(statusBar);
  },
  providerRegistry(): SignalRegistry {
    return this.instance.registry;
  },
  provideBusySignal(): BusySignalService {
    const provider: BusySignalService = this.instance.atomIdeProvider;
    return {
      reportBusyWhile<T>(
        title: string,
        f: () => Promise<T>,
        options?: BusySignalOptions
      ) {
        return provider.reportBusyWhile(title, f, options);
      },

      reportBusy(title: string, options?: BusySignalOptions) {
        return provider.reportBusy(title, options);
      },

      dispose() {
        // nop
      }
    };
  },
  deactivate() {
    this.instance.dispose();
  }
};
