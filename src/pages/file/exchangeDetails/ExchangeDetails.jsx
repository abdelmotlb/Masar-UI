import React, { useState } from 'react'
import './ExchangeDetails.css'
import ActionPanel from './DetailsComponents/ActionPanel'
import IncomingMailCard from './DetailsComponents/IncomingMailCard'
import WorkflowConnector from './DetailsComponents/WorkflowConnector'
import { useNavigate, useOutletContext, useParams } from 'react-router'
import { updateIncomingMailFieldAPI } from '../../../apis/File-api'

export default function ExchangeDetails() {
    const { exchangeId } = useParams();
    const { exchanges, setExchanges } = useOutletContext();
    const navigate = useNavigate();
    const exchange = exchanges.find(
        x => x.id === Number(exchangeId)
    );


    const currentIndex = exchanges.findIndex(
        x => x.id === exchange.id
    );

    // Previous in the list = newer exchange
    const newerExchange =
        currentIndex > 0
            ? exchanges[currentIndex - 1]
            : null;

    // Next in the list = older exchange
    const olderExchange =
        currentIndex < exchanges.length - 1
            ? exchanges[currentIndex + 1]
            : null;


    const syncExchange = (updatedExchange) => {
        setExchanges(prev =>
            prev.map(item =>
                item.id === Number(exchangeId)
                    ? { ...item, ...(updatedExchange ?? {}) }
                    : item
            )
        );
    };

    const updateProceduresInExchange = (nextProcedures) => {
        syncExchange({
            procedures: nextProcedures ?? [],
        });
    };

    const handleProcedureCreated = (createdProcedure) => {
        const nextProcedures = [
            ...(exchange?.procedures ?? []),
            createdProcedure,
        ];

        updateProceduresInExchange(nextProcedures);
    };

    const handleProcedureUpdated = (procedureId, description) => {
        const nextProcedures = (exchange?.procedures ?? []).map(
            procedure =>
                procedure.id === procedureId
                    ? { ...procedure, description }
                    : procedure
        );

        updateProceduresInExchange(nextProcedures);
    };

    const handleProcedureDeleted = (procedureId) => {
        const nextProcedures = (exchange?.procedures ?? []).filter(
            procedure => procedure.id !== procedureId
        );

        updateProceduresInExchange(nextProcedures);
    };

    if (!exchange) {
        return (
            <div className="exchange-not-found" dir="rtl">
                <div className="exchange-not-found-icon">
                    ⇋
                </div>

                <h2>المراسلة غير موجودة</h2>

                <p>
                    تعذر العثور على بيانات المراسلة المطلوبة.
                </p>

                <button
                    className="exchange-back-button"
                    onClick={() => navigate(-1)}
                >
                    ← العودة إلى المراسلات
                </button>
            </div>
        );
    }

    const { procedures, ...incomingMailAttrs } = exchange;

    return (
        <div className="mail-page">

            <div className="exchange-navigation-row exchange-navigation-up">
                <button
                    className="exchange-navigation"
                    disabled={!newerExchange}
                    onClick={() => navigate(`../exchange/${newerExchange.id}`)}
                >
                    <span className="exchange-navigation-arrow">↑</span>
                    <span>المبادلة الأحدث</span>
                </button>
            </div>
            
            <div className="exchange-content">
                <IncomingMailCard
                    incomingMailAttrs={incomingMailAttrs}
                    exchangeId={exchangeId}
                    onIncomingMailUpdated={syncExchange}
                    onUpdateIncomingMailField={updateIncomingMailFieldAPI} // TO BE HANDLED: Implement the actual update logic for the incoming mail field
                />

                <WorkflowConnector />

                <ActionPanel
                    procedures={procedures}
                    onProcedureCreated={handleProcedureCreated}
                    onProcedureUpdated={handleProcedureUpdated}
                    onProcedureDeleted={handleProcedureDeleted}
                />
            </div>

            <div className="exchange-navigation-row exchange-navigation-down">
                <button
                    className="exchange-navigation"
                    disabled={!olderExchange}
                    onClick={() => navigate(`../exchange/${olderExchange.id}`)}
                >
                    <span className="exchange-navigation-arrow">↓</span>
                    <span>المبادلة الأقدم</span>
                </button>
            </div>
        </div>
    )
}
