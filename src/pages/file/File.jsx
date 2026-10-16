import React, { useEffect, useState } from 'react'
import HeaderTop from '../../components/headerTop/HeaderTop'
import DashboardLayout from '../../components/dashboard/Dashboard'
import { Outlet, useParams } from 'react-router';
import './File.css'
import ExchangeDetails from './exchangeDetails/ExchangeDetails';
import FileHeader from './header/FileHeader';
import { useNotification } from '../../components/notifier/NotificationProvider';
import { useLoadingSpinner } from '../../components/loader/LoadingSpinnerProvider';
import { useAuth } from '../../components/Authentication/AuthProvider';
import { httpErrorHandler } from '../../ErrorHandler/ErrorHandler';
import { getFullDataOfFileAPI } from '../../apis/File-api';


const mockResponse = {
    id: 12,
    order: 12,
    subject: "إجراءات التسجيل",
    isFollowed: true,
    isOpen: true,
    createdAt: "2026-10-01T08:30:00Z",
    lastModifiedAt: "2026-10-10T12:45:00Z",

    exchanges: [
        {
            id: 1,
            topicId: 12,
            createdAt: "2026-10-02T09:00:00Z",
            incomingMailAuthority: "وزارة الداخلية",
            inSerialNumberOfIncomingMail: "145",
            inSerialNumberDateOfIncomingMail: "2026-10-01",
            outSerialNumberOfIncomingMail: "87",
            outSerialNumberDateOfIncomingMail: "2026-10-03",
            specialist: "أحمد محمد",
            procedures: [
                {
                    id: 1,
                    description: "تمت مراجعة المستندات المطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبةالمطلوبة.",
                    createdAt: "2026-10-02T10:00:00Z"
                }
            ]
        },
        {
            id: 2,
            topicId: 12,
            createdAt: "2026-10-05T11:30:00Z",
            incomingMailAuthority: "وزارة الدفاع",
            inSerialNumberOfIncomingMail: "230",
            inSerialNumberDateOfIncomingMail: "2026-10-04",
            outSerialNumberOfIncomingMail: "102",
            outSerialNumberDateOfIncomingMail: "2026-10-06",
            specialist: "محمد علي",
            procedures: [
                {
                    id: 2,
                    description: "تم إرسال الرد إلى الجهة المختصة.",
                    createdAt: "2026-10-05T12:00:00Z"
                },
                {
                    id: 3,
                    description: "بانتظار استكمال الإجراءات.",
                    createdAt: "2026-10-06T08:30:00Z"
                }
            ]
        }
    ]
};

/**
 * TO BE HANDLED
 */
export default function File() {
    const { fileNumber } = useParams();
    const notify = useNotification();
    const loader = useLoadingSpinner();
    const { logout } = useAuth()
    const [essentialData, setEssentialData] = useState({})
    const [exchanges, setExchanges] = useState([])

    /**
     * load all the data of this file
     */
    useEffect(() => {
        const getData = async () => {
            loader.show("جارٍ إنشاء المراسلة...");
            try {
                // const response = await getFullDataOfFileAPI(fileNumber);
                const response = mockResponse; // Mocked response for testing purposes
                const {
                    exchanges: gotExchanges,
                    ...essential
                } = response;

                setEssentialData(essential);

                const sortedExchanges = [...(gotExchanges ?? [])]
                    .sort((a, b) => b.id - a.id);
                setExchanges(sortedExchanges ?? []);
            } catch (error) {
                httpErrorHandler({
                    err: error,
                    notify,
                    logout,
                    onCustomError: (error) => {
                        console.log("Custom error:", error);
                    },
                });
            }
            finally {
                loader.hide()
            }
        };

        getData();
    }, [])



    return (
        <DashboardLayout 
            headerTop={HeaderTop} 
            headerBottom={
                <FileHeader
                    essentialData={essentialData}
                    setEssentialData={setEssentialData}
                />
            } 
            children={
                <Outlet
                    context={{essentialFileData: essentialData, exchanges, setExchanges}}
                 />
            }
        />
    )
}
