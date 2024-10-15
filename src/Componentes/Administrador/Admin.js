import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';
import ProduccionForm from '../Produccion/Produccion';
import ProduccionChart from '../Produccion/ProduccionChart';
import UpdateProduccionModal from '../Administrador/UpdateProduccionModal'; // Importa el nuevo componente
import './Admin.css';

const Admin = () => {
    const [userName, setUserName] = useState('');
    const [galpon, setGalpon] = useState('');
    const [produccion, setProduccion] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [idUsuario, setIdUsuario] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduccion, setSelectedProduccion] = useState(null); // Estado para almacenar la producción seleccionada
    const [activeTab, setActiveTab] = useState('tabla'); // Estado para la pestaña activa

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
            const response = await fetch(`http://localhost:4000/produccion`, {
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

    const handleUpdateClick = (produccionData) => {
        setSelectedProduccion(produccionData); // Establece la producción seleccionada
        setIsModalOpen(true); // Abre el modal
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:4000/produccion/${updatedData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Error en la actualización');
            }

            const data = await response.json();
            console.log('Producción actualizada:', data);
            setMensaje('Producción actualizada con éxito');
            fetchProduccion(idUsuario); // Vuelve a cargar la producción
        } catch (error) {
            console.error('Error al actualizar la producción:', error);
            setMensaje('Error al actualizar la producción: ' + error.message);
        }
    };

    // Cambiar formato de la fecha para que se vea mejor
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', options);
    };

    return (
        <div>
            <Navbar />
            <div className='admin-container'>
                <div className='admin-content'> 
                    <h1>Bienvenido Administrador {userName}</h1>
                    <ProduccionForm />

                    {/* Menú de pestañas */}
                    <div className="tab-menu">
                        <button onClick={() => setActiveTab('tabla')}>Producción</button>
                        <button onClick={() => setActiveTab('chart')}>Gráfico</button>
                        <button onClick={() => setActiveTab('consulta')}>Consulta</button>
                    </div>

                    {/* Contenido de la pestaña activa */}
                    {activeTab === 'tabla' && (
                        <div>
                            <h2>Producción de la avicola MOCHACA</h2>
                            {mensaje && <p>{mensaje}</p>}
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre del Usuario</th>
                                        <th>Número de galpón</th>
                                        <th>Producción de Huevos</th>
                                        <th>Cantidad de Bultos</th>
                                        <th>Mortalidad de Gallinas</th>
                                        <th>Fecha</th>
                                        <th>Actualizar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produccion.length > 0 ? (
                                        produccion.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.usuario.nombre}</td>
                                                <td>{item.galpon.numero}</td>
                                                <td>{item.produccion_huevos}</td>
                                                <td>{item.cantidad_bultos}</td>
                                                <td>{item.mortalidad_gallinas}</td>
                                                <td>{formatDate(item.fecha)}</td>
                                                <td>
                                                    <button onClick={() => handleUpdateClick(item)}>Actualizar</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7">No hay datos de producción disponibles.</td>
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
                          
                        </div>
                    )}

                    <UpdateProduccionModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        produccionData={selectedProduccion || {}} // Asegúrate de que haya datos
                        onUpdate={handleUpdate} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Admin;
