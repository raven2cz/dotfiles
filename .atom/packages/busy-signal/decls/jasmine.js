/* @flow */

declare function describe(description: string, specDefinitions: () => void): void;
declare function xdescribe(description: string, specDefinitions: () => void): void;

declare function it(expectation: string, assertion: (done: (err?: any) => void) => void): void;
declare function xit(expectation: string, assertion: () => void): void;

declare function beforeEach(action: () => void): void;
declare function afterEach(action: () => void): void;

declare function expect(actual: any): JasmineMatchers;

declare function spyOn(object: any, method: string): JasmineSpy;

declare function runs(asyncMethod: Function): void;
declare function waitsFor(latchMethod: () => boolean, failureMessage?: string, timeout?: number): void;
declare function waits(timeout?: number): void;

declare var jasmine: {
  DEFAULT_TIMEOUT_INTERVAL: number,
  createSpy(name?: string): JasmineSpy,
  any(val: mixed): void,
  anything(): void,
  objectContaining(val: Object): void,
  arrayContaining(val: mixed[]): void,
  stringMatching(val: string): void,
  clock(): JasmineClock,
};

type JasmineAny = {
  jasmineMatches(other: any): boolean;
  jasmineToString(): string;
}

type JasmineObjectContaining = {
  jasmineMatches(other: any, mismatchKeys: any[], mismatchValues: any[]): boolean;
  jasmineToString(): string;
}

type JasmineBlock = {
  execute(onComplete: () => void): void;
}

type JasmineWaitsBlock = {
} & JasmineBlock

type JasmineWaitsForBlock = {
} & JasmineBlock

type JasmineClock = {
  reset(): void;
  tick(millis: number): void;
  runFunctionsWithinRange(oldMillis: number, nowMillis: number): void;
  scheduleFunction(timeoutKey: any, funcToCall: () => void, millis: number, recurring: boolean): void;
  useMock(): void;
  installMock(): void;
  uninstallMock(): void;
  real: void;
  assertInstalled(): void;
  isInstalled(): boolean;
  installed: any;
}

type JasmineEnv = {
  setTimeout: any;
  clearTimeout: void;
  setInterval: any;
  clearInterval: void;
  updateInterval: number;

  currentSpec: JasmineSpec;

  matchersClass: JasmineMatchers;

  version(): any;
  versionString(): string;
  nextSpecId(): number;
  addReporter(reporter: JasmineReporter): void;
  execute(): void;
  describe(description: string, specDefinitions: () => void): JasmineSuite;
  beforeEach(beforeEachFunction: () => void): void;
  currentRunner(): JasmineRunner;
  afterEach(afterEachFunction: () => void): void;
  xdescribe(desc: string, specDefinitions: () => void): JasmineXSuite;
  it(description: string, func: () => void): JasmineSpec;
  xit(desc: string, func: () => void): JasmineXSpec;
  compareRegExps_(a: RegExp, b: RegExp, mismatchKeys: string[], mismatchValues: string[]): boolean;
  compareObjects_(a: any, b: any, mismatchKeys: string[], mismatchValues: string[]): boolean;
  equals_(a: any, b: any, mismatchKeys: string[], mismatchValues: string[]): boolean;
  contains_(haystack: any, needle: any): boolean;
  addEqualityTester(equalityTester: (a: any, b: any, env: JasmineEnv, mismatchKeys: string[], mismatchValues: string[]) => boolean): void;
  specFilter(spec: JasmineSpec): boolean;
}

type JasmineFakeTimer = {
  reset(): void;
  tick(millis: number): void;
  runFunctionsWithinRange(oldMillis: number, nowMillis: number): void;
  scheduleFunction(timeoutKey: any, funcToCall: () => void, millis: number, recurring: boolean): void;
}

type JasmineHtmlReporter = {
}

type JasmineResult = {
  type: string;
}

type JasmineNestedResults = {
  description: string;

  totalCount: number;
  passedCount: number;
  failedCount: number;

  skipped: boolean;

  rollupCounts(result: JasmineNestedResults): void;
  log(values: any): void;
  getItems(): JasmineResult[];
  addResult(result: JasmineResult): void;
  passed(): boolean;
} & JasmineResult

type JasmineMessageResult = {
  values: any;
  trace: JasmineTrace;
} & JasmineResult

type JasmineExpectationResult = {
  matcherName: string;
  passed(): boolean;
  expected: any;
  actual: any;
  message: string;
  trace: JasmineTrace;
} & JasmineResult

type JasmineTrace = {
  name: string;
  message: string;
  stack: any;
}

type JasminePrettyPrinter = {
  format(value: any): void;
  iterateObject(obj: any, fn: (property: string, isGetter: boolean) => void): void;
  emitScalar(value: any): void;
  emitString(value: string): void;
  emitArray(array: any[]): void;
  emitObject(obj: any): void;
  append(value: any): void;
}

type JasmineStringPrettyPrinter = {
} & JasminePrettyPrinter

type JasmineQueue = {
  env: JasmineEnv;
  ensured: boolean[];
  blocks: JasmineBlock[];
  running: boolean;
  index: number;
  offset: number;
  abort: boolean;

  addBefore(block: JasmineBlock, ensure?: boolean): void;
  add(block: any, ensure?: boolean): void;
  insertNext(block: any, ensure?: boolean): void;
  start(onComplete?: () => void): void;
  isRunning(): boolean;
  next_(): void;
  results(): JasmineNestedResults;
}

