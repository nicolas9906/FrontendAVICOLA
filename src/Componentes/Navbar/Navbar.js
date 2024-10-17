import React, { useEffect, useState } from 'react';
import '../Navbar/Navbar.css';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEgg } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [galpon, setGalpon] = useState('');
    const [rol, setRol] = useState('');

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken); 
            setGalpon(decodedToken.galpon);
            setRol(decodedToken.rol); 
            console.log(rol);
         
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo">
                    <FontAwesomeIcon icon={faEgg} style={{ marginRight: '8px' }} />
                    GALPON # {galpon}
                </div>
                <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {rol === 2 && (
                        <li className="nav-item"><Link to="/galponero">Galponero</Link></li>
                    )}
                    {rol === 1 && (
                        <li className="nav-item"><Link to="/admin">Administrador</Link></li>
                    )}
                    <li className="nav-item"><Link to="/Perfil">Perfil</Link></li>
                    <li className="nav-item"><a href="https://proceal.com/nosotros/">Acerca de</a></li>
                    <li className="nav-item"><Link to="/services">Servicios</Link></li>
                    <li className="nav-item">
                        <button className="btn-logout" onClick={handleLogout} aria-label="Cerrar Sesión">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
