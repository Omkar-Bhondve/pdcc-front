import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

export const AuthGuard = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
