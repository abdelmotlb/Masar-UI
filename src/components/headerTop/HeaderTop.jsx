import React, { useState } from 'react'
import './HeaderTop.css'
import { useAuth } from '../Authentication/AuthProvider';
import { LoginAttrs, RoutePaths } from '../../Constants';
import { useNavigate } from 'react-router';

export default function HeaderTop() {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1);
    };

    const handleRefresh = () => {
        window.location.reload();
    };


    return (
        <div className="header-top">
            <div className="header-navigation">
                <button
                    className="header-action-button back-button"
                    onClick={handleBack}
                    title="رجوع"
                    aria-label="رجوع"
                >
                    →
                </button>

                <button
                    className="header-action-button refresh-button"
                    onClick={handleRefresh}
                    title="تحديث"
                    aria-label="تحديث"
                >
                    ↻
                </button>

                <button
                    className="header-action-button home-button"
                    onClick={() => navigate("/")}
                    title="الرئيسية"
                    aria-label="الرئيسية"
                >
                    ⌂
                </button>
            </div>

            <div className="system-title">
                <span className="app-name">مَسار</span>
                <span className="separator">·</span>
                <span className="app-description">نظام متابعة الملفات</span>
            </div>

            <div className="profile-info">
                <div className="profile-name">
                    المستخدم الحالي: {user?.[LoginAttrs.USERNAME]}
                </div>

                <button
                    className="header-action-button logout-button"
                    onClick={() => {
                        logout();
                        navigate(RoutePaths.LOGIN, { replace: true });
                    }}
                    title="تسجيل الخروج"
                    aria-label="تسجيل الخروج"
                >
                    ⇥
                </button>
            </div>
        </div>
    );
}


function getNameInitials(getNameInitials) {
    const userInfo = JSON.parse(localStorage.getItem(LoginAttrs.USERNAME) ?? "{}");
    const fullName = userInfo[LoginAttrs.USERNAME]

    if (!fullName) return "";

    const names = fullName.trim().split(/\s+/);
    return names
        .slice(0, 2)
        .map(name => name[0].toUpperCase())
        .join("");
}