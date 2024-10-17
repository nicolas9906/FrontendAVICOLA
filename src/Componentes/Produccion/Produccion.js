import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import './ProduccionForm.css';
import egg from '../../FOTO/egg.jpg';

const ProduccionForm = () => {
    const [produccionHuevos, setProduccionHuevos] = useState('');
    const [cantidadBultos, setCantidadBultos] = useState('');
    const [mortalidadGallinas, setMortalidadGallinas] = useState('');
    const [idUsuario, setIdUsuario] = useState(null);
    const [idGalpon, setIdGalpon] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setIdUsuario(decodedToken.id_usuario);
                setIdGalpon(decodedToken.galpon_id);
            } catch (error) {
                setMensaje('Error al procesar el token.');
            }
        } else {
            setMensaje('Token no encontrado. Por favor inicia sesión nuevamente.');
        }
    }, []);

    // Cerrar el modal al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            produccion_huevos: parseInt(produccionHuevos),
            cantidad_bultos: parseInt(cantidadBultos),
            mortalidad_gallinas: parseInt(mortalidadGallinas),
            id_usuario: idUsuario,
            galpon_id: idGalpon,
        };

        fetch('http://localhost:4000/produccion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            return response.json();
        })
        .then(data => {
            setMensaje('Datos enviados con éxito');
        })
        .catch((error) => {
            setMensaje('Error al enviar los datos: ' + error.message);
        });

        setProduccionHuevos('');
        setCantidadBultos('');
        setMortalidadGallinas('');
    };

    return (
        <div className='modal-content'>
            <button onClick={() => setIsOpen(true)}>Abrir Formulario de Producción</button>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content" ref={modalRef}>
                        <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                        <h2>Formulario de Producción</h2>
                        <div className="modal-body">
                        


                            <form onSubmit={handleSubmit}>
                            <img src={egg} alt="egg" style={{ maxWidth: '150px', height: 'auto', borderRadius: '8px' }} />
                                <div>
                                    <label>Producción de Huevos:</label>
                                    <input 
                                        type="number" 
                                        value={produccionHuevos} 
                                        onChange={(e) => setProduccionHuevos(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Cantidad de Bultos:</label>
                                    <input 
                                        type="number" 
                                        value={cantidadBultos} 
                                        onChange={(e) => setCantidadBultos(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Mortalidad de Gallinas:</label>
                                    <input 
                                        type="number" 
                                        value={mortalidadGallinas} 
                                        onChange={(e) => setMortalidadGallinas(e.target.value)} 
                                        required
                                    />
                                </div>
                                <button type="submit">Enviar</button>
                            </form>
                        </div>
                        {mensaje && <p>{mensaje}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProduccionForm;
