import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';


const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/Login" />; // Redirigir al login si no hay token
    }

    try {
        // Decodificar el token para obtener el rol
        const decodedToken = jwt_decode(token);
        const { rol } = decodedToken;

        if (rol === requiredRole) {
            return children; // Si el rol coincide, renderizar el componente
        } else {
            return <Navigate to="/" />; // Redirigir si el rol no coincide
        }
    } catch (err) {
        return <Navigate to="/" />; // Si el token es inválido, redirigir al login
    }
};

export default PrivateRoute;
