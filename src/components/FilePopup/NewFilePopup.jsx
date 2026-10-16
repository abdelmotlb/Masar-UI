import React, { useState, useEffect } from "react";
import "./NewFilePopup.css";

export default function NewFilePopup({
    isOpen,
    onClose,
    onSubmit,
    mode = "create",
    file = null
}) {
    // TO BE HANDLED: make the attributes with references in predict the problems 
    const [summary, setSummary] = useState("");
    const [isFollowed, setIsFollowed] = useState(false);
    const [isOpenStatus, setIsOpenStatus] = useState(true);

    const isEditMode = mode === "edit";

    // Reset / load the form
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (isEditMode && file) {
            setSummary(file.subject ?? "");
            setIsFollowed(file.isFollowed ?? false);
            setIsOpenStatus(file.isOpen ?? true);
        } else {
            setSummary("");
            setIsFollowed(false);
            setIsOpenStatus(true);
        }

    }, [isOpen, isEditMode, file]);


    if (!isOpen) {
        return null;
    }


    async function handleSubmit() {

        const topicObj = {
            subject: summary,
            isFollowed: isFollowed,
            isOpen: isOpenStatus
        };

        await onSubmit(topicObj);
    }


    return (
        <div className="modal-overlay">

            <div className="create-file-modal" dir="rtl">

                <div className="modal-header">

                    <h2>
                        {isEditMode
                            ? "تعديل بيانات الملف"
                            : "إنشاء ملف جديد"
                        }
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>


                <div className="modal-body">

                    <div className="create-file-form-group">

                        <label>شأن الملف</label>

                        <textarea
                            rows={2}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="اكتب شأن الملف..."
                        />

                    </div>


                    <div className="create-file-form-group follow-up-option">

                        <label>
                            <input
                                type="checkbox"
                                checked={isFollowed}
                                onChange={(e) =>
                                    setIsFollowed(e.target.checked)
                                }
                            />

                            الإضافة للملفات المتابعة
                        </label>

                    </div>


                    <div className="create-file-form-group follow-up-option">

                        <label>
                            <input
                                type="checkbox"
                                checked={isOpenStatus}
                                onChange={(e) =>
                                    setIsOpenStatus(e.target.checked)
                                }
                            />

                            جعل حالة الملف مفتوح
                        </label>

                    </div>


                    {!isEditMode && (
                        <div className="modal-note">

                            <span className="note-icon">ℹ</span>

                            <span>
                                <strong>ملاحظة:</strong> سيتم إنشاء رقم الملف
                                تلقائياً بعد الضغط على
                                <strong> "إنشاء"</strong>.
                            </span>

                        </div>
                    )}

                </div>


                <div className="modal-footer">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        إلغاء
                    </button>

                    <button
                        className="create-btn"
                        onClick={handleSubmit}
                    >
                        {isEditMode ? "حفظ التعديلات" : "إنشاء"}
                    </button>

                </div>

            </div>

        </div>
    );
}
