import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importación correcta de jwtDecode

const Login = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Llamada al backend para autenticación
            const response = await axios.post('http://localhost:4000/login', { cedula, password });

            // Si la autenticación es exitosa, obtenemos el token
            const token = response.data.token;

            // Guardar el token en el localStorage o sessionStorage
            localStorage.setItem('token', token);

            // Decodificar el token para obtener el rol del usuario
            const decodedToken = jwtDecode(token);
            const { rol } = decodedToken;

            // Redirigir según el rol
            if (rol === 1) { // rol 1 = administrador
                navigate('/admin');
            } else if (rol === 2) { // rol 2 = galponero
                navigate('/galponero');
            } else {
                setError('Rol no autorizado');
            }
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
