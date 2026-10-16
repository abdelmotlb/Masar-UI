import { useState, useEffect, createContext, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { LoginAttrs, RoutePaths } from "../../Constants";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const AuthRefContext = createContext(null);

/**
 * There is two starting states:
 * 1. by starting login from scratch
 * 2. continue the session already opened!!   
 */

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const isAuthenticatedRef = useRef(!!localStorage.getItem(LoginAttrs.USERNAME));


    // on the mount of the auth provider
    useEffect(() => {
        // Check if a token exists
        const token = localStorage.getItem(LoginAttrs.TOKEN);

        if (!!token) {
            // check if the token still not expired and then route based on that
            // let decodedToken = jwtDecode(token); // TO BE UPDATED
            let isSessionStillRunning = true; // checkIfSessionIsNotExpired(decodedToken);
            if (isSessionStillRunning) {
                const storedUser = localStorage.getItem(LoginAttrs.USERNAME);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } else {
                // TO BE HANDLED: ERROR PAGE INDICATING SESSION ENDED 
                logout();
                window.location.reload();
            }
        }
    }, []);

    useEffect (() => {
        setIsLoading(false)
        console.log(user)
    }, [user])

    // LOGIN SETUP
    const login = ( JWToken ) => {
        setIsLoading(true)
        // save the token in local storage 
        localStorage.setItem(LoginAttrs.TOKEN, JWToken);

        // save essential information about the user in local storage
        let decodedToken = jwtDecode(JWToken);                 
        let userInfo = extractUserInfoFromToken(decodedToken);     // implement
        localStorage.setItem(LoginAttrs.USERNAME, JSON.stringify(userInfo));
        setUser(userInfo);
        isAuthenticatedRef.current = true
    };

    const logout = () => {
        setIsLoading(true)
        // setup the context
        localStorage.removeItem(LoginAttrs.TOKEN);
        localStorage.removeItem(LoginAttrs.USERNAME);
        setUser(null);
        isAuthenticatedRef.current = false
    };

    const getDefaultPageInfo = () => {
        if (!!user) {
            return {
                defaultActionText: "العودة إلى الصفحة الرئيسية",
                defaultActionTo: RoutePaths.HOME,
            }
        } else {
            return {
                defaultActionText: "العودة لتسجيل الدخول",
                defaultActionTo: RoutePaths.LOGIN,
            }
        }
    }

    const value = {
        user,
        isLoading,
        login,
        logout,
        getDefaultPageInfo
    };

    return (
        <AuthContext.Provider value={value}>
            <AuthRefContext.Provider value={isAuthenticatedRef}>
                {children}
            </AuthRefContext.Provider>
        </AuthContext.Provider>
    );
}

export function useAuthRef() {
    const context = useContext(AuthRefContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

export default AuthProvider;


function checkIfSessionIsNotExpired(decodedToken) {
    if (!decodedToken.exp) {
        return false;
    }

    return decodedToken.exp * 1000 > Date.now();
}

function extractUserInfoFromToken(decodedToken) {
    if (!decodedToken.email) return {}

    return {
        [LoginAttrs.USERNAME]: decodedToken.email
    };
}