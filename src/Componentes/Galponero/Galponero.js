import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';
import ProduccionForm from '../Produccion/Produccion';
import ProduccionChart from '../Produccion/ProduccionChart';
import  './Galponero.css'
const Galponero = () => {
    const [userName, setUserName] = useState('');
    const [galpon, setGalpon] = useState('');
    const [produccion, setProduccion] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [idUsuario, setIdUsuario] = useState(null);
    const [activeTab, setActiveTab] = useState('tabla');
    
    
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [produccionFiltrada, setProduccionFiltrada] = useState([]);

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
    }, []);

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
            setProduccionFiltrada(data); 
        } catch (error) {
            console.error('Error al obtener la producción:', error);
            setMensaje('Error al obtener la producción.');
        }
    };
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', options);
    };
    const filtrarProduccion = () => {
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);

        const produccionFiltrada = produccion.filter(item => {
            const fechaItem = new Date(item.fecha);
            return fechaItem >= fechaInicioDate && fechaItem <= fechaFinDate;
        });

        setProduccionFiltrada(produccionFiltrada);
    };

    return (
        <div className='galponero-container'>
            <Navbar />
            <div className='galponero-content'>
                <h1>Bienvenido Galponero {userName}</h1>
                <ProduccionForm />
                <button onClick={handleLogout}>Cerrar Sesión</button>

                <div className="tab-menu">
                    <button onClick={() => setActiveTab('tabla')}>Producción</button>
                    <button onClick={() => setActiveTab('chart')}>Gráfico</button>
                    <button onClick={() => setActiveTab('consulta')}>Consulta</button>
                </div>

                {activeTab === 'tabla' && (
                    <div>
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
                                            <td data-label="Producción de Huevos">{item.produccion_huevos}</td>
                                            <td data-label="Cantidad de Bultos">{item.cantidad_bultos}</td>
                                            <td data-label="Mortalidad de Gallinas">{item.mortalidad_gallinas}</td>
                                            <td data-label="Fecha">{formatDate(item.fecha)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No hay datos de producción disponibles.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'chart' && (
                    <div>
                        <h2>Gráfico de Producción</h2>
                        {produccion.length > 0 && <ProduccionChart produccion={produccion} />}
                    </div>
                )}

                {activeTab === 'consulta' && (
                    <div>
                        <h2>Consulta Personalizada</h2>
                        <label>
                            Fecha Inicio:
                            <input 
                                type="date" 
                                value={fechaInicio} 
                                onChange={(e) => setFechaInicio(e.target.value)} 
                            />
                        </label>
                        <label>
                            Fecha Fin:
                            <input 
                                type="date" 
                                value={fechaFin} 
                                onChange={(e) => setFechaFin(e.target.value)} 
                            />
                        </label>
                        <button onClick={filtrarProduccion}>Filtrar</button>

                        {produccionFiltrada.length > 0 ? (
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
                                    {produccionFiltrada.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.produccion_huevos}</td>
                                            <td>{item.cantidad_bultos}</td>
                                            <td>{item.mortalidad_gallinas}</td>
                                            <td>{formatDate(item.fecha)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay datos de producción para las fechas seleccionadas.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Galponero;
