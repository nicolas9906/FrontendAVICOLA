import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';
import ProduccionForm from '../Produccion/Produccion';
import ProduccionChart from '../Produccion/ProduccionChart';
import  './Galponero.css'
import Swal from 'sweetalert2';



const Galponero = () => {
    const [userName, setUserName] = useState('');
    const [galpon, setGalpon] = useState('');
    const [produccion, setProduccion] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [idUsuario, setIdUsuario] = useState(null);
    const [activeTab, setActiveTab] = useState('tabla');
    const [saldoAves, setSaldoAves] = useState(0);
    const [reloadData, setReloadData] = useState(0); // Cambia a un número

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
            setIdUsuario(decodedToken.id_usuario);
            setGalpon(decodedToken.galpon_id);
            fetchProduccion(decodedToken.id_usuario);
        }
    }, [reloadData]); // Este efecto se activará cada vez que reloadData cambie
    
    
    const fetchProduccion = async (idUsuario) => {
        try {
            if (!idUsuario) {
                console.error('idUsuario no está definido:', idUsuario);
                setMensaje('ID de usuario no encontrado.');
                return;
            }
    
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token no encontrado');
                setMensaje('Inicia sesión para continuar.');
                return;
            }
    
            const response = await fetch(`http://localhost:4000/produccion/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error en el servidor: ${response.status} - ${errorMessage}`);
            }
    
            const data = await response.json();
            console.log('Datos obtenidos:', data);
    
            setProduccion(data);
    
            if (Array.isArray(data) && data.length > 0) {
                const ultimoRegistro = data[data.length - 1];
                if (ultimoRegistro.galpon && ultimoRegistro.galpon.saldo_aves !== undefined) {
                    setSaldoAves(ultimoRegistro.galpon.saldo_aves);
                } else {
                    console.warn('El saldo_aves no está definido en el último registro');
                    setSaldoAves(0);
                }
            } else {
                console.warn('No se encontraron datos de producción');
                setSaldoAves(0);
            }
        } catch (error) {
            console.error('Error al obtener la producción:', error.message);
            setMensaje('Error al obtener la producción.');
        }
    };
    
  
    const handleReloadData = () => {
        setReloadData(prev => prev + 1); // Incrementa para forzar una recarga
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
                <h2># aves: {saldoAves}</h2>
                <ProduccionForm  fetchProduccion={fetchProduccion}   handleReloadData={handleReloadData}    />
             

                <div className="tab-menu">
                    <button onClick={() => setActiveTab('tabla')}>Producción</button>
                    <button onClick={() => setActiveTab('chart')}>Gráfico</button>
                    <button onClick={() => setActiveTab('consulta')}>Consulta</button>
                </div>

                {activeTab === 'tabla' && (
                    <div>
                        <h2>Producción del Usuario : {userName}</h2>
                        {mensaje && <p>{mensaje}</p>}

                        <table>
                            <thead>
                                <tr>
                                <th>Fecha</th>
                                    <th>Producción de Huevos</th>
                                    <th>% produccion </th>
                                    <th>Cantidad de Bultos</th>
                                    <th>Mortalidad de Gallinas</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {produccion.length > 0 ? (
                                    produccion.map((item, index) => (
                                        <tr key={index} style={{ color: item.color }}>
                                            <td data-label="Fecha">{formatDate(item.fecha)}</td>
                                            <td data-label="Producción de Huevos">{item.produccion_huevos}</td>
                                            <td data-label="Producción de Huevos">{item.porcentaje } %</td>
                                            <td data-label="Cantidad de Bultos">{item.cantidad_bultos}</td>
                                            <td data-label="Mortalidad de Gallinas">{item.mortalidad_gallinas}</td>
                                            
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
                                        <th>Fecha</th>
                                        <th>Producción de Huevos</th>
                                        <th>% produccion </th>
                                        <th>Cantidad de Bultos</th>
                                        <th>Mortalidad de Gallinas</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {produccionFiltrada.map((item, index) => (
                                        <tr key={index}   style={{ color: item.color }}>
                                             <td>{formatDate(item.fecha)}</td>
                                            <td>{item.produccion_huevos}</td>
                                            <td>{item.porcentaje } %</td>
                                            <td>{item.cantidad_bultos}</td>
                                            <td>{item.mortalidad_gallinas}</td>
                                           
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
