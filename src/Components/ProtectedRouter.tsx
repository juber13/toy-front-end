import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { SIGNIN } from "../utils/routes";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = Cookies.get('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to={SIGNIN} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
