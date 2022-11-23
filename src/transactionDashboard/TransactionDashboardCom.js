import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "./TransactionDashboard.css";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import TDHistory from "./TDHistory";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { FormHelperText } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import PathUrl from '../GlobalVariable/urlPath.json'

import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import UncondOpenLock from "./unconditionalOpenLock/UncondOpenLock";

import ChangeMobileNo from "./changeMobileNo/ChangeMobileNo";
import urlPath from "../GlobalVariable/urlPath.json";

function TransactionDashboardCom() {
  // for the test
  const [anchorEl, setAnchorEl] = useState(null);
  const [manualOVerrideItems, setManualOverrideITems] = useState({
    MobileNo: "",
    terminalID: "",
    // lockNo:""
  });

  const open = Boolean(anchorEl);
  const openOptions = (mobileNo, terminalId, lockNo, event) => {
    setAnchorEl(event.currentTarget);
    setManualOverrideITems({
      ...manualOVerrideItems,
      MobileNo: mobileNo,
      terminalID: terminalId,
    });

    setLockNo(lockNo);
  };

  // testing above

  const [changeNummberWindVisible, setChangeNumberWindVisible] =
    useState(false);
  const [uncondLockOpenVisibility, setUncondLockOpenVisibility] =
    useState(false);

  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [visibleWindow, setVisibleWindow] = useState("hide-window");
  const [dataStatus, setDataStatus] = useState(true);
  const [btnText, setBtnText] = useState("Td History");

  const [custData, setCustData] = useState({
    slno: "",
    terminalId: "",
    custemerName: "",
    mobileNumber: "",
    amount: "",
    dateOfOpen: "",
    timeOfOpen: "",
    status: "",
    noOfHours: "",
    transactionId: "",
    lockNo: "",
  });

  const [manualOverrideDet, setManaulOverrideDet] = useState({
    PacketType: "manovrlocopen",
    MobileNo: "",
    terminalID: "",
    reason: "",
    remarks: "",
    LOCKNO: "",
    ReqType: "",
    TransType: "Internet",
  });

  const [lockNo, setLockNo] = useState();

  const [iconView, setIconView] = useState(true);
  const [iconViewDisable, setIconViewDisable] = useState(true);
  const [tableViewDisable, setTableViewDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let selectedCity = (e) => {
    setCity(e.target.value);
  };

  let selectedArea = (e) => {
    setArea(e.target.value);

    // if (e.target.value !== null && city !== null) {
    //   let lockerDiv = document.getElementById("lockerContainerId");
    //   lockerDiv.style.display = "block";
    // }
  };

  function displayLockers(e) {
    selectedArea(e);
    if (city !== null && area !== null) {
      let lockerDiv = document.getElementById("lockerContainerId");
      lockerDiv.style.display = "block";
    }
  }

  useEffect(() => {
    fetchCustemerDetails();
    // fetchTransactionDetailHistory()
  }, []);

  // const userDataUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  const fetchCustemerDetails = () => {
    console.log("inside function again");
    fetch(urlPath.localServerPath+"FetchTransactionDetails", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCustData({
          ...custData,
          slno: data.slno,
          transactionId: data.transactionId,
          custemerName: data.custName,
          mobileNumber: data.mobileNum,
          terminalId: data.terminalId,
          status: data.status,
          amount: data.amount,
          dateOfOpen: data.dateOfOpen,
          noOfHours: data.noOfHours,
          timeOfOpen: data.timeOfOpen,
          lockNo: data.lockNo,
        });
      })
      .catch((err) => console.log("err : " + err));
  };

  // to get the lock numbers associated with the phone numbers
  // const getLockNumbers = (val) => {
  //   const data = {
  //     PacketType: "getLockerNumber",
  //     mobileNo: val,
  //   };
  //   fetch(userDataUrl, {
  //     method: "POST",
  //     headers: {
  //       Accept: "Application/json",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status === "success") {
  //         setLockNo(data.lockNo);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const reasons = ["Internet Down", "Online Payment Down", "Other"];

  let cityNames = [
    "Bengaluru",
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Kochi",
  ];
  let areaNames = ["Rajajinagar", "Yalahanka", "Malleshwaram", "Banashankari"];

  const toggleCustDetailView = (viewType) => {
    if (viewType === "iconView") {
      setIconView(true);
      setIconViewDisable(true);
      setTableViewDisable(false);
    } else {
      setIconView(false);
      setIconViewDisable(false);
      setTableViewDisable(true);
    }
  };

  const manualOverrideWindId = document.getElementById(
    "manual-override-window_id"
  );
  const manualOverride = () => {
    // getLockNumbers(manualOVerrideItems.MobileNo);
    setManaulOverrideDet({
      ...manualOverrideDet,
      MobileNo: manualOVerrideItems.MobileNo,
      terminalID: manualOVerrideItems.terminalID,
    });
    manualOverrideWindId.style.display = "block";
    setVisibleWindow("display-window");
    setAnchorEl(null);
  };

  const hideWindowFunction = () => {
    manualOverrideWindId.style.display = "none";
    setVisibleWindow("hide-window");
    setManaulOverrideDet({
      ...manualOverrideDet,
      LOCKNO: "",
      reason: "",
      remarks: "",
      ReqType: "",
    });
    setLockNo([]);
  };

  const eventHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;
    setManaulOverrideDet({
      ...manualOverrideDet,
      [name]: e.target.value,
    });
  };

  const submitManualOverride = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (manualOverrideDet.LOCKNO !== "") {
      console.log(manualOverrideDet)
      const manDetailsToServer = { ...manualOverrideDet };
      delete manDetailsToServer.reason;
      delete manDetailsToServer.remarks;
      console.log(manDetailsToServer);

      fetch(urlPath.serverUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(manDetailsToServer),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "REQAC-200") {
            console.log("success");
            storeManualOverrideInDB();
            hideWindowFunction();
            setIsLoading(false);
          } else if (data.resposeCode === "STLFAIL") {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log("error :" + err);
          setIsLoading(false);
        });
    } else {
      console.log("Locker No is required");
    }
  };

  // to store the manual
  const storeManualOverrideInDB = () => {
    fetch(PathUrl.localServerPath+"FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(manualOverrideDet),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setManaulOverrideDet({
            ...manualOverrideDet,
            terminalID: "",
            reason: "",
            remarks: "",
            ReqType: "",
          });
          setLockNo([]);
          // to fetch the transaction details data after manually overriding
          fetchCustemerDetails();
          alert("manual override successfull");
        } else {
          alert("something went wrong");
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        setIsLoading(false);
      });
  };

  const changeView = () => {
    if (dataStatus) {
      setDataStatus(false);
      setBtnText("TD Active");
      setIconViewDisable(true);
      setTableViewDisable(true);
    } else {
      setDataStatus(true);
      setBtnText("TD History");
      setIconViewDisable(true);
      setTableViewDisable(false);
    }
  };

  const checkBoxHandler = (e) => {
    console.log(e.target.checked);
    let val = e.target.value;
    if (e.target.checked) {
      setManaulOverrideDet({
        ...manualOverrideDet,
        LOCKNO: val,
      });
    }

    // uncomment and use it if you gonna let user to select more than 1 lock
    // if (e.target.checked) {
    //   const previusVal = [...manualOverrideDet.LOCKNO, val];
    //   setManaulOverrideDet({
    //     ...manualOverrideDet,
    //     LOCKNO: previusVal,
    //   });

    //   console.log(previusVal);
    // } else {
    //   const previusVal = [...manualOverrideDet.LOCKNO];
    //   const index = previusVal.indexOf(val);
    //   if (index > -1) {
    //     previusVal.splice(index, 1);
    //     setManaulOverrideDet({
    //       ...manualOverrideDet,
    //       LOCKNO: previusVal,
    //     });
    //     console.log(previusVal);
    //   }
    // }
  };

  const changeNumberVisibility = () => {
    // const changeNumId = document.getElementById("change-mobile-wind-id");
    setChangeNumberWindVisible(!changeNummberWindVisible);
    setVisibleWindow("display-window");
    setAnchorEl(null);
  };

  const showUnconditionalOpenLock = () => {
    // getLockNumbers(manualOVerrideItems.MobileNo);
    setUncondLockOpenVisibility(!uncondLockOpenVisibility);
    setVisibleWindow("display-window");
    setAnchorEl(null);
  };

  const hideWindowVisible = () => {
    setChangeNumberWindVisible(!setChangeNumberWindVisible);
    setVisibleWindow("hide-window");
  };

  const hideOpenLockWindVisibility = () => {
    setVisibleWindow("hide-window");
    setUncondLockOpenVisibility(!uncondLockOpenVisibility);
  };

  //close el (drop box icon items)
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className={visibleWindow}></div>
      <div className="manual-override-window" id="manual-override-window_id">
        <h1 className="site-header">manual override</h1>
        <IoMdCloseCircle
          onClick={() => hideWindowFunction()}
          className="close-changepass-wind"
          size={30}
        />
        <form onSubmit={(e) => submitManualOverride(e)}>
          <FormGroup row>
            <FormLabel className="text-header" component="legend">
              Choose Locker here
            </FormLabel>
            <div className="textfield-checkbox-container">
              {/* {lockNo.map((lock, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      color="info"
                      value={lock}
                      key={index}
                      onChange={(e) => checkBoxHandler(e)}
                    />
                  }
                  label={lock}
                />
              ))} */}
              <FormControlLabel
                control={
                  <Checkbox
                    color="info"
                    value={lockNo}
                    onChange={(e) => checkBoxHandler(e)}
                  />
                }
                label={lockNo}
              />
            </div>
          </FormGroup>

          <div className="textfield-container">
            <TextField
              label="mobile number"
              type="text"
              name="user_phone"
              size="medium"
              value={manualOverrideDet.MobileNo}
              readOnly
              focused
              fullWidth
            />
          </div>

          <div className="textfield-container">
            <FormControl focused fullWidth required>
              <InputLabel>Reason</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                name="reason"
                label="Reason"
                size="medium"
                onChange={(e) => eventHandler(e)}
                value={manualOverrideDet.reason}
                required
              >
                {reasons.map((reason, index) => (
                  <MenuItem value={reason} key={index}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText color="warning">
                Select the reason for Manual Override
              </FormHelperText>
            </FormControl>

            {/* <TextField
              label="reason"
              onChange={(e) => eventHandler(e)}
              type="text"
              name="reason"
              value={manualOverrideDet.reason}
              required
              focused
              fullWidth
            /> */}
          </div>

          <div className="textfield-container">
            <TextField
              name="remarks"
              label="remarks"
              type="text"
              value={manualOverrideDet.remarks}
              onChange={(e) => eventHandler(e)}
              variant="outlined"
              size="medium"
              required
              focused
              fullWidth
            />
          </div>
          <div className="textfield-container">
            <FormControl focused fullWidth required>
              <InputLabel>Request Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="ReqType"
                size="medium"
                label="Request Type"
                onChange={(e) => eventHandler(e)}
                value={manualOverrideDet.ReqType}
                required
              >
                <MenuItem value="Store">{"Store"}</MenuItem>
                <MenuItem value="Retrieve">{"Retrieve"}</MenuItem>
              </Select>
              <FormHelperText color="warning">
                select the request type
              </FormHelperText>
            </FormControl>
          </div>

          {isLoading ? (
            <div className="textfield-container man-btn-container">
              <LoadingButton
                loading
                loadingPosition="end"
                endIcon={<SaveIcon />}
                variant="contained"
                size="medium"
                fullWidth
              >
                submitting
              </LoadingButton>
            </div>
          ) : (
            <div className="textfield-container man-btn-container">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                endIcon={<SaveIcon />}
                size="medium"
                fullWidth
              >
                {" "}
                Submit
              </Button>
            </div>
          )}
        </form>
      </div>

      {changeNummberWindVisible && (
        <div className="change-mobile-wind">
          <ChangeMobileNo
            currentNumber={manualOVerrideItems.MobileNo}
            terminalID={manualOVerrideItems.terminalID}
            hideWindowVisible={() => hideWindowVisible()}
            fetchDetails={() => fetchCustemerDetails()}
          />
        </div>
      )}

      {uncondLockOpenVisibility && (
        <div className="change-uncondLock-wind">
          <UncondOpenLock
            currentNumber={manualOVerrideItems.MobileNo}
            terminalID={manualOVerrideItems.terminalID}
            lockNo={lockNo}
            updateTransactionDetails={() => fetchCustemerDetails()}
            hideWindowVisible={() => hideOpenLockWindVisibility()}
          />
        </div>
      )}
      <div className="transaction-dash-container">
        <div className="header-container">
          <div className="dash-header">
            <h2>Transaction Dashboard</h2>
          </div>

          <div className="transaction-details-container">
            <table className="form-table">
              <tr>
                <td className="table-label">
                  <label htmlFor="cityName" className="from-label">
                    city name :{" "}
                  </label>
                </td>
                <td className="table-input-body">
                  <select
                    name="cityName"
                    id="cityNAme"
                    className="form-input"
                    onChange={selectedCity}
                  >
                    {cityNames.map((cityName) => {
                      return (
                        <option key={cityName} value={cityName}>
                          {" "}
                          {cityName}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>

              <tr>
                <td className="table-label">
                  <label htmlFor="areaNames" className="from-label">
                    area name :{" "}
                  </label>
                </td>

                <td className="table-input-body">
                  <select
                    name="areaName"
                    id="areaName"
                    className="form-input"
                    onChange={displayLockers}
                  >
                    {areaNames.map((areaName) => {
                      return (
                        <option key={areaName} value={areaName}>
                          {" "}
                          {areaName}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            </table>
          </div>

          <div className="lockers-container" id="lockerContainerId">
            <div className="album py-5 td-container">
              <div className="container">
                <div className="btn-container">
                  <button
                    onClick={() => toggleCustDetailView("iconView")}
                    className="buttons btn-iconView"
                    disabled={iconViewDisable}
                  >
                    {" "}
                    Icon View{" "}
                  </button>
                  <button
                    onClick={() => toggleCustDetailView("tableView")}
                    className="buttons btn-tableView"
                    disabled={tableViewDisable}
                  >
                    {" "}
                    Detailed View{" "}
                  </button>
                </div>

                <div className="active-btn-container">
                  <Button
                    color="secondary"
                    variant="contained"
                    size="medium"
                    onClick={() => changeView()}
                  >
                    {btnText}
                  </Button>
                </div>

                {dataStatus &&
                  (iconView ? (
                    <>
                    <div className="row row-cols-md-6 g-3">
                      {custData.custemerName.length > 0 ? (
                        custData.custemerName.map((name, index) => {
                          return (
                            
                              <div className="col">
                                <div className="card  card-body-main">
                                  <FontAwesomeIcon
                                    className="icon-class"
                                    icon={faUserLock}
                                    size="4x"
                                  />
                                  <div className="para-container" key={index}>
                                    <p className="td-para">{name}</p>
                                    <p className="td-para">
                                      {custData.mobileNumber[index]}
                                    </p>
                                  </div>
                                  <div className="info-icon-container">
                                    <BsFillInfoSquareFill
                                      aria-haspopup="true"
                                      onClick={(e) =>
                                        // manualOverride(
                                        //   custData.mobileNumber[index],
                                        //   custData.terminalId[index]
                                        // )
                                        openOptions(
                                          custData.mobileNumber[index],
                                          custData.terminalId[index],
                                          custData.lockNo[index],
                                          e
                                        )
                                      }
                                      className="man-override-icon"
                                      size={15}
                                    />
                                  </div>
                                </div>
                              </div>
                           
                          );
                        })
                        
                      ) : (
                        <h2 className="empty-td">
                          {" "}
                          Transaction details is empty{" "}
                        </h2>
                      )}
                      </div>
                    </>
                  ) : (
                    <div>
                      {custData.custemerName.length > 0 ? (
                        <LockerCatagoryTable
                          tableData={custData}
                          tableType={"transactionDetails"}
                          // manualOverrideFun={manualOverride.bind(this)}
                          manualOverrideFun={openOptions.bind(this)}
                        />
                      ) : (
                        <h2 className="empty-td">
                          {" "}
                          transaction details is empty{" "}
                        </h2>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            {dataStatus === false && (
              <TDHistory
              // tdhistoryData={tdHistory}
              />
            )}
          </div>
        </div>
        <Menu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => changeNumberVisibility()} disableRipple>
            <EditIcon />
            &nbsp; &nbsp; Change Mobile Number
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => manualOverride()} disableRipple>
            <ManageAccountsIcon />
            &nbsp; &nbsp; Manual override
          </MenuItem>
          <Divider sx={{ my: 2 }} />
          <MenuItem onClick={() => showUnconditionalOpenLock()} disableRipple>
            <LockOpenIcon />
            &nbsp; &nbsp; Unconditionally Open lock
          </MenuItem>
        </Menu>
      </div>
    </>
  );
}

export default TransactionDashboardCom;
