import React, { useEffect, useState } from 'react';
import '../Navbar/Navbar.css'; // Asegúrate de crear este archivo CSS
import { jwtDecode } from 'jwt-decode';

import { Link } from 'react-router-dom';

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
                    <li className="nav-item"><Link to="/Perfil">Perfil</Link></li>
                    <li className="nav-item"><a href="https://proceal.com/nosotros/">Acerca de</a></li>
                    <li className="nav-item"><Link to="/services">Servicios</Link></li>
                    <li className="nav-item">
                        <button className="btn-logout"  onClick={handleLogout}>Cerrar Sesión</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
