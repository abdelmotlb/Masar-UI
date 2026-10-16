import { useEffect } from "react";
import { getPageOfFilesAPI } from "../../apis/File-api";
import DataTable from "../../components/DataTable/DataTable";
import useClientPagination from "../../components/DataTable/pagination/useClientPagination";
import useServerPagination from "../../components/DataTable/pagination/useServerPagination";
import { TablePageSize, RoutePaths } from "../../Constants";
import { useNavigate } from "react-router";
import { useAuthRef } from "../../components/Authentication/AuthProvider";

const egyptDateTimeFormatter = new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Cairo",
});

function Files() {
    const navigate = useNavigate();

    const {
        data: pageOfFiles,
        error,
        pagination,
        loadPage
    } = useServerPagination({
        getPageOfFiles: getPageOfFilesAPI,
        pageSize: TablePageSize
    });

    const isAuthenticatedRef = useAuthRef();

    useEffect(() => {
        if (!isAuthenticatedRef.current) return;
        void loadPage(1);
    }, [loadPage]);

    
    const columns = [
        {
            key: "order",
            title: "رقم الملف",
            width: "10%",
            align: "center",
        },
        {
            key: "isOpen",
            title: "الحالة",
            width: "15%",
            align: "center",
            render: (value) => value ? "مفتوح" : "مقفول"

        },
        {
            key: "lastModifiedAt",
            title: "آخر تحديث",
            width: "25%",
            align: "center",
            render: (value) => {
                if (!value) return "-";

                const date = new Date(value);
                return Number.isNaN(date.getTime())
                    ? "-"
                    : egyptDateTimeFormatter.format(date);
            }
        },
        {
            key: "subject",
            title: "الشأن",
            width: "50%",
        }
    ];

    const handleRowClick = (file) => {
        console.log("Opening:", file.order);

        // Later:
        navigate(`/${RoutePaths.FILE}/${file.order}`);
    };

    return (
        <DataTable
            title=" 🗀 الملفات"

            columns={columns}

            data={pageOfFiles}

            pagination={pagination}

            onRowClick={handleRowClick}

            createLabel="إنشاء ملف"

            enableFetchDataByButton = {true}

            onLoadData={loadPage}
        />
    );
}

export default Files;