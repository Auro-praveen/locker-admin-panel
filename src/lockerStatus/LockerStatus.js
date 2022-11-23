import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PathUrl from '../GlobalVariable/urlPath.json'

function LockerStatus() {
    const [lockerStatus, setLockerStatus] = useState({
        slno:"",
        lockerNumber:"",
        lockerName:"",
        terminalId:"",
        deviceDate:"",
        deviceTime:"",
        packetType:"",
        rdate:"",
        remarks:"",
        rtime:"",
        status:"",
        userId:""
    })

    useEffect(() => {
        lockerStatusFunction()
    }, [])

    // const lockerStatusUrl = "http://192.168.0.198:8080/AuroAutoLocker/FetchLockerStatus";
    
    const lockerStatusFunction = () => {
        fetch( PathUrl.localServerPath+"FetchLockerStatus",{
            method:"GET",
            headers:{
                accept:"application/json"
            }
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);

            if (data.responseCode === "lockstatus") {
                setLockerStatus({
                    ...lockerStatus,
                    slno:data.slno,
                    lockerNumber:data.lockerNumber,
                    lockerName:data.lockerName,
                    deviceDate: data.deviceDate,
                    deviceTime:data.deviceTime,
                    packetType:data.packetType,
                    remarks:data.remarks,
                    rdate:data.rdate,
                    rtime:data.rtime,
                    status:data.status,
                    terminalId: data.terminalId,
                    userId: data.userId
                })
            }
        })
        .catch(err => {
            console.log("err : "+err)
        })
    }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">
          locker status
        </h2>
      </div>
    { lockerStatus.slno ?
      <LockerCatagoryTable
        tableData={lockerStatus}
        // fetchtableFun={fetchDataToTable}
        tableType={"lockerStatus"}
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
    </div>
  );
}

export default LockerStatus;
