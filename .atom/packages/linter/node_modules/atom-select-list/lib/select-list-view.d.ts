import { CompositeDisposable } from 'atom';
export declare type EtchElement = HTMLElement;
declare type EtchScheduler = any;
import { SelectListProperties } from './select-list-properties';
export type { SelectListProperties } from './select-list-properties';
export default class SelectListView {
    /** When creating a new instance of a select list, or when calling `update` on an existing one,
    you can supply an object with the typeof SelectListProperties */
    props: SelectListProperties;
    /** An array containing the filtered and ordered items to be shown in the select list. */
    private items;
    private disposables;
    private element;
    private didClickItemsList;
    private visibilityObserver;
    private listItems;
    private selectionIndex;
    private refs;
    static setScheduler(scheduler: EtchScheduler): void;
    static getScheduler(): any;
    constructor(props: SelectListProperties);
    initializeVisibilityObserver(): void;
    focus(): void;
    didLoseFocus(event: {
        relatedTarget: Node;
    }): void;
    reset(): void;
    destroy(): any;
    registerAtomCommands(): CompositeDisposable;
    update(props: SelectListProperties): any;
    render(): any;
    renderItems(): any;
    renderErrorMessage(): any;
    renderInfoMessage(): any;
    renderLoadingMessage(): any;
    getQuery(): any;
    getFilterQuery(): any;
    didChangeQuery(): void;
    didClickItem(itemIndex: number): void;
    computeItems(updateComponent?: boolean): void;
    fuzzyFilter(items: Array<string>, query?: string): string[];
    getSelectedItem(): string | object;
    renderItemAtIndex(index: number): void;
    selectPrevious(): any;
    selectNext(): any;
    selectFirst(): any;
    selectLast(): any;
    selectNone(): any;
    selectIndex(index: number, updateComponent?: boolean): any;
    selectItem(item: object | string): any;
    confirmSelection(): void;
    cancelSelection(): void;
}
