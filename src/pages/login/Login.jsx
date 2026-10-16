import React, { useEffect } from 'react';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from "react-router";
import { useNotification } from './../../components/notifier/NotificationProvider'
import { useLoadingSpinner } from '../../components/loader/LoadingSpinnerProvider';
import { NotificationType, RoutePaths } from '../../Constants';
import { loginAPI } from '../../apis/login-api';
import { useAuth } from '../../components/Authentication/AuthProvider';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const notify = useNotification();
    const loader = useLoadingSpinner();
    const { login } = useAuth();

    const errorHandlers = {
        400: handleBadRequest,
        401: handleUnauthorized
    };

    async function handleLoginSuccess(response) {
        login(response.token)
        notify({
            type: NotificationType.SUCCESS,
            message: "مرحبا بك. نتمنى لكم يوم عمل سعيد",
        });
        navigate(RoutePaths.HOME, { replace: true });
    }

    async function handleBadRequest(response) {
        notify({
            type: NotificationType.ERROR,
            message: "خادمنا لا يفهم المدخلات المعطاه. برجاء إعادة المحاولة ",
        });
    }

    async function handleUnauthorized(response) {
        notify({
            type: NotificationType.ERROR,
            message: "إسم المستخدم أو كلمة السر غير صحيحة. برجاء إعادة المحاولة",
        });
    }

    async function handleUnknownError(response) {
        notify({
            type: NotificationType.ERROR,
            message: "حدث خطأ عير معروف. برجاء التواصل مع الدعم",
        });

    }

    async function onLoginPress() {
        try {
            loader.show("جارٍ تسجيل الدخول...");

            const response = await loginAPI(username, password);
            loader.hide();
            if (response.ok) {
                const responseObj = await response.json()
                console.log(responseObj);

                await handleLoginSuccess(responseObj);
            } else {
                const handler = errorHandlers[response.status] ?? handleUnknownError;
                await handler(response);
            }

        } catch (error) {
            console.error(error.message) // TO BE IMPLEMENTED: SAVE THE FULL ERROR IN ERROR LOGS FILE.

            const logsPath = import.meta.env.VITE_ERROR_LOGS_PATH;
            // create a file and 
            loader.hide();

            notify({
                type: NotificationType.ERROR,
                message:
                    `حدث مشكلة غير متوقعة. ربما لا يعمل الخادم حاليا. برجاء التواصل مع الدعم`
            });
        }
    }


    return (
        <div className="page-container">
            <div className="project-ribbon" aria-label="مَسار - نظام متابعة الملفات">
                <div className="project-ribbon-content" dir="rtl">
                    <span className="project-ribbon-name">مَسار</span>
                    <span className="project-ribbon-description">
                        نظام متابعة الملفات والمراسلات
                    </span>
                </div>
            </div>
            <button
                type="button"
                className="about-icon"
                aria-label="عن النظام"
                title="عن النظام"
                onClick={() => navigate(RoutePaths.ABOUT)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 7.5c-1.7-1.4-4.1-2-7-2v12c2.9 0 5.3.6 7 2 1.7-1.4 4.1-2 7-2v-12c-2.9 0-5.3.6-7 2Z" />
                    <path d="M12 7.5v12" />
                </svg>
            </button>
            <div className="login-container">
                <div className="login-image"></div>

                <form className="login-form" dir="rtl" onSubmit={(e) => {
                    e.preventDefault();
                    onLoginPress();
                }}>
                    <h2>تسجيل الدخول</h2>

                    <div className="form-group">
                        <label>إسم المستخدم</label>
                        <div className="login-input-wrapper">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => (setUsername(e.target.value), console.log(e.target.value))}
                            />
                            <svg className="login-input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20Z" />
                            </svg>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>كلمة المرور</label>
                        <div className="login-input-wrapper">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => (setPassword(e.target.value), console.log(e.target.value))}
                            />
                            <svg className="login-input-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <rect x="6" y="10" width="12" height="10" rx="2" />
                                <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
                                <path d="M12 14v2" />
                            </svg>
                        </div>
                    </div>

                    <button type="submit" className="login-button">تسجيل الدخول</button>
                </form>
            </div>
        </div>
    );
}
