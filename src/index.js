// index.js o App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Asegúrate de que la ruta sea correcta
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
