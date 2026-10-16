import React, { useEffect, useRef, useState } from 'react';
import './ActionPanel.css';

import {
    createProcedureAPI,
    updateProcedureAPI,
    deleteProcedureAPI,
} from '../../../../apis/File-api';

import { useParams } from 'react-router';
import { useAuth } from '../../../../components/Authentication/AuthProvider';
import { httpErrorHandler } from '../../../../ErrorHandler/ErrorHandler';
import { useNotification } from '../../../../components/notifier/NotificationProvider';
import { NotificationType } from '../../../../Constants';
import { useLoadingSpinner } from '../../../../components/loader/LoadingSpinnerProvider';
import ConfirmPopup from '../../../../components/ConfirmPopup/ConfirmPopup';

export default function ActionPanel({
    procedures = [],
    onOpenDocument,
    onProcedureCreated,
    onProcedureUpdated,
    onProcedureDeleted,
}) {
    const { exchangeId } = useParams();
    const { logout } = useAuth();
    const notify = useNotification();
    const loader = useLoadingSpinner();
    const isLoading = !!loader?.loading;

    const [editingProcedureId, setEditingProcedureId] = useState(null);
    const [editingText, setEditingText] = useState('');

    const [isAdding, setIsAdding] = useState(false);
    const [newProcedure, setNewProcedure] = useState('');
    const [pendingDeleteProcedure, setPendingDeleteProcedure] = useState(null);

    const textareaRef = useRef(null);

    /*
     * Display procedures newest first.
     */
    const sortedProcedures = [...procedures].sort(
        (a, b) => b.id - a.id
    );

    /*
     * Automatically resize the textarea according
     * to its content.
     */
    useEffect(() => {
        if (!textareaRef.current) {
            return;
        }

        textareaRef.current.style.height = 'auto';

        textareaRef.current.style.height =
            `${textareaRef.current.scrollHeight}px`;
    }, [
        editingText,
        newProcedure,
        editingProcedureId,
        isAdding,
    ]);

    /*
     * Start editing an existing procedure.
     */
    function startEditing(procedure) {
        setEditingProcedureId(procedure.id);
        setEditingText(procedure.description ?? '');
    }

    /*
     * Leave edit mode without saving.
     *
     * Saving only happens through ✓.
     */
    function finishEditing() {
        setEditingProcedureId(null);
        setEditingText('');
    }

    /*
     * Save an existing procedure.
     */
    async function saveExistingProcedure(procedure) {
        if (isLoading) return;

        const value = editingText.trim();
        const originalValue =
            (procedure.description ?? '').trim();

        if (!value) {
            return;
        }

        if (value === originalValue) {
            return;
        }

        loader.show("جارٍ إضافة الإجراء...");

        try {
            const updatedProcedure = await updateProcedureAPI(
                exchangeId,
                procedure.id,
                { Description: value }
            );
            // const updatedProcedure = {
            //     ...procedure,
            //     description: value,
            // };
            onProcedureUpdated?.(
                procedure.id,
                updatedProcedure?.description ?? value
            );

            finishEditing();

            notify({
                type: NotificationType.SUCCESS,
                message: "تم حفظ التغييرات بنجاح",
            });
        } catch (error) {
            httpErrorHandler({
                err: error,
                notify,
                logout,
                onCustomError: error => {
                    console.log('Custom error:', error);
                },
            });
        } finally {
            loader.hide();
        }
    }

    /*
     * Start adding a new procedure.
     */
    function startAdding() {
        setIsAdding(true);
        setNewProcedure('');
    }

    /*
     * Cancel adding.
     *
     * Escape uses this.
     */
    function cancelAdd() {
        setIsAdding(false);
        setNewProcedure('');
    }

    /*
     * Create a new procedure.
     */
    async function confirmAdd() {
        const value = newProcedure.trim();

        if (!value) {
            return;
        }

        loader.show("جارٍ حذف الإجراء...");

        try {
            const createdProcedure =
                await createProcedureAPI(
                    exchangeId,
                    {
                        Description: value,
                    }
                );
            onProcedureCreated?.(createdProcedure);

            setIsAdding(false);
            setNewProcedure('');

            notify({
                type: NotificationType.SUCCESS,
                message: "تم إضافة الإجراء بنجاح",
            });
        } catch (error) {
            httpErrorHandler({
                err: error,
                notify,
                logout,
                onCustomError: error => {
                    console.log('Custom error:', error);
                },
            });
        } finally {
            loader.hide();
        }
    }

    async function deleteProcedure(procedure) {
        if (isLoading || !procedure) {
            return;
        }

        loader.show("جارٍ حفظ التعديلات...");
        try {
            await deleteProcedureAPI(
                exchangeId,
                procedure.id
            );

            onProcedureDeleted?.(procedure.id);
            notify({
                type: NotificationType.SUCCESS,
                message: "تم حذف الإجراء بنجاح",
            });
        } catch (error) {
            httpErrorHandler({
                err: error,
                notify,
                logout,
                onCustomError: error => {
                    console.log('Custom error:', error);
                },
            });
        } finally {
            loader.hide();
        }
    }

    function handleDeleteConfirmation() {
        if (!pendingDeleteProcedure) {
            return;
        }

        const procedureToDelete = pendingDeleteProcedure;
        setPendingDeleteProcedure(null);
        deleteProcedure(procedureToDelete);
    }

    /*
     * Keyboard handling for existing procedure.
     *
     * Enter       -> save
     * Shift+Enter -> new line
     * Escape      -> leave edit mode without saving
     */
    function handleEditKeyDown(event, procedure) {
        if (event.key === 'Escape') {
            event.preventDefault();

            finishEditing();
            return;
        }

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {
            event.preventDefault();

            const value = editingText.trim();

            const originalValue =
                (procedure.description ?? '').trim();

            const hasChanges =
                value !== originalValue;

            if (hasChanges && !isLoading) {
                saveExistingProcedure(procedure);
            }
        }
    }

    /*
     * Keyboard handling for adding.
     *
     * Enter       -> create
     * Shift+Enter -> new line
     * Escape      -> cancel
     */
    function handleAddKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();

            cancelAdd();
            return;
        }

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {
            event.preventDefault();

            if (
                newProcedure.trim() &&
                !isLoading
            ) {
                confirmAdd();
            }
        }
    }

    /*
     * Open the document associated with a procedure.
     *
     * This is a placeholder for the actual implementation.
     */
    function onOpenDocument() {
        notify({
            type: NotificationType.ERROR,
            message: "هذه الخدمة غير متوفرة حاليا"
        });
    }

    return (
        <>
            <ConfirmPopup
                isOpen={!!pendingDeleteProcedure}
                title="تأكيد الحذف"
                message="هل أنت متأكد من حذف هذا الإجراء؟"
                confirmText="حذف"
                cancelText="إلغاء"
                onClose={() => setPendingDeleteProcedure(null)}
                onConfirm={handleDeleteConfirmation}
            />

            <div className="mail-file-card">
                <div className="action-panel">

                {/* =========================
                    Header
                ========================= */}
                <div className="action-header">
                    <div className="action-icon">
                        ✓
                    </div>

                    <div className="action-title">
                        الإجراءات المتخذة
                    </div>
                </div>

                <div className="divider" />

                {/* =========================
                    Add procedure
                ========================= */}
                {isAdding ? (
                    <div className="procedure-row adding">

                        <div className="procedure-add-icon">
                            +
                        </div>

                        <div className="procedure-content">
                            <textarea
                                ref={textareaRef}
                                autoFocus
                                rows={1}
                                value={newProcedure}
                                onBlur={cancelAdd}
                                onChange={e =>
                                    setNewProcedure(
                                        e.target.value
                                    )
                                }
                                onKeyDown={handleAddKeyDown}
                                placeholder="اكتب الإجراء المتخذ..."
                            />
                        </div>

                        <div className="procedure-actions">

                            <button
                                type="button"
                                className="procedure-action confirm-action"
                                disabled={
                                    !newProcedure.trim() ||
                                    isLoading
                                }
                                onMouseDown={e =>
                                    e.preventDefault()
                                }
                                onClick={confirmAdd}
                                title="حفظ الإجراء"
                            >
                                ✓
                            </button>

                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="add-procedure-row"
                        onClick={startAdding}
                    >
                        <span className="add-icon">
                            +
                        </span>

                        <span>
                            إضافة إجراء
                        </span>
                    </button>
                )}

                {/* =========================
                    Procedures
                ========================= */}
                {sortedProcedures.map(
                    (procedure, index) => {

                        const isEditing =
                            editingProcedureId ===
                            procedure.id;

                        const originalValue =
                            procedure.description ?? '';

                        const currentValue =
                            editingText;

                        const hasChanges =
                            currentValue.trim() !==
                            originalValue.trim();

                        return (
                            <React.Fragment
                                key={
                                    procedure.id ??
                                    index
                                }
                            >
                                <div className="divider" />

                                <div
                                    className={[
                                        'procedure-row',
                                        isEditing
                                            ? 'editing'
                                            : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                >

                                    {/* =================
                                        Counter
                                    ================= */}
                                    <div className="procedure-index">
                                        {
                                            sortedProcedures.length -
                                            index
                                        }
                                    </div>

                                    {/* =================
                                        Description
                                    ================= */}
                                    <div
                                        className="procedure-content"
                                        onClick={() => {
                                            if (!isEditing) {
                                                startEditing(
                                                    procedure
                                                );
                                            }
                                        }}
                                    >
                                        {isEditing ? (
                                            <textarea
                                                ref={textareaRef}
                                                autoFocus
                                                rows={1}
                                                value={
                                                    editingText
                                                }
                                                onChange={e =>
                                                    setEditingText(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                onBlur={
                                                    finishEditing
                                                }
                                                onKeyDown={e =>
                                                    handleEditKeyDown(
                                                        e,
                                                        procedure
                                                    )
                                                }
                                            />
                                        ) : (
                                            <span className="procedure-text">
                                                {
                                                    procedure.description
                                                }
                                            </span>
                                        )}
                                    </div>

                                    {/* =================
                                        Actions
                                    ================= */}
                                    <div className="procedure-actions">

                                        {isEditing ? (
                                            /*
                                             * Edit mode:
                                             * Only save button.
                                             */
                                            <button
                                                type="button"
                                                className="procedure-action confirm-action"
                                                disabled={
                                                    !hasChanges ||
                                                    isLoading
                                                }
                                                onMouseDown={e =>
                                                    e.preventDefault()
                                                }
                                                onClick={() =>
                                                    saveExistingProcedure(
                                                        procedure
                                                    )
                                                }
                                                title={
                                                    hasChanges
                                                        ? 'حفظ التعديل'
                                                        : 'لا توجد تعديلات'
                                                }
                                            >
                                                ✓
                                            </button>
                                        ) : (
                                            /*
                                             * Normal mode:
                                             * Document + Delete.
                                             */
                                            <>
                                                <button
                                                    type="button"
                                                    className="procedure-action document-action"
                                                    onClick={onOpenDocument}
                                                    title="فتح المستند"
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2H14l4 4v14.5A1.5 1.5 0 0 1 16.5 22h-9A1.5 1.5 0 0 1 6 20.5z" />

                                                        <path d="M14 2v5h5" />

                                                        <path d="M9 13h6" />

                                                        <path d="M9 17h4" />
                                                    </svg>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="procedure-action delete-action"
                                                    disabled={isLoading}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setPendingDeleteProcedure(
                                                            procedure
                                                        );
                                                    }}
                                                    title="حذف الإجراء"
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M4 7h16" />

                                                        <path d="M10 11v6" />

                                                        <path d="M14 11v6" />

                                                        <path d="M6 7l1 14h10l1-14" />

                                                        <path d="M9 7V4h6v3" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    }
                )}

                </div>
            </div>
        </>
    );
}