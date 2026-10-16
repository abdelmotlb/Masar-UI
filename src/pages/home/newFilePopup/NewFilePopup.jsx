
import React from 'react'
import { useState, useEffect } from "react";
import "./NewFilePopup.css";

export default function NewFilePopup({
    isOpen,
    onClose,
    onCreate
}) {

    const [summary, setSummary] = useState("");
    const [isFollowed, setIsFollowed] = useState(false);
    const [isOpenStatus, setIsOpenStatus] = useState(true);

    // reset the form
    useEffect(() => {
        if (isOpen) {
            setSummary("");
            setIsFollowed(false);
            setIsOpenStatus(true);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    async function handleCreate() {        
        const NewTopicObj = {
            Subject: summary,
            IsFollowed: isFollowed,
            IsOpen: isOpenStatus
        };

        await onCreate(NewTopicObj);
    }

    return (
        <div className="modal-overlay">

            <div className="create-file-modal" dir="rtl">

                <div className="modal-header">

                    <h2>إنشاء ملف جديد</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">

                    <div className="form-group">

                        <label>شأن الملف</label>

                        <textarea
                            rows={2}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="اكتب شأن الملف..."
                        />

                    </div>

                    <div className="form-group follow-up-option">

                        <label>
                            <input
                                type="checkbox"
                                checked={isFollowed}
                                onChange={(e) => setIsFollowed(e.target.checked)}
                            />

                            الإضافة للملفات المتابعة
                        </label>

                    </div>

                    <div className="form-group follow-up-option">

                        <label>
                            <input
                                type="checkbox"
                                checked={isOpenStatus}
                                onChange={(e) => (setIsOpenStatus(e.target.checked), console.log(e.target.checked))}
                            />

                            جعل حالة الملف مفتوح
                        </label>

                    </div>

                    <div className="modal-note">

                        <span className="note-icon">ℹ</span>

                        <span>
                            <strong>ملاحظة:</strong> سيتم إنشاء رقم الملف تلقائياً بعد الضغط على
                            <strong> "إنشاء"</strong>.
                        </span>

                    </div>

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
                        onClick={handleCreate}
                    >
                        إنشاء
                    </button>

                </div>

            </div>

        </div>
    );
}