type JasmineMatchers = {
  env: JasmineEnv;
  actual: any;
  spec: JasmineEnv;
  isNot?: boolean;
  message(): any;

  toBe(expected: any): boolean;
  toEqual(expected: any): boolean;
  toMatch(expected: any): boolean;
  toBeDefined(): boolean;
  toBeUndefined(): boolean;
  toBeNull(): boolean;
  toBeNaN(): boolean;
  toBeTruthy(): boolean;
  toBeFalsy(): boolean;
  toHaveBeenCalled(): boolean;
  toHaveBeenCalledWith(...params: any[]): boolean;
  toContain(expected: any): boolean;
  toBeLessThan(expected: any): boolean;
  toBeGreaterThan(expected: any): boolean;
  toBeCloseTo(expected: any, precision: any): boolean;
  toContainHtml(expected: string): boolean;
  toContainText(expected: string): boolean;
  toThrow(expected?: any): boolean;
  not: JasmineMatchers;

  Any: JasmineAny;
}

type JasmineReporter = {
  reportRunnerStarting(runner: JasmineRunner): void;
  reportRunnerResults(runner: JasmineRunner): void;
  reportSuiteResults(suite: JasmineSuite): void;
  reportSpecStarting(spec: JasmineSpec): void;
  reportSpecResults(spec: JasmineSpec): void;
  log(str: string): void;
}

type JasmineMultiReporter = {
  addReporter(reporter: JasmineReporter): void;
} & JasmineReporter

type JasmineRunner = {
  execute(): void;
  beforeEach(beforeEachFunction: JasmineSpecFunction): void;
  afterEach(afterEachFunction: JasmineSpecFunction): void;
  finishCallback(): void;
  addSuite(suite: JasmineSuite): void;
  add(block: JasmineBlock): void;
  specs(): JasmineSpec[];
  suites(): JasmineSuite[];
  topLevelSuites(): JasmineSuite[];
  results(): JasmineNestedResults;
}

type JasmineSpecFunction = {
  (spec?: JasmineSpec): void;
}

type JasmineSuiteOrSpec = {
  id: number;
  env: JasmineEnv;
  description: string;
  queue: JasmineQueue;
}

type JasmineSpec = {
  suite: JasmineSuite;

  afterCallbacks: JasmineSpecFunction[];
  spies_: JasmineSpy[];

  results_: JasmineNestedResults;
  matchersClass: JasmineMatchers;

  getFullName(): string;
  results(): JasmineNestedResults;
  log(arguments: any): any;
  runs(func: JasmineSpecFunction): JasmineSpec;
  addToQueue(block: JasmineBlock): void;
  addMatcherResult(result: JasmineResult): void;
  expect(actual: any): any;
  waits(timeout: number): JasmineSpec;
  waitsFor(latchFunction: JasmineSpecFunction, timeoutMessage?: string, timeout?: number): JasmineSpec;
  fail(e?: any): void;
  getMatchersClass_(): JasmineMatchers;
  addMatchers(matchersPrototype: any): void;
  finishCallback(): void;
  finish(onComplete?: () => void): void;
  after(doAfter: JasmineSpecFunction): void;
  execute(onComplete?: () => void): any;
  addBeforesAndAftersToQueue(): void;
  explodes(): void;
  spyOn(obj: any, methodName: string, ignoreMethodDoesntExist: boolean): JasmineSpy;
  removeAllSpies(): void;
} & JasmineSuiteOrSpec

type JasmineXSpec = {
  id: number;
  runs(): void;
}

type JasmineSuite = {
  parentSuite: JasmineSuite;

  getFullName(): string;
  finish(onComplete?: () => void): void;
  beforeEach(beforeEachFunction: JasmineSpecFunction): void;
  afterEach(afterEachFunction: JasmineSpecFunction): void;
  results(): JasmineNestedResults;
  add(suiteOrSpec: JasmineSuiteOrSpec): void;
  specs(): JasmineSpec[];
  suites(): JasmineSuite[];
  children(): any[];
  execute(onComplete?: () => void): void;
} & JasmineSuiteOrSpec

type JasmineXSuite = {
  execute(): void;
}

type JasmineSpy = {
  (...params: any[]): any;

  identity: string;
  calls: any[];
  mostRecentCall: { args: any[]; };
  argsForCall: any[];
  wasCalled: boolean;
  callCount: number;

  andReturn(value: any): JasmineSpy;
  andCallThrough(): JasmineSpy;
  andCallFake(fakeFunc: Function): JasmineSpy;
}

type JasmineUtil = {
  inherit(childClass: Function, parentClass: Function): any;
  formatException(e: any): any;
  htmlEscape(str: string): string;
  argsToArray(args: any): any;
  extend(destination: any, source: any): any;
}

type JasmineJsApiReporter = {

  started: boolean;
  finished: boolean;
  result: any;
  messages: any;


  suites(): JasmineSuite[];
  summarize_(suiteOrSpec: JasmineSuiteOrSpec): any;
  results(): any;
  resultsForSpec(specId: any): any;
  log(str: any): any;
  resultsForSpecs(specIds: any): any;
  summarizeResult_(result: any): any;
} & JasmineReporter
