import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/Login" />; // Redirigir al login si no hay token
    }

    try {
        const decodedToken = jwt_decode(token);
        const { rol, exp } = decodedToken;

        if (exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Eliminar token expirado
            return <Navigate to="/Login" />; // Redirigir si el token ha expirado
        }

        if (!allowedRoles || allowedRoles.includes(rol)) {
            return children; // Renderizar el componente si el rol es permitido
        } else {
            return <Navigate to="/" />; // Redirigir si el rol no coincide
        }
    } catch (err) {
        localStorage.removeItem('token'); // Eliminar token inválido
        return <Navigate to="/Login" />; // Redirigir si el token es inválido
    }
};

export default PrivateRoute;
