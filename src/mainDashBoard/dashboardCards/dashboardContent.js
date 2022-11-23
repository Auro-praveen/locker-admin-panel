import './dashboardContent.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShopLock, faLock , faLockOpen, faChartColumn }   from '@fortawesome/free-solid-svg-icons'
import SideNavbarComp from '../sideNavbar/sideNavbar'
import AvailableLockers from '../../dashboardAvailableLockers/AvailableLockers'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/Auth'
import { useEffect, useState } from 'react'

function DashboardContentComp() {

    const [userPermissions, setUSerPermissions] = useState({
        Outlet:'',
        AvailableLockers:'',
        OccupiedLockers:'',
        Charts:''
    })

    const Auth = useAuth();
    // const navigate = useNavigate();
    // console.log(Auth.user)

    // useEffect(() => {
    //     if (Auth.user) {
    //         alert(Auth.user)
    //     } else {
    //         Auth.logoutHandler();
    //         navigate("/")
    //     }
    // },[])

    const permissions = Auth.userPermissions;
    JSON.parse('"'+permissions+'"')
    console.log(permissions)
    
    useEffect(() => {
        permissions.map(perm => {
            if (perm.includes("Enable")) {
                let permission = perm.split(":");
                setUSerPermissions(arr => ({...arr,
                    [permission[0]]: permission[1]
                }))
            }
        })
    },[])

//   if (userPermissions) {
//     console.log('====================================');
//     console.log(userPermissions);
//     console.log('====================================');
//   }

    return ( 
        <div>
            <div className="dashboard-content-container">
                <SideNavbarComp />
                <div className="dashboard-content">
                    <div className="row row-cols-md-2">
                        <div className="col card-design">
                            <Link to={userPermissions.Outlet==='Enable'? '/transactionDashboard' : '/noaccess'}>
                                <h2 className='card-header'>outlets</h2>
                                <p className='card-content'>Total Number of outlets, that are present in the mall</p>
                                <FontAwesomeIcon icon={faShopLock} size="3x" color='#fff'/>
                            </Link>
                        </div>
                        <div className="col card-design">
                            <Link to={userPermissions.OccupiedLockers==='Enable'? '/occupiedLocks' : '/noaccess'}>
                                <h2 className='card-header'>occupied locks</h2>
                                <p className='card-content'>Total Number of locks occupied by the customers in the mall</p>
                                <FontAwesomeIcon icon={faLock} size="3x" color='#fff'/>
                            </Link>
                        </div>
                        <div className="col card-design">
                            <Link to={userPermissions.AvailableLockers==='Enable'? '/availLocks' : '/noaccess'}>
                                <h2 className='card-header'>available locks</h2>
                                <p className='card-content'>Total Number Of Available-locks for the customers in the mall</p>
                                <FontAwesomeIcon icon={faLockOpen} size="3x" color='#fff'/>
                            </Link>
                        </div>
                        <div className="col card-design">
                  
                            <Link to={userPermissions.Charts==='Enable'? '' : '/noaccess'}>
                                <h2 className='card-header'>charts</h2>
                                <p className='card-content'>view the complete details of locks details fin the graphical representation</p>
                                <FontAwesomeIcon icon={faChartColumn} size="3x" color='#fff'/>
                            </Link>

                        </div>
                    </div>
                </div>
                
            </div>
          
        </div>
        
     );
}

export default DashboardContentComp;