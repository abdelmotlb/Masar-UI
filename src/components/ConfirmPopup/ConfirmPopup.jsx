import React from 'react';
import './ConfirmPopup.css';

export default function ConfirmPopup({
    isOpen,
    title = 'تأكيد',
    message = 'هل أنت متأكد؟',
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    onConfirm,
    onClose,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="confirm-modal"
                dir="rtl"
                onClick={event => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body confirm-body">
                    <div className="confirm-icon">!</div>

                    <p className="confirm-message">
                        {message}
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="confirm-btn"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
