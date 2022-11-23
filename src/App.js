
import LoginMainPage from './loginPage/LoginMainPage';
import { ReactDOM } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import React from 'react';
import './App.css';
import AvailableLockers from './dashboardAvailableLockers/AvailableLockers';
import LockerDashBoardComp from './dashboard/dashboardComp';
import TransactionDashboardCom from './transactionDashboard/TransactionDashboardCom';
import UserCreation from './loginPage/userCreation/UserCreation';
import SiteRegistrationCom from './loginPage/siteRegistration/SiteRegCom';
import LockerLockCatagory from './settingsComponent/LockerCatagory/LockerLockCatagory';
import DashboardContentComp from './mainDashBoard/dashboardCards/dashboardContent';
import { AuthProvider } from './utils/Auth';
import RequireAuth from './utils/RequireAuth';
import { NoAccess } from './noAccessWindow/NoAccess';
import {UserLogDetails} from './utils/UserLogDetails';
import TerminalStatus from './loginPage/terminalStatus/TerminalStatus';
import LockerStatus from './lockerStatus/LockerStatus';
import ReleaseLock from './lockerOperations/releaseLock/ReleaseLock';
import LockerOperations from './lockerOperations/LockerOperations';
import AmountRefund from './transactionDashboard/amountRefund/AmountRefund';

function App() {
  return (
    //in app component wrap the entire component tree with AuthProvider
    <div className='app'>
    <UserLogDetails>
      <AuthProvider>
        {/* <LoginMainPage /> */}
        <BrowserRouter>
          <Routes>
            <Route path='login' element={ <LoginMainPage />}></Route>
            <Route path='/' element={  <RequireAuth><DashboardContentComp /></RequireAuth> } /> {/* no entry without authentication or the user name */}
            <Route path='availLocks' element={ <AvailableLockers /> } />
            <Route path='occupiedLocks' element={ <LockerDashBoardComp /> } />
            <Route path='transactionDashboard' element={ <TransactionDashboardCom />} />
            <Route path='userCreation' element={ <UserCreation />} />
            <Route path='siteRegistraion' element= { <SiteRegistrationCom />} />
            <Route path='lockerCatagory' element= { <LockerLockCatagory />}></Route>
            <Route path='noaccess' element={<NoAccess />} ></Route>
            <Route path='deviceStatus' element={<TerminalStatus />} ></Route>
            <Route path='lockStatus' element={<LockerStatus />} ></Route>
            <Route path='lockerOperations' element={<LockerOperations />} />
            <Route path='amountRefund' element={<AmountRefund />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </UserLogDetails>
    </div>
  );
}

export default App;
