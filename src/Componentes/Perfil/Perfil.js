import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Navbar/Navbar';


const Perfil = () => {


    const [userName, setUserName] = useState('');
    const [galpon, setGalpon] = useState('');




    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

   useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.nombre);
         
            setGalpon(decodedToken.galpon);
        ;
        }
    }, []);



    return(
        
        <div>
           <Navbar/>
           
        <h2>{userName}</h2>

        </div>
    )
}
export default Perfil;