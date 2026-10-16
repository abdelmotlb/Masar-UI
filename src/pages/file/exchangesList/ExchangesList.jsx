import { useNavigate, useOutletContext, useParams } from "react-router";
import useClientPagination from "../../../components/DataTable/pagination/useClientPagination";
import { ExchangeAttributes, NotificationType, RoutePaths, TablePageSize } from "../../../Constants";
import DataTable from "../../../components/DataTable/DataTable";
import NewExchangePopup from "./newExchangePopup/NewExchangePopup";
import { useState } from "react";
import { createExchangeAPI, deleteExchangeAPI } from "../../../apis/File-api";
import { useAuth } from "../../../components/Authentication/AuthProvider";
import { httpErrorHandler } from "../../../ErrorHandler/ErrorHandler";
import { useNotification } from "../../../components/notifier/NotificationProvider";
import ConfirmPopup from "../../../components/ConfirmPopup/ConfirmPopup";
import { useLoadingSpinner } from "../../../components/loader/LoadingSpinnerProvider";

export default function ExchangesList() {
    const { essentialFileData, exchanges, setExchanges } = useOutletContext();
    const { paginatedData, pagination } = useClientPagination(exchanges, TablePageSize)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [pendingDeleteExchange, setPendingDeleteExchange] = useState(null);
    const navigate = useNavigate()
    const { logout } = useAuth()
    const notify = useNotification()
    const loader = useLoadingSpinner()
	function openCreateModal() {
		setIsCreateModalOpen(true);
	}

	function closeCreateModal() {
		setIsCreateModalOpen(false);
	}

    const columns = [
        {
            key: ExchangeAttributes.inSerialNumberOfIncomingMail,
            title: "رقم القيودات",
            width: "10%",
            align: "center",
            render: (value) => value ? value : "-"
        },
        {
            key: ExchangeAttributes.inSerialNumberDateOfIncomingMail,
            title: "تاريخه",
            width: "10%",
            align: "center",
            render: (value) => value ? value : "-"

        },
        {
            key: ExchangeAttributes.outSerialNumberOfIncomingMail,
            title: "رقم الورود",
            width: "10%",
            align: "center",
            render: (value) => value ? value : "-"

        },
        {
            key: ExchangeAttributes.outSerialNumberDateOfIncomingMail,
            title: "تاريخه",
            width: "10%",
            align: "center",
            render: (value) => value ? value : "-"

        },
        {
            key: ExchangeAttributes.incomingMailAuthority,
            title: "الجهة",
            width: "15%",
            align: "center",
            render: (value) => value ? value : "-"

        },
        {
            key: ExchangeAttributes.specialist,
            title: "المختص",
            width: "15%",
            render: (value) => value ? value : "-"

        },
        {
            key: "procedures",
            title: "آخر الاجراءات المتخذة",
            width: "30%",
            render: (procedures) =>
                [...(procedures ?? [])]
                    .sort((a, b) => b.id - a.id)[0]
                    ?.description || "-",
        },

    ];

    function handleRowClick(exchange) {
        navigate(`/file/${essentialFileData.order}/exchange/${exchange.id}`);
    }

	async function createExchange(NewExchangeObj) {
        loader.show("جارٍ حفظ الإجراء...");
        try {
            const result = await createExchangeAPI(15, NewExchangeObj);
            
            // reload exchanges
			notify({
                type: NotificationType.SUCCESS,
                message: "تم إنشاء الملف بنجاح",
			});

            // add the last exchange
            setExchanges(prev => [
                ...prev,
                {
                    incomingMailInSerialNumber: result.incomingMailInSerialNumber,
                    incomingMailInSerialNumberDate: result.incomingMailInSerialNumberDate,
                    
                    incomingMailOutSerialNumber: result.outSerialNumberOfIncomingMail,
                    incomingMailOutSerialNumberDate: result.outSerialNumberDateOfIncomingMail,
                    
                    incomingMailAuthority: result.incomingMailAuthority,
                    specialist: result.specialist
                }
            ]);

            // close popup
            setIsCreateModalOpen(false);

        } catch (error) {
            httpErrorHandler({
                err: error,
                notify,
                logout,
                onCustomError: (error) => {
                    console.log("Custom error:", error);
                },
            });
        } finally {
            loader.hide();
        }
    }

    function handleDelete(row) {
        setPendingDeleteExchange(row);
    }

    async function confirmDeleteExchange() {
        if (!pendingDeleteExchange) {
            return;
        }

        const exchangeId = pendingDeleteExchange.id;
        setPendingDeleteExchange(null);

        loader.show("جارٍ حذف المراسلة...");
        try {
            await deleteExchangeAPI(exchangeId);

            setExchanges(prev =>
                prev.filter(exchange => exchange.id !== exchangeId)
            );

            notify({
                type: NotificationType.SUCCESS,
                message: "تم حذف المبادلة بنجاح",
            });
        } catch (error) {
            httpErrorHandler({
                err: error,
                notify,
                logout,
                onCustomError: error => {
                    console.log("Custom error:", error);
                },
            });
        } finally {
            loader.hide();
        }
    }

    return (
        <>
            <DataTable
                title="⇋ المراسلات المتبادلة"
                columns={columns}
                data={paginatedData}
                pagination={pagination}
                onRowClick={handleRowClick}
                onCreate={openCreateModal}
                onDelete={handleDelete}
                createLabel="إنشاء مبادلة جديدة"
            />
            <NewExchangePopup
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onCreate={createExchange}
             />
            <ConfirmPopup
                isOpen={!!pendingDeleteExchange}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذه المراسلة؟"
                confirmText="حذف"
                cancelText="إلغاء"
                onClose={() => setPendingDeleteExchange(null)}
                onConfirm={confirmDeleteExchange}
            />

        </>
    );

}