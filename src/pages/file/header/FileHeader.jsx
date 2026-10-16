import React, { useEffect, useState } from 'react';
import './FileHeader.css';
import NewFilePopup from '../../../components/FilePopup/NewFilePopup';
import { ModeOfOperation, NotificationType } from '../../../Constants';
import { updateFileAPI } from '../../../apis/File-api';
import { useNotification } from '../../../components/notifier/NotificationProvider';
import { useAuth } from '../../../components/Authentication/AuthProvider';
import { httpErrorHandler } from '../../../ErrorHandler/ErrorHandler';
import { useLoadingSpinner } from '../../../components/loader/LoadingSpinnerProvider';

export default function FileHeader({essentialData, setEssentialData}) {

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const loader = useLoadingSpinner();
	const notify = useNotification();
	const { logout } = useAuth()
	function openEditModal() {
		setIsEditModalOpen(true);
	}

    function closeEditModal() {
        setIsEditModalOpen(false);
    }

    async function updateFile (updatedFileData) {
        loader.show("جارٍ حفظ تعديلات الملف...");
        try {
            const updatedFile = { ...updatedFileData, Order: essentialData.order };
            let result = await updateFileAPI(updatedFile);
            const lastModifiedAt = result.lastModifiedAt;

            // updated successfully
            notify({
                type: NotificationType.SUCCESS,
                message: "تم تعديل الملف بنجاح",
            });
            
            setEssentialData(prev => ({
                ...prev,
                ...updatedFileData,
                lastModifiedAt
            }));
            closeEditModal();

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

    return (
        <>
            <NewFilePopup 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={updateFile}
                mode={ModeOfOperation.EDIT}
                file={essentialData}
            />
            <div className="header-bottom">
                <div className="file-summary">

                    <div className="summary-item file-number">
                        <span className="label">ملف رقم:</span>
                        <span className="value">{essentialData.order}</span>
                    </div>

                    <div className="status-group">
                        <div className="summary-item">
                            <span className="label">الحالة:</span>
                            <span className={`status ${essentialData.isOpen ? "open" : "closed"}`}>
                                {essentialData.isOpen ? "مفتوح" : "مغلق"}
                            </span>
                        </div>

                        <div className="summary-item">
                            <span className="label">مثبت:</span>
                            <span className={`status ${essentialData.isFollowed ? "pinned" : "not-pinned"}`}>
                                {essentialData.isFollowed ? "نعم" : "لا"}
                            </span>
                        </div>
                    </div>

                    {/* TO BE HANDLED: IF THE SUBJECT TEXT IS TOO LARGE */}
                    <div className="summary-item subject">
                        <span className="label">الموضوع:</span>
                        <span className="value">
                            {essentialData.subject}
                        </span>
                    </div>

                    {/* Edit button */}
                    <button
                        className="edit-file-button"
                        type="button"
                        title="تعديل بيانات الملف"
                        onClick={openEditModal}
                    >
                        <span className="edit-icon">✎</span>
                    </button>

                </div>
            </div>
        </>
    );
}
