import React from 'react';
import NotFound from '../Assets/PageNotFound.png';
import styles from '../styles/PageNotFound.module.css';
import { useNavigate } from 'react-router-dom';




export default function PageNotFound() {

  const navigate = useNavigate()

  const handleGoHomePage = () => {
    // Redirect to the home page
    navigate('/');
  };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
          
            <div className={styles.notFoundPage}>
                <img src={NotFound} alt="Page not Found Image" />
                <button className={styles.overlayButton} onClick={handleGoHomePage}>Go Home</button>
            </div>

            </div> 
       );
}
