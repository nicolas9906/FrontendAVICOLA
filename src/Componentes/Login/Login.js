import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Importación correcta de jwtDecode
import './Login.css';
import ave from '../../FOTO/ave.jpg';
const Login = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

    
        if (!cedula || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        try {
        
            const response = await axios.post('http://localhost:4000/login', { cedula, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            const { rol } = decodedToken;

            if (rol === 1) { // rol 1 = administrador
                navigate('/admin');
            } else if (rol === 2) { // rol 2 = galponero
                navigate('/galponero');
            } else {
                setError('Rol no autorizado');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Credenciales incorrectas');
            } else {
                setError('Error en la conexión al servidor');
            }
        }
    };

    return (
        <div className='login'>
            <img src={ave} alt="ave"/>
            <h2>AVICOLA</h2>

            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Login;
