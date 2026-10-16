import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth, useAuthRef } from "../Authentication/AuthProvider";
import { RoutePaths } from "../../Constants";
import { useEffect } from "react";

export default function PublicRoute() {
    const isAuthenticatedRef = useAuthRef();

    return isAuthenticatedRef.current?
        <Navigate 
            to={RoutePaths.NOTFOUND} 
            state={{
                actionText: "العودة إلى الصفحة الرئيسية",
                actionTo: RoutePaths.HOME,
            }}
            replace />
        : <Outlet />;
}