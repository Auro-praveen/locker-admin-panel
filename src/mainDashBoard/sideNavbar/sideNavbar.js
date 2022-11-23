import './sideNavbar.css'
import DashboardMainComp from '../dashboardMain/dashboardMain';
import '../dashboardMain/dashboardMain.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/Auth';
import {IoMdCloseCircle} from 'react-icons/io';
import {BsExclamationTriangle} from 'react-icons/bs'
import {GiConfirmed} from 'react-icons/gi'
import PathUrl from '../../GlobalVariable/urlPath.json'

function SideNavbarComp() {

    const Auth = useAuth();
    const navigate = useNavigate();
    
    const [hideWindow, setHideWindow] = useState("hide-window")
    const [changePass, setChangePass] = useState({
        userName:Auth.user,
        currentPwd:'',
        newPwd:'',
        confirmPwd:''
    })

    

    let changeDisplayStatus = () => {
        let sideNavId = document.getElementById("rightNavbarId");
        const mediaWidth = window.matchMedia("(min-width: 600px)")
        
        if (mediaWidth.matches) {
            console.log(mediaWidth.matches)
            if (sideNavId.style.marginLeft === '81%' ) {
                // sideNavId.style.display = 'none'
                sideNavId.style.marginLeft = '110%';
            } else {
                // sideNavId.style.display = 'block';
                sideNavId.style.marginLeft = '81%';
            } 
        } else {
            if (sideNavId.style.marginLeft === '60%' ) {
                // sideNavId.style.display = 'none'
                sideNavId.style.marginLeft = '140%';
            } else {
                // sideNavId.style.display = 'block';
                sideNavId.style.marginLeft = '60%';
            } 
        }

   
    }

    const logout =() => {
        Auth.logoutHandler();
        navigate("/")
    }
   
    const hideWindowFunction = () => {
        const windId = document.getElementById("change-pass-window-id");
            setHideWindow("hide-window")
            windId.style.marginLeft='132%'
        
    }

    const openPassWindow = () => {
        const windId = document.getElementById("change-pass-window-id");
        setHideWindow("display-window")
        windId.style.marginLeft='32%'
        // windId.style.display='block'
    }

    const changeUserPasswordForm = (e) => {
        e.preventDefault()
        // const baseUrl = "http://192.168.0.198:8080/AuroAutoLocker/UpdateUserPassword";

        console.log(changePass)
        if(changePass.newPwd !== changePass.confirmPwd) {
            alert("password doesnt match")
        } else {
            fetch(PathUrl.localServerPath+"UpdateUserPassword", {
                method:'POST', 
                headers:{
                    Accept:'application/json'
                },
                body:JSON.stringify(changePass)
            }) 
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    alert("Changed successfully")
                } else {
                    e.preventDefault();
                }
            }

            )
            .catch(err => console.log("err : "+err))
        }

    }

    const formEventHandler = (e) => {
        e.preventDefault();
        const name = e.target.name;

        setChangePass({
            ...changePass, [name]: e.target.value
        })
    }


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
                                <a><h5 className='mainNavbar-header'> {changePass.userName} </h5></a>
                            </li>
                            <li>
                                <a onClick={() => logout()}><h5 className='mainNavbar-header'>logOut</h5></a>
                            </li>
                            <li>
                                <a className='icon-ancor'><FontAwesomeIcon onClick={() => changeDisplayStatus()} icon={faCog} size='lg'/></a>
                            </li>
                    </div>
                    </ul>
                </div>
                
            </div>
            
            <div className="side-navbar-container">
                <div className="right-navbar" id='rightNavbarId'>
                    <ul>
                        <div className="right-navbar-content">
                            <li>
                                <Link to='/userCreation'>
                                  <a href="#">create user</a>
                                </Link>
                            </li>
                            <li> 
                                <Link to='/siteRegistraion'>
                                    <a href="#">Site-Registration</a>
                                </Link>
                            </li>
                            <li>
                                <Link to='/lockerCatagory'>
                                    <a href="#">Locks-Catagory</a>
                                </Link>
                            </li>

                            <li>
                                <Link to='/deviceStatus'>
                                    <a href="#">Device Status</a>
                                </Link>
                            </li>

                            <li>
                                <Link to='/lockStatus'>
                                    <a href="#">Lockers Status</a>
                                </Link>
                            </li>

                            <li>
                                <Link to='/amountRefund'>
                                    <a href="#">Refund</a>
                                </Link>
                            </li>

                            <li>
                                <Link to='/lockerOperations'>
                                    <a href="#">locker Operations</a>
                                </Link>
                            </li>

                            <li><a onClick={() => openPassWindow()} href="#">Change Password</a></li>
                            <li><a href="#">{changePass.userName}</a></li>
                        </div>
                    </ul>
                </div>
            </div>
            <div className={hideWindow}></div>

            <div className='change-pass-window' id='change-pass-window-id'>
            <h1 className='changepass-wind-header'>Change password</h1>
            <IoMdCloseCircle onClick={() => hideWindowFunction()} className='close-changepass-wind' size={30} />
                <form onSubmit={ (e) => changeUserPasswordForm(e) }>
                    <table>
                        <tr>
                            <td>
                                <label htmlFor="userName" className='change-pass-label'>user Name :</label>
                            </td>
                            <td>
                                <input type="text" name='userName' className='form-intput change-pass-input' value={changePass.userName} readOnly />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="currentPwd" className='change-pass-label'>current password:</label>
                            </td>
                            <td>
                                <input onChange={(e) => {formEventHandler(e)}} type="password" name='currentPwd' value={changePass.currentPwd} className='form-intput change-pass-input'  required />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="newPwd" className='change-pass-label'>Enter new password:</label>
                            </td>
                            <td>
                                <input onChange={(e) => {formEventHandler(e)}} type="password" name='newPwd' value={changePass.newPwd} className='form-intput change-pass-input'  required />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="confirmPwd" className='change-pass-label'>confirm password:</label>
                            </td>
                            <td>
                                <input onChange={(e) => {formEventHandler(e)}} type="password" className='form-intput change-pass-input' value={changePass.confirmPwd} name='confirmPwd'  required /> 
                                { changePass.confirmPwd ===''?
                                <BsExclamationTriangle className='invalid-icon' size={20} />  :
                                    <>
                                { changePass.newPwd === changePass.confirmPwd ?
                                    <GiConfirmed className='valid-icon' size={20} /> :
                                    <BsExclamationTriangle className='invalid-icon' size={20} /> 
                                }
                                    </>
                                }
                            </td>
                        </tr>
                    </table>
                    <input type="submit" className='btn submit-btn' value={"Submit"} />
                </form>
            </div>
        </div>
        
     );

}

export default SideNavbarComp;