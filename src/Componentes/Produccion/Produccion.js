import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './ProduccionForm.css';
const ProduccionForm = () => {
    const [produccionHuevos, setProduccionHuevos] = useState('');
    const [cantidadBultos, setCantidadBultos] = useState('');
    const [mortalidadGallinas, setMortalidadGallinas] = useState('');
    const [idUsuario, setIdUsuario] = useState(null);
    const [idGalpon, setIdGalpon] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Obtener el token de localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // Decodificar el token
                const decodedToken = jwtDecode(token);
                console.log('Token decodificado:', decodedToken); // Verifica el contenido del token

                // Establecer los valores de id_usuario y id_galpon
                setIdUsuario(decodedToken.id_usuario); // Cambia 'id_usuario' al nombre correcto en tu token
                setIdGalpon(decodedToken.galpon_id);   // Cambia 'id_galpon' al nombre correcto en tu token
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setMensaje('Error al procesar el token.');
            }
        } else {
            setMensaje('Token no encontrado. Por favor inicia sesión nuevamente.');
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Crear el objeto con la información del formulario
        const data = {
            produccion_huevos: parseInt(produccionHuevos),
            cantidad_bultos: parseInt(cantidadBultos),
            mortalidad_gallinas: parseInt(mortalidadGallinas),
            id_usuario: idUsuario, // Usar el id del usuario decodificado
            galpon_id: idGalpon,   // Usar el id del galpón decodificado
        };

        // Depuración: imprimir los datos antes de enviar
        console.log('Datos a enviar:', data);

        // Enviar los datos a tu API
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
            console.log('Success:', data);
            setMensaje('Datos enviados con éxito');
        })
        .catch((error) => {
            console.error('Error:', error);
            setMensaje('Error al enviar los datos: ' + error.message);
        });

        // Limpiar el formulario después de enviar los datos
        setProduccionHuevos('');
        setCantidadBultos('');
        setMortalidadGallinas('');
    };

    return (
        <div>
        <button onClick={() => setIsOpen(true)}>Abrir Formulario de Producción</button>

        {isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                    <h2>Formulario de Producción</h2>
                    <form onSubmit={handleSubmit}>
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
                    {mensaje && <p>{mensaje}</p>}
                </div>
            </div>
        )}
    </div>
);
};

export default ProduccionForm;
