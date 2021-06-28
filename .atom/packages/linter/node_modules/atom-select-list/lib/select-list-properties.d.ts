import { EtchElement } from './select-list-view';
export interface SelectListProperties {
    /** an array containing the objects you want to show in the select list. */
    items: Array<object | string>;
    /**
     * a function that is called whenever an item needs to be displayed.
     *
     * `options: { selected: boolean, index: number, visible: boolean }`
     *
     * - `selected`: indicating whether item is selected or not.
     * - `index`: item's index.
     * - `visible`: indicating whether item is visible in viewport or not. Unless initiallyVisibleItemCount was given,
          this value is always true.
     */
    elementForItem: (item: object | string, options: {
        selected: boolean;
        index: number;
        visible: boolean;
    }) => EtchElement;
    /** (Optional) the number of maximum items that are shown. */
    maxResults?: number;
    /** (Optional) a function that allows to decide which items to show whenever the query changes.
    By default, it uses fuzzaldrin to filter results. */
    filter?: (items: Array<object | string>, query: string) => Array<object>;
    /** (Optional) when filter is not provided, this function will be called to retrieve a string property on each item,
    and that will be used to filter them. */
    filterKeyForItem?: (item: object | string) => string;
    /** (Optional) a function that allows to apply a transformation to the user query and whose return value
    will be used to filter items. */
    filterQuery?: (query: string) => string;
    /** (Optional) a string that will replace the contents of the query editor. */
    query?: string;
    /** (Optional)  a boolean indicating whether the query text should be selected or not. */
    selectQuery?: boolean;
    /** (Optional)  a function that allows to change the order in which items are shown. */
    order?: (item1: object | string, item2: object | string) => number;
    /** (Optional) a string shown when the list is empty. */
    emptyMessage?: string;
    /** (Optional) a string that needs to be set when you want to notify the user that an error occurred. */
    errorMessage?: string;
    /** (Optional) a string that needs to be set when you want to provide some information to the user. */
    infoMessage?: string;
    /** (Optional) a string that needs to be set when you are loading items in the background. */
    loadingMessage?: string;
    /** (Optional) a string or number that needs to be set when the progress status changes
    (e.g. a percentage showing how many items have been loaded so far). */
    loadingBadge?: string | number;
    /** (Optional) an array of strings that will be added as class names to the items element. */
    itemsClassList?: Array<string>;
    /** (Optional) the index of the item to initially select and automatically select after query changes; defaults to 0. */
    initialSelectionIndex?: number;
    /** (Optional) a function that is called when the query changes. */
    didChangeQuery?: (query: string) => void;
    /** (Optional) a function that is called when the selected item changes. */
    didChangeSelection?: (item: object | string) => void;
    /** (Optional) a function that is called when the user clicks or presses Enter on an item. */
    didConfirmSelection?: (item: object | string) => void;
    /** (Optional) a function that is called when the user presses Enter but the list is empty. */
    didConfirmEmptySelection?: () => void;
    /** (Optional) a function that is called when the user presses Esc or the list loses focus. */
    didCancelSelection?: () => void;
    /** (Optional) When this options was provided, SelectList observe visibility of items in viewport, visibility state is
    passed as visible option to elementForItem. This is mainly used to skip heavy computation for invisible items. */
    initiallyVisibleItemCount?: number;
    skipCommandsRegistration?: boolean;
}
