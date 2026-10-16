import { useCallback, useEffect, useState } from "react";
import { useNotification } from "../../../components/notifier/NotificationProvider";
import { useLoadingSpinner } from '../../../components/loader/LoadingSpinnerProvider';
import { NotificationType } from "../../../Constants";
import { useAuth } from "../../Authentication/AuthProvider";
import { httpErrorHandler } from "../../../ErrorHandler/ErrorHandler";

function useServerPagination({
    getPageOfFiles,
    pageSize
}) {

    const [page, setPage] = useState(1);

    const [data, setData] = useState([]);

    const loader = useLoadingSpinner();

    const notify = useNotification();

    const { logout } = useAuth()

    /*
     * Load a page from the server.
     */
    const loadPage = useCallback(
        async (sentPage) => {
            loader.show("جارٍ تحميل الملفات...")

            try {

                const result =
                    await getPageOfFiles(
                        sentPage, pageSize
                    );

                const sortedData = [...result].sort((a, b) => b.order - a.order);
                
                setData(sortedData);
                
                return true
            } catch (error) {
                httpErrorHandler({
                    err: error,
                    notify,
                    logout,
                    onCustomError: (error) => {
                        console.log("Custom error:", error);
                    },
                });

                return false;
            } finally {
                loader.hide()
            }
        },
        [
            getPageOfFiles,
            pageSize
        ]
    );

    /**
     * handle the page change by the user.
     */
    const onPageChange = async (newPage) => {

        if ( newPage < 1 ) {
            notify({
                type: NotificationType.ERROR,
                message: "هذه هي الصفحة الأولى !! ",
            });

            return;
        }
        let success = await loadPage(newPage);
        if (success) setPage(newPage)
    };

    return {
        data,

        loadPage,

        pagination: {
            page,
            pageSize,
            onPageChange: onPageChange,
        },
    };
}

export default useServerPagination;