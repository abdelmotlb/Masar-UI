import { useEffect, useMemo, useState } from "react";


function useClientPagination(
    data = [],
    pageSize = 10
) {

    const totalItems = data.length;

    /*
     * Number of pages.
     *
     * Example:
     *
     * 26 items / 5
     *
     * = 6 pages
     */
    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / pageSize)
    );


    /*
     * Page 1 is always the newest records.
     *
     * Therefore page 1 corresponds to
     * the END of the array.
     */
    const [page, setPage] = useState(1);


    /*
     * Keep the current page valid when
     * the amount of data changes.
     *
     * Example:
     *
     * User is on page 6.
     *
     * Records are deleted and now only
     * 20 records exist.
     *
     * Page 6 no longer exists → page 1.
     */
    useEffect(() => {

        setPage((currentPage) => {

            if (currentPage > totalPages) {
                return totalPages;
            }

            return currentPage;
        });

    }, [totalPages]);


    /*
     * Get the records for the current page.
     *
     * IMPORTANT:
     *
     * We take records FROM THE END of the array.
     *
     * Assuming the array is sorted:
     *
     * oldest ---------------- newest
     * [1, 2, 3, ... , 24, 25, 26]
     *
     * Page 1:
     * [22, 23, 24, 25, 26]
     *
     * Page 2:
     * [17, 18, 19, 20, 21]
     */
    const getPaginatedData = () => {

        if (totalItems === 0) {
            return [];
        }


        const endIndex =
            totalItems - ((page - 1) * pageSize);

        const startIndex =
            Math.max(1, endIndex - pageSize + 1);
        console.log(typeof(data));
        let pageOfData = data.slice(
            startIndex - 1,
            endIndex
        );
        return pageOfData;
    };
    const paginatedData = useMemo(
        () => getPaginatedData(),
        [data, page, pageSize]
    );

    /*
     * Change page.
     */
    const onPageChange = (newPage) => {

        if (
            newPage < 1 ||
            newPage > totalPages
        ) {
            return;
        }
        setPage(newPage);
    };

    function handleDisablingNextPage() {
        return page === totalPages;
    }


    /*
     * Return the pagination information.
     */
    return {

        paginatedData,

        pagination: {

            page,

            pageSize,

            totalPages,

            onPageChange,

            handleDisablingNextPage
        },

    };
}


export default useClientPagination;