import React, { useEffect, useState } from "react";
import "./NewExchangePopup.css";

export default function NewExchangePopup({
    isOpen,
    onClose,
    onCreate
}) {
    const [incomingMailInSerialNumber, setIncomingMailInSerialNumber] = useState("");
    const [incomingMailInSerialNumberDate, setIncomingMailInSerialNumberDate] = useState("");

    const [incomingMailOutSerialNumber, setIncomingMailOutSerialNumber] = useState("");
    const [incomingMailOutSerialNumberDate, setIncomingMailOutSerialNumberDate] = useState("");

    const [incomingMailAuthority, setIncomingMailAuthority] = useState("");
    const [specialist, setSpecialist] = useState("");

    // Reset the form when opened
    useEffect(() => {
        if (isOpen) {
            setIncomingMailInSerialNumber("");
            setIncomingMailInSerialNumberDate("");

            setIncomingMailOutSerialNumber("");
            setIncomingMailOutSerialNumberDate("");

            setIncomingMailAuthority("");
            setSpecialist("");
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    async function handleCreate() {
        const newExchangeObj = {
            InSerialNumberOfIncomingMail: incomingMailInSerialNumber,
            InSerialNumberDateOfIncomingMail: incomingMailInSerialNumberDate,

            OutSerialNumberOfIncomingMail: incomingMailOutSerialNumber,
            OutSerialNumberDateOfIncomingMail: incomingMailOutSerialNumberDate,

            IncomingMailAuthority: incomingMailAuthority,
            Specialist: specialist
        };

        await onCreate(newExchangeObj);
    }

    return (
        <div className="modal-overlay">

            <div className="create-file-modal" dir="rtl">

                {/* Header */}
                <div className="modal-header">

                    <h2>إنشاء وارد جديد</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">

                    {/* Incoming Mail */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>رقم القيودات</label>

                            <input
                                type="number"
                                value={incomingMailInSerialNumber}
                                onChange={(e) =>
                                    setIncomingMailInSerialNumber(e.target.value)
                                }
                                placeholder="رقم القيودات..."
                            />
                        </div>

                        <div className="form-group">
                            <label>تاريخ القيودات</label>

                            <input
                                type="date"
                                value={incomingMailInSerialNumberDate}
                                onChange={(e) =>
                                    setIncomingMailInSerialNumberDate(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    {/* Outgoing Mail */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>رقم الورود</label>

                            <input
                                type="number"
                                value={incomingMailOutSerialNumber}
                                onChange={(e) =>
                                    setIncomingMailOutSerialNumber(e.target.value)
                                }
                                placeholder="رقم الورود..."
                            />
                        </div>

                        <div className="form-group">
                            <label>تاريخ الورود</label>

                            <input
                                type="date"
                                value={incomingMailOutSerialNumberDate}
                                onChange={(e) =>
                                    setIncomingMailOutSerialNumberDate(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    {/* Incoming Mail Authority */}
                    <div className="form-group">

                        <label>جهة الوارد</label>

                        <input
                            type="text"
                            value={incomingMailAuthority}
                            onChange={(e) =>
                                setIncomingMailAuthority(e.target.value)
                            }
                            placeholder="جهة الوارد..."
                        />

                    </div>

                    {/* Specialist */}
                    <div className="form-group">

                        <label>المختص</label>

                        <input
                            type="text"
                            value={specialist}
                            onChange={(e) =>
                                setSpecialist(e.target.value)
                            }
                            placeholder="المختص..."
                        />

                    </div>

                </div>

                {/* Footer */}
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
