// UpdateProduccionModal.js
import React, { useState, useEffect } from 'react';
import './UpdateProduccionModal.css'; // Si quieres aplicar estilos personalizados

const UpdateProduccionModal = ({ isOpen, onClose, produccionData, onUpdate }) => {
    // Estados locales para los campos del formulario
    const [produccionHuevos, setProduccionHuevos] = useState('');
    const [cantidadBultos, setCantidadBultos] = useState('');
    const [mortalidadGallinas, setMortalidadGallinas] = useState('');

    // Efecto que se ejecuta cada vez que se abre el modal
    useEffect(() => {
        if (isOpen && produccionData) {
            setProduccionHuevos(produccionData.produccion_huevos);
            setCantidadBultos(produccionData.cantidad_bultos);
            setMortalidadGallinas(produccionData.mortalidad_gallinas);
        }
    }, [isOpen, produccionData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            ...produccionData,
            produccion_huevos: parseInt(produccionHuevos),
            cantidad_bultos: parseInt(cantidadBultos),
            mortalidad_gallinas: parseInt(mortalidadGallinas),
        };
        onUpdate(updatedData); // Llama la función onUpdate con los datos actualizados
        onClose(); // Cierra el modal
    };

    return (
        isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Actualizar Producción</h2>
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
                        <button type="submit">Actualizar</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default UpdateProduccionModal;
