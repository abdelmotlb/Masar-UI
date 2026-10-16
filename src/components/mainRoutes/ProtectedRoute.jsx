import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth, useAuthRef } from "../Authentication/AuthProvider";
import { NotificationType, RoutePaths } from "../../Constants";

export default function ProtectedRoute({ notify }) {
    const isAuthenticatedRef = useAuthRef();

    /* based on the idea of context-trigger-based rendering */
    if (isAuthenticatedRef.current) 
        return <Outlet />;
    else{

        notify({
            type: NotificationType.ERROR,
            message: "لا يمكن الوصول لهذه الصفحة. برجاء تسجيل الدخول وإعادة المحاولة",
        });

        return (
            <Navigate
                to={RoutePaths.LOGIN}
                replace
            />
        );

    }
}