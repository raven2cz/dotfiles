/* @flow */

declare var jasmine: Object;
declare function requestAnimationFrame(callback: (() => void)): void;

declare function it(name: string, callback: (() => void)): void;
declare function fit(name: string, callback: (() => void)): void;
declare function spyOn(obj: Object, property: string): Object;
declare function expect(value: any): Object;
declare function describe(name: string, callback: (() => void)): void;
declare function beforeEach(callback: (() => void)): void;
declare function afterEach(callback: (() => void)): void;
declare function waitsForPromise(callback: (() => Promise<any>)): void;
