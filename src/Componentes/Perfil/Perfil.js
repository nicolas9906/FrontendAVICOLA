import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import Navbar from '../Navbar/Navbar';
import './Perfil.css'; 

const Perfil = () => {
    const [userName, setUserName] = useState('');
    const [galpon, setGalpon] = useState('');
    const [cedula, setCedula] = useState('');
    const [edad, setEdad] = useState('');
    const [imagen, setImagen] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.nombre);
            setEdad(decodedToken.edad);
            setCedula(decodedToken.cedula);
            setGalpon(decodedToken.galpon_id);
            
        
            // let imagenBase64 = decodedToken.imagen;
            // if (typeof imagenBase64 === 'string' && imagenBase64.trim() !== '') {
            //     // Verifica si la imagen ya tiene un prefijo
            //     if (!imagenBase64.startsWith('data:image')) {
            //         // Agrega el prefijo adecuado (por ejemplo, JPEG)
            //         imagenBase64 = `data:image/jpeg;base64,${imagenBase64}`;
            //     }
            //     setImagen(imagenBase64);
            // }
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="perfil-container">
                <h2>Perfil de Usuario</h2>
                <div className="perfil-card">
                    <h3>Información del Usuario</h3>
                 
                    <p><strong>Nombre:</strong> {userName}</p>
                    <p><strong>Cédula:</strong> {cedula}</p>
                    <p><strong>Edad:</strong> {edad}</p>
                    <p><strong>Galpón:</strong> {galpon}</p>
                </div>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    );
};

export default Perfil;
