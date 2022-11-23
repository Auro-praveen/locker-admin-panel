import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";
import RingLoader from "react-spinners/ClipLoader";
import "./TerminalStat.css";
import PathUrl from '../../GlobalVariable/urlPath.json'

function TerminalStatus() {
  const [deviceStatus, setDeviceStatus] = useState({
    terminalID: [],
    deviceDate:[],
    deviceTime:[],
    recievedDate:[],
    recievedTime:[],
    // uncomment them if more info is needed and need to change in server

    // siteId: [],
    // siteName: [],
    // noOfLocks: [],
    // area: [],
    // areaCode: [],
    // city: [],
    // state: [],
    // imeiNo: [],
    // MobileNo: [],
    // userName: [],
    status: [],
  });

  useEffect(() => {
    fetchDeviceHealth();
  }, []);

  // const healthPacketUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchDeviceHealth";

  const fetchDeviceHealth = () => {
    const getStatus = {
      packetType: "healthPacket",
    };
    fetch(PathUrl.localServerPath+"FetchDeviceHealth", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(getStatus),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.packetType === "devhlth") {
          setDeviceStatus({
            ...deviceStatus,
            terminalID: data.terminalId,
            deviceDate:data.ddate,
            deviceTime:data.dtime,
            recievedDate:data.rdate,
            recievedTime:data.rtime,
            // siteId: data.siteId,
            // siteName: data.siteName,
            // noOfLocks: data.noOfLocks,
            // area: data.area,
            // areaCode: data.areaCode,
            // city: data.cityName,
            // state: data.state,
            // MobileNo: data.mobileNo,
            // userName: data.userName,
            // imeiNo: data.imeiNo,
            status: data.deviceStatus
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {deviceStatus.terminalID.length ? (
        <>
          <div className="page-header">
            <h2>device health status table</h2>
          </div>
          <LockerCatagoryTable
            tableData={deviceStatus}
            tableType={"deviceHealthStatus"}
          />
        </>
      ) : (
        <div className="pageLoader">
          <RingLoader color="#030908" size={100} speedMultiplier={1} />
        </div>
      )}
    </div>
  );
}

export default TerminalStatus;
