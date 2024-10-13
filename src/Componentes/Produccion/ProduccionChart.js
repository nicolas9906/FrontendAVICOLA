// ProduccionChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
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

// Registra las escalas y otros componentes necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ProduccionChart = ({ produccion }) => {
    const dates = produccion.map(item => item.fecha);
    const huevos = produccion.map(item => item.produccion_huevos);
    const bultos = produccion.map(item => item.cantidad_bultos);
    const mortalidad = produccion.map(item => item.mortalidad_gallinas);

    // Configura los datos para el gráfico
    const data = {
        labels: dates, // Usar fechas como etiquetas
        datasets: [
            {
                label: 'Producción de Huevos',
                data: huevos,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
          
        ],
    };
    const data2 = {
        labels: dates, // Usar fechas como etiquetas
        datasets: [
            {
                label: 'Cantidad de Bultos',
                data: bultos,
                fill: false,
                backgroundColor: 'rgba(255,206,86,0.4)',
                borderColor: 'rgba(255,206,86,1)',
            },
          
        ],
    };

    // Opciones del gráfico
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default ProduccionChart;
