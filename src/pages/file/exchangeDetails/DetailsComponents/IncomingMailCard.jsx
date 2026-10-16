import React, { useEffect, useState } from 'react';
import './IncomingMailCard.css';
import { ExchangeAttributes, NotificationType } from '../../../../Constants';
import { useNotification } from '../../../../components/notifier/NotificationProvider';
import { useAuth } from '../../../../components/Authentication/AuthProvider';
import { httpErrorHandler } from '../../../../ErrorHandler/ErrorHandler';
import { useLoadingSpinner } from '../../../../components/loader/LoadingSpinnerProvider';
import { useParams } from 'react-router';

export default function IncomingMailCard({
    incomingMailAttrs,
    onIncomingMailUpdated,
    onUpdateIncomingMailField,
}) {
    const { exchangeId } = useParams();
    const notify = useNotification();
    const { logout } = useAuth();
    const loader = useLoadingSpinner();
    const isLoading = !!loader?.loading;

    const [editingField, setEditingField] = useState(null);
    const [draftValue, setDraftValue] = useState('');

    useEffect(() => {
        if (!editingField) {
            setDraftValue('');
        }
    }, [editingField]);

    function onOpenDocument() {
        notify({
            type: NotificationType.ERROR,
            message: "هذه الخدمة غير متوفرة حاليا"
        });
    }

    function getOriginalValue(field) {
        return incomingMailAttrs?.[field] ?? '';
    }

    function handleChange(value) {
        setDraftValue(value);
    }

    function startEditing(field) {

        setEditingField(field);
        setDraftValue(getOriginalValue(field));
    }

    function cancelEditing(field) {
        setEditingField(current =>
            current === field ? null : current
        );
        setDraftValue('');
    }

    async function saveField(field) {
        const originalValue = getOriginalValue(field);
        const newValue = draftValue ?? '';

        if (newValue === originalValue) {
            setEditingField(null);
            setDraftValue('');
            return;
        }

        loader.show("جارٍ حفظ التعديلات...");

        try {
            /*
             * The parent supplies the existing backend API function.
             *
             * It should resolve with the updated incoming-mail object
             * when the backend returns one. If it returns nothing, the
             * current incomingMailAttrs object is merged locally.
             */
            const updatedIncomingMail = await onUpdateIncomingMailField(exchangeId, field, newValue)
               
            const canonicalIncomingMail = {
                ...(incomingMailAttrs ?? {}),
                ...(updatedIncomingMail ?? {}),
                [field]:
                    updatedIncomingMail?.[field] ??
                    newValue,
            };
            onIncomingMailUpdated(canonicalIncomingMail);

            setEditingField(null);
            setDraftValue('');

            notify({
                type: NotificationType.SUCCESS,
                message: "تم حفظ التغييرات بنجاح",
            });
        } catch (err) {
            /*
             * The value was never committed to the canonical object.
             * Restore the original value when the request fails.
             */
            setDraftValue(originalValue);

            httpErrorHandler({
                err,
                notify,
                logout,
            });
        } finally {
            loader.hide();
        }
    }

    function handleBlur(field) {
        /*
         * Blur is a cancel operation.
         * The save button uses onMouseDown={preventDefault()} so
         * clicking ✓ does not cause this handler to run first.
         */
        if (isLoading) return;

        cancelEditing(field);
    }

    function handleKeyDown(event, field) {
        if (event.key === 'Escape') {
            event.preventDefault();
            cancelEditing(field);
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();

            const originalValue = getOriginalValue(field);
            const currentValue = draftValue ?? '';

            if (
                currentValue !== originalValue &&
                !isLoading
            ) {
                saveField(field);
            }
        }
    }

    function renderEditableField(field, type = 'text') {
        const isEditing = editingField === field;
        const originalValue = getOriginalValue(field);
        const currentValue = isEditing ? draftValue : originalValue;
        const hasChanged = currentValue !== originalValue;

        if (isEditing) {
            return (
                <div className="editable-field-container">
                    <input
                        autoFocus
                        type={type}
                        value={draftValue}
                        onChange={(e) =>
                            handleChange(e.target.value)
                        }
                        onBlur={() => handleBlur(field)}
                        onKeyDown={(e) =>
                            handleKeyDown(e, field)
                        }
                    />

                    <button
                        type="button"
                        className="field-save-button"
                        disabled={!hasChanged}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => saveField(field)}
                        aria-label="حفظ"
                        title="حفظ"
                    >
                        ✓
                    </button>
                </div>
            );
        }

        return (
            <span
                className="editable-value"
                onClick={() => startEditing(field)}
            >
                {originalValue || '—'}
            </span>
        );
    }

    return (
        <div className="mail-file-card">

            <div className="mail-sheet">

                {/* Header */}
                <div className="mail-header">
                    <span className="mail-icon">
                        ✉
                    </span>

                    <span className="mail-title">
                        جواب وارد
                    </span>
                </div>

                <div className="divider"></div>

                {/* Authority + Document */}
                <div className="authority-section">

                    <div className="field">
                        <label>جهة الوارد</label>

                        {renderEditableField(
                            ExchangeAttributes.incomingMailAuthority
                        )}
                    </div>

                    <button
                        type="button"
                        className="document-button"
                        title="فتح المستند"
                        onClick={onOpenDocument}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                d="M6 2h8l4 4v16H6V2z"
                            />

                            <path
                                d="M14 2v5h5"
                            />

                            <path
                                d="M9 13h6"
                            />

                            <path
                                d="M9 17h6"
                            />
                        </svg>
                    </button>

                </div>

                {/* Numbers */}
                <div className="numbers">

                    {/* Incoming */}
                    <div className="number-card">

                        <small>رقم الوارد</small>

                        {renderEditableField(
                            ExchangeAttributes.inSerialNumberOfIncomingMail
                        )}

                        <div className="date-row">

                            <small>التاريخ</small>

                            {renderEditableField(
                                ExchangeAttributes.inSerialNumberDateOfIncomingMail,
                                'date'
                            )}

                        </div>

                    </div>

                    {/* Outgoing */}
                    <div className="number-card">

                        <small>رقم الصادر</small>

                        {renderEditableField(
                            ExchangeAttributes.outSerialNumberOfIncomingMail
                        )}

                        <div className="date-row">

                            <small>التاريخ</small>

                            {renderEditableField(
                                ExchangeAttributes.outSerialNumberDateOfIncomingMail,
                                'date'
                            )}

                        </div>

                    </div>

                </div>

                <div className="divider"></div>

                {/* Specialist */}
                <div className="field">

                    <label>المختص</label>

                    {renderEditableField(
                        ExchangeAttributes.specialist
                    )}

                </div>

            </div>

        </div>
    );
}
