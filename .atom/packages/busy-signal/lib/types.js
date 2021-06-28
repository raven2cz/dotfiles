/* @flow */

import type Provider from "./provider";

export type SignalOptions = {
  onlyForFile?: string,
  onDidClick?: () => void
};

export type SignalInternal = {
  key: string,
  title: string,
  provider: Provider,
  timeStarted: number,
  timeStopped: ?number,
  options?: ?SignalOptions
};
