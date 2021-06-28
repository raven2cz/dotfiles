import type { JSX } from "solid-js"

// util types
export type Renderable = any

export type IndexType = string | number

// row and column types
export type Row = number | string | Record<IndexType, any>

export type Column<K extends IndexType = IndexType> = {
  id: K
  label?: string
  sortable?: boolean
  onClick?(e: MouseEvent, row: Row): void
}

/** Sort direction.
  It is a tuple:
  @columnID is the key used for sorting
  @type is the direction of the sort
*/
export type NonNullSortDirection<K extends IndexType = IndexType> = [columnID: K, type: "asc" | "desc"]
export type SortDirection<K extends IndexType = IndexType> = NonNullSortDirection<K> | [columnID: null, type: null]

// Props
export type Props<K extends IndexType> = {
  // rows
  rows: Array<Row>

  // Optional props:

  // columns

  // manually provided columns
  columns?: Array<Column<K>>

  /**
    if columns is not provided and Row is an object, construct columns based on this row
    Takes this Row's keys as Column IDs
    @default 0 (first row)
  */
  representitiveRowNumber?: number

  // renderers
  headerRenderer?(column: Column): string | Renderable
  bodyRenderer?(row: Row, columnID: K): string | Renderable

  // styles
  style?: JSX.CSSProperties | string
  className?: string

  // sort options
  defaultSortDirection?: NonNullSortDirection<K>
  rowSorter?(rows: Array<Row>, sortDirection: NonNullSortDirection<K>): Array<Row>

  // accessors

  /**
    set to true if you want column, row, and cell accessors
    @default false
  */
  accessors?: boolean

  /** a function that takes row and returns string unique key for that row
    @default {defaultGetRowID}
  */
  getRowID?(row: Row): string
}

// Component signals (states)
export type SortDirectionSignal<K extends IndexType = IndexType> = SortDirection<K> | undefined
export type RowsSignal = Array<Row>
