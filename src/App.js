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
                <PrivateRoute requiredRole={1}>
                    <Admin />
                </PrivateRoute>
            } />
            <Route path="/galponero" element={
                <PrivateRoute requiredRole={2}>
                    <Galponero />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default App;
