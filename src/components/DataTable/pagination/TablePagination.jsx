import "./TablePagination.css";

/**
 * In any pagination type we need the total number
 * of records of the table.
 */
function TablePagination({ pagination }) {

    /*
     * Pagination is optional.
     */
    if (!pagination) {
        return null;
    }


    // TO DO HANDLED
    const {
        page,
        onPageChange,
        handleDisablingNextPage,
    } = pagination;

    /*
     * Change page.
     */
    const goToPage = (newPage) => {

        if (
            newPage < 1
        ) {
            return;
        }
        onPageChange(newPage);
    };

    return (
        <div className="data-table-pagination">

            <div className="data-table-pagination-controls">

                {/* Left Arrow - smaller page numbers */}
                <button
                    type="button"
                    className="pagination-btn pagination-arrow"
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                    aria-label="الانتقال إلى أرقام أقل"
                >
                    ‹
                </button>

                <span className="pagination-current-page" aria-current="page">
                    {page}
                </span>

                {/* Right Arrow - larger page numbers */}
                <button
                    type="button"
                    className="pagination-btn pagination-arrow"
                    disabled={handleDisablingNextPage? handleDisablingNextPage() : false}
                    onClick={() => goToPage(page + 1)}
                    aria-label="الانتقال إلى أرقام أكبر"
                >
                    ›
                </button>

            </div>

        </div>
    );
}

export default TablePagination;