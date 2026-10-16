import React from 'react';
import { RoutePaths } from '../../Constants';
import { Link, useLocation } from "react-router";
import "./NotFound.css";
import { useAuth } from '../../components/Authentication/AuthProvider';

export default function NotFound() {

    const { getDefaultPageInfo, isLoading } = useAuth();

    const { defaultActionText, defaultActionTo } = getDefaultPageInfo();
    
    const { state, ...all } = useLocation();
    const actionText = state?.actionText ?? defaultActionText;
    const actionTo = state?.actionTo ?? defaultActionTo;


    return (
        <div className="not-found-container">
            <div className="not-found-card">
                <div className="not-found-code">404</div>

                <h1 className="not-found-title">
                    الصفحة غير موجودة
                </h1>

                <p className="not-found-message">
                    عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
                </p>

                <Link to={actionTo} className="not-found-button">
                    {actionText}
                </Link>
            </div>
        </div>
    );
}