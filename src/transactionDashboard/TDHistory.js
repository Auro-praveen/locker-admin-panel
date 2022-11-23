import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";
import "./TransactionDashboard.css";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PathUrl from '../GlobalVariable/urlPath.json'

function TDHistory(props) {

  const [tdHistory, setTdHistory] = useState({
    slno: "",
    mobileNumber: "",
    amount: "",
    dateOfTransaction: "",
    timeOfTransaction: "",
    remarks: "",
    transactionId: "",
    lockerNumbers:"",
    transactionType: ""
  });
  
  useEffect(() => {
    fetchTransactionDetailHistory()
  }, [])

  // const tdHistoryUrl =  "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionHistory";
  const fetchTransactionDetailHistory = () => {
    console.log("inside history")
    fetch( PathUrl.localServerPath+"FetchTransactionHistory",{
      method:"GET",
      headers:{
        accept:"application/json"
      }
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      if (data.responseCode === "tdhistory") {
        setTdHistory({
          ...tdHistory,
          slno:data.slno,
          mobileNumber:data.MobileNo,
          amount:data.amount,
          dateOfTransaction:data.dateOfTransaction,
          timeOfTransaction:data.timeOfTransaction,
          remarks:data.remarks,
          transactionId:data.transactionId,
          lockerNumbers:data.lockers,
          transactionType:data.transactionType
        })
      }
    })
    .catch(err => {
      console.log("err : "+err)
    })
  }

  if (tdHistory.slno) {
    console.log("---" +tdHistory)
  } else {
    console.log("none")
  }

  return (
    <>
    <div className="tdhistory-container">
        Td history
    </div>
    {
      tdHistory.slno 
      ?
      <LockerCatagoryTable
        tableData={tdHistory}
        tableType={"transactionDetailsHistory"}
      />
      :
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    }

    </>
  );
}

export default TDHistory;
