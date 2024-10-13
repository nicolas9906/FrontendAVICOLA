import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';
import ProduccionForm from '../Produccion/Produccion';
import ProduccionChart from '../Produccion/ProduccionChart'; // Asegúrate de importar el nuevo componente

const Galponero = () => {
    const [userName, setUserName] = useState('');
    const [galpon, setGalpon] = useState('');
    const [produccion, setProduccion] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [idUsuario, setIdUsuario] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.nombre);
            setIdUsuario(decodedToken.id);
            setGalpon(decodedToken.galpon);
            fetchProduccion(decodedToken.id_usuario);
        }
    }, []); // Se ejecuta solo una vez al montar el componente

    const fetchProduccion = async (idUsuario) => {
        try {
            const response = await fetch(`http://localhost:4000/produccion/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }

            const data = await response.json();
            setProduccion(data);
            console.log(data);
            
        } catch (error) {
            console.error('Error al obtener la producción:', error);
            setMensaje('Error al obtener la producción.');
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Bienvenido Galponero  {userName}</h1>
            <ProduccionForm />
            <button onClick={handleLogout}>Cerrar Sesión</button>

            <h2>Producción del Usuario ID: {idUsuario}</h2>
            {mensaje && <p>{mensaje}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Producción de Huevos</th>
                        <th>Cantidad de Bultos</th>
                        <th>Mortalidad de Gallinas</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {produccion.length > 0 ? (
                        produccion.map((item, index) => (
                            <tr key={index}>
                                <td>{item.produccion_huevos}</td>
                                <td>{item.cantidad_bultos}</td>
                                <td>{item.mortalidad_gallinas}</td>
                                <td>{item.fecha}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay datos de producción disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {produccion.length > 0 && <ProduccionChart produccion={produccion} />} {/* Renderiza el gráfico si hay datos */}
        </div>
    );
};

export default Galponero;
