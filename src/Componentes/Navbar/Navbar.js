// Navbar.js
import React, { useEffect, useState } from 'react';
import '../Navbar/Navbar.css'; // Asegúrate de crear este archivo CSS
import { jwtDecode } from 'jwt-decode';
import Button from 'react-bootstrap/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [galpon, setGalpon] = useState('');

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setGalpon(decodedToken.galpon);
        }
    }, []); // Se ejecuta solo una vez al montar el componente

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">GALPON # {galpon}</div>
                <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className="bar"></span>
                    <span className="bar"></span>   
                    <span className="bar"></span>
                </div>
                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    <li className="nav-item"><a href="/">Inicio</a></li>
                    <li className="nav-item"><a href="https://proceal.com/nosotros/">Acerca de</a></li>
                    <li className="nav-item"><a href="/services">Servicios</a></li>
                    <li className="nav-item">
                        <Button variant="danger" onClick={handleLogout}>Cerrar Sesión</Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
