import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Componentes/Login/Login';
import Admin from './Componentes/Administrador/Admin';
import Galponero from './Componentes/Galponero/Galponero';
import PrivateRoute from './Rutas/PrivateRoute';
import Perfil from './Componentes/Perfil/Perfil';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Perfil" element={<Perfil />} />
            <Route path="/admin" element={
                <PrivateRoute allowedRoles={[1]}> {/* Cambiar requiredRole a allowedRoles */}
                    <Admin />
                </PrivateRoute>
            } />
            <Route path="/galponero" element={
                <PrivateRoute allowedRoles={[2]}> {/* Cambiar requiredRole a allowedRoles */}
                    <Galponero />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default App;
