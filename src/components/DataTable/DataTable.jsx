import Pagination from "./pagination/TablePagination";
import "./DataTable.css";
import TablePagination from "./pagination/TablePagination";

function DataTable({
    title,
    titleIcon = null,
    columns,
    data = [],
    onRowClick,
    onCreate,
    onDelete,
    createLabel = "إنشاء ملف",
    enableFetchDataByButton = false,
    onLoadData = null,
    pagination = null,
}) {
    return (
        <div className="data-table-container">

            {/* Toolbar */}
            <div className="data-table-toolbar">

                <h1 className="data-table-title">
                     {title}
                </h1>

                {onCreate && (
                    <button
                        className="data-table-create-btn"
                        onClick={onCreate}
                    >
                        <span className="create-icon">
                            +
                        </span>

                        {createLabel}
                    </button>
                )}

            </div>


            {/* Table */}
            <div className="data-table-wrapper">

                <table className="data-table">

                    <thead>
                        <tr>

                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        width: column.width,
                                        textAlign: column.align || "right"
                                    }}
                                >
                                    {column.title}
                                </th>
                            ))}

                            {onDelete && (
                                <th className="data-table-actions-header">
                                    الإجراءات
                                </th>
                            )}

                        </tr>
                    </thead>


                    <tbody>

                        {data.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (onDelete ? 1 : 0)
                                    }
                                    className="data-table-empty"
                                >
                                    <div className="data-table-empty-content">

                                        <div className="data-table-text">
                                            لا توجد بيانات
                                        </div>

                                        {enableFetchDataByButton && (
                                            <button
                                                type="button"
                                                onClick={() => onLoadData(1)}
                                                className="data-table-load-button"
                                            >
                                                تحميل البيانات
                                            </button>
                                        )}

                                    </div>
                                </td>
                            </tr>

                        ) : (

                            data.map((row) => (

                                <tr
                                    key={row.order}
                                    className="data-table-row"
                                    onClick={() =>
                                        onRowClick?.(row)
                                    }
                                >

                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            style={{
                                                textAlign: column.align || "right"
                                            }}
                                            className={
                                                column.className || ""
                                            }
                                        >
                                            {column.render
                                                ? column.render(
                                                      row[column.key],
                                                      row
                                                  )
                                                : row[column.key]
                                            }
                                        </td>
                                    ))}


                                    {onDelete && (
                                        <td
                                            className="data-table-actions-cell"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <button
                                                className="data-table-delete-btn"
                                                onClick={() =>
                                                    onDelete(row)
                                                }
                                                title="حذف"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    )}

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* Pagination */}
            <TablePagination
                pagination={pagination}
            />

        </div>
    );
}

export default DataTable;