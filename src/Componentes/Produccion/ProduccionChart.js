import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ProduccionChart = ({ produccion, idGalponUsuario }) => {
    // Filtrar los datos para incluir solo los registros del galpón del usuario logueado
    const produccionFiltrada = produccion.filter(item => item.galpon_id === idGalponUsuario);

    // Crear etiquetas para el eje X combinando fecha y galpón
    const labels = produccionFiltrada.map(item => {
        const fechaFormateada = format(new Date(item.fecha), 'dd/MM/yyyy');
        
        return `${fechaFormateada}`;
    });

    // Datos para el eje Y
    const huevos = produccionFiltrada.map(item => item.produccion_huevos);

    const data = {
        labels: labels,  // Eje X con fecha y galpón
        datasets: [
            {
                label: 'Producción de Huevos',
                data: huevos,  // Eje Y con cantidad de huevos
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Huevos',  // Título para el eje Y
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Fecha G',  // Título para el eje X
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default ProduccionChart;
