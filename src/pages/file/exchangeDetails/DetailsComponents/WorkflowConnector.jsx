import React from 'react';
import './WorkflowConnector.css';

export default function WorkflowConnector() {
    return (
        <div className="workflow-connector">

            <div className="workflow-line workflow-line-forward">
                <span className="workflow-pulse" />
            </div>

            <div className="workflow-icon">
                ⇋
            </div>

            <div className="workflow-line workflow-line-backward">
                <span className="workflow-pulse" />
            </div>

        </div>
    );
}