import { createSignal, createComputed, For } from "solid-js"
import "./SimpleTable.less"
import {
  Props,
  IndexType,
  SortDirectionSignal,
  RowsSignal,
  SortDirection,
  NonNullSortDirection,
  Row,
  Column,
} from "./SimpleTable.types"

export * from "./SimpleTable.types"

export function SimpleTable(props: Props<IndexType>) {
  const [getSortDirectionSignal, setSortDirection] = createSignal<SortDirectionSignal>()
  const [getRows, setRows] = createSignal<RowsSignal>(props.rows)

  // update the local copy whenever the parent updates
  createComputed(() => {
    setRows(props.rows)
  })

  function getSortDirection(): SortDirection {
    const sortDirection = getSortDirectionSignal()
    if (sortDirection !== undefined) {
      return sortDirection
    }
    // use default sort direction:
    else if (props.defaultSortDirection !== undefined) {
      return props.defaultSortDirection
    } else {
      return [null, null]
    }
  }

  function generateSortCallback(columnID: IndexType) {
    return (e: MouseEvent) => {
      setSortDirection(sortClickHandler(getSortDirection(), columnID, /* append */ e.shiftKey))
      sortRows()
    }
  }

  const rowSorter: NonNullable<Props<IndexType>["rowSorter"]> = props.rowSorter ?? defaultSorter

  // Row sorting logic:
  function sortRows() {
    const currentSortDirection = getSortDirection()
    // if should reset sort
    if (
      currentSortDirection[0] === null &&
      /* if defaultSortDirection is provided */ props.defaultSortDirection !== undefined
    ) {
      // reset sort
      setRows(rowSorter(getRows(), props.defaultSortDirection))
    }
    // if should sort normally
    else if (currentSortDirection[0] !== null) {
      setRows(rowSorter(getRows(), currentSortDirection))
    } // else ignore sort
  }

  // static props:
  // destructure the props that are not tracked and are used inside the loop (cache the property access)
  const {
    headerRenderer = defaultHeaderRenderer,
    bodyRenderer = defaultBodyRenderer,
    getRowID = defaultGetRowID,
    accessors,
  } = props

  function maybeRowID(row: Row) {
    // if accessors are needed
    if (accessors) {
      return getRowID(row)
    } else {
      return undefined
    }
  }

  if (props.columns === undefined) {
    props.columns = defaultColumnMaker(props.rows, props.representitiveRowNumber)
  }

  // initial sort
  sortRows()

  return (
    <table className={`solid-simple-table ${props.className ?? ""}`} style={props.style}>
      <thead>
        <tr>
          <For each={props.columns}>
            {(column) => {
              const isSortable = column.sortable !== false
              return (
                <th
                  id={accessors ? String(column.id) : undefined}
                  className={isSortable ? "sortable" : undefined}
                  onClick={isSortable ? generateSortCallback(column.id) : undefined}
                >
                  {headerRenderer(column)}
                  {isSortable ? renderHeaderIcon(getSortDirection(), column.id) : undefined}
                </th>
              )
            }}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={getRows()}>
          {(row) => {
            const rowID = maybeRowID(row)
            return (
              <tr id={rowID}>
                <For each={props.columns!}>
                  {(column) => {
                    return (
                      <td
                        onClick={column.onClick !== undefined ? (e: MouseEvent) => column.onClick!(e, row) : undefined}
                        id={rowID ? `${rowID}.${column.id}` : undefined}
                      >
                        {bodyRenderer(row, column.id)}
                      </td>
                    )
                  }}
                </For>
              </tr>
            )
          }}
        </For>
      </tbody>
    </table>
  )
}

const ARROW = {
  UP: "↑",
  DOWN: "↓",
  BOTH: "⇅",
}

function defaultColumnMaker(rows: Array<Row>, representitiveRowNumber: number = 0) {
  // construct the column information based on the representitive row
  const representitiveRow = rows[representitiveRowNumber]
  const columnIDs = Object.keys(representitiveRow)

  // make Array<{key: columnID}>
  const columnNumber = columnIDs.length
  const columns: Array<Column> = new Array(columnNumber)
  for (let iCol = 0; iCol < columnNumber; iCol++) {
    columns[iCol] = { id: columnIDs[iCol] }
  }
  return columns
}

// Returns a string from any value
function stringer(value: any) {
  if (typeof value === "string") {
    return value
  } else {
    return JSON.stringify(value)
  }
}

function defaultHeaderRenderer(column: Column) {
  return column.label ?? column.id
}

function defaultBodyRenderer(row: Row, columnID: IndexType) {
  if (typeof row === "object") {
    return stringer(row[columnID])
  } else {
    return stringer(row)
  }
}

function defaultGetRowID(row: Row) {
  return stringer(row)
}

function renderHeaderIcon(sortDirection: SortDirection, columnID: IndexType) {
  let icon
  if (sortDirection[0] === null || sortDirection[0] !== columnID) {
    icon = ARROW.BOTH
  } else {
    icon = sortDirection[1] === "asc" ? ARROW.DOWN : ARROW.UP
  }
  return <span className="sort-icon">{icon}</span>
}

function sortClickHandler(sortDirection: SortDirection, columnID: IndexType, append: boolean) {
  const previousSortedColumn = sortDirection[0]
  const previousSortedDirection = sortDirection[1]

  // if holding shiftKey while clicking: reset sorting
  if (append) {
    sortDirection = [null, null]
  }
  // if clicking on an already sorted column: invert direction on click
  else if (previousSortedColumn === columnID) {
    sortDirection[1] = previousSortedDirection === "asc" ? "desc" : "asc" // invert direction
  }
  // if clicking on a new column
  else {
    sortDirection = [columnID, "asc"]
  }
  return sortDirection
}

/**
 Default alphabetical sort function
 @param rows: the rows of the table
 @param columnID: the last clicked columnID
*/
function defaultSorter(
  rows: Array<number | string | Record<IndexType, any>>,
  sortDirection: NonNullSortDirection
): Array<Row> {
  if (!rows.length) {
    return rows
  }
  const columnID = sortDirection[0]
  if (typeof rows[0] === "object") {
    rows = rows.sort((r1, r2) => {
      const r1_val = (r1 as Record<IndexType, any>)[columnID]
      const r2_val = (r2 as Record<IndexType, any>)[columnID]
      if (r1_val == r2_val) {
        // equal values
        return 0
      } else if (r1_val < r2_val) {
        return -1 //r1_val comes first
      } else {
        return 1 // r2_val comes first
      }
    })
  } else {
    rows = rows.sort()
  }

  return sortDirection[1] === "desc" ? rows.reverse() : rows
}
