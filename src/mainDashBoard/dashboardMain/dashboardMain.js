import React from 'react';
import './dashboardMain.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

function dashboardMainComp() {
    
    return ( 
        <div>
            <div className="main-container">
                <div className="dashboardMain">
                    <div className="logo-container main-navbar">
                        <a href="#"><h2>auroLocker</h2></a>
                    </div>
                    <ul>
                    <div className="account-container main-navbar">
                            <li>
                                <a href="#"><h5>profile</h5></a>
                            </li>
                            <li>
                                <a href="#"><h5>log-out</h5></a>
                            </li>
                            <li>
                                <a href="#"><FontAwesomeIcon icon={faCog} size='lg'/></a>
                            </li>
                    </div>
                    </ul>
                </div>
                
            </div>
            
        </div>
     );
}

export default dashboardMainComp;