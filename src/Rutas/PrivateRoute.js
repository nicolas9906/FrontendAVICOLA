    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { jwtDecode as jwt_decode } from 'jwt-decode';

    const PrivateRoute = ({ children, allowedRoles }) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return <Navigate to="/Login" />; 
        }

        try {
            const decodedToken = jwt_decode(token);
            const { rol, exp } = decodedToken;

            if (exp * 1000 < Date.now()) {
                localStorage.removeItem('token'); 
                return <Navigate to="/Login" />; 
            }

            if (!allowedRoles || allowedRoles.includes(rol)) {
                return children; 
            } else {
                return <Navigate to="/" />; 
            }
        } catch (err) {
            localStorage.removeItem('token'); 
            return <Navigate to="/Login" />; 
        }
    };

    export default PrivateRoute;
