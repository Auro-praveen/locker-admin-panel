import React, { useEffect, useState } from "react";
import { Button, mobileStepperClasses, TextField } from "@mui/material";
// import "./releaseLock.css";
import { useAuth } from "../../utils/Auth";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import urlPath from "../../GlobalVariable/urlPath.json";

import lockers from "../../GlobalVariable/lockers.json";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import Collapse from "@mui/material/Collapse";
// import Alert from "@mui/material/Alert";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import pathUrl from "../../GlobalVariable/urlPath.json";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const UnconditionalLockerOpen = () => {
  const locksMapping = {
    allLocks: lockers.G21,
    seatNoA: ["S1", "S5", "S9", "S12", "L15", "L19"],
    seatNoB: ["S2", "S6", "QR", "L16", "L20"],
    seatNoC: ["M3", "M7", "L17", "L21"],
    seatNoD: ["S10", "S13", "XL18", "XL22"],
    seatNoE: ["M4", "M8", "M11", "M14"],
  };

  // const [terminalID, setTerminalID] = useState();
  // locks in the transaction details

  const Auth = useAuth();

  const [unconditionalLockObject, setUnconditionalLockObject] = useState({
    MobileNo: "",
    terminalID: "G21",
    PacketType: "uncndopenlock",
    LockerNo: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [lockerWarning, setLockerWarning] = useState(false);
  const [mobileNumberWarning, setMobileNumberWarning] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal } = state;

  const terminalIds = ["G21", "ORN"];

  const handleClose = () => {
    setOpen(false);
  };

  // asking admin wheather releaselock or uncondtionally open lock

  // for selecting the lockers
  const userSelectedLockFun = (lock) => {
    if (lock !== "QR") {
      setUnconditionalLockObject({
        ...unconditionalLockObject,
        LockerNo: lock,
      });
    }
  };

  const fetchUrl = "http://192.168.0.198:8080/AuroAutoLocker/SaveReleaseLocker";

  // const fetchTdLockers =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  // to get all ther terminalids from the present transaction details

  const sendReleaseLockToServer = () => {
    if (unconditionalLockObject.LockerNo === "") {
      setLockerWarning(true);
    } else if (unconditionalLockObject.MobileNo.length < 10) {
      setMobileNumberWarning(true);
    } else if (unconditionalLockObject.terminalID === "") {
      alert("Please enter terminal Id");
    } else {
      setLoading(true);
      const serverObj = {
        ...unconditionalLockObject,
      };
      delete serverObj.userId;
      console.log(serverObj);

      fetch(urlPath.serverUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(serverObj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "RALOP-200") {
            submitReleaseLock();
          } else if (data.responseCode === "RFLOP-201") {
            
            setOpenErrorAlert(true);
          } else {
            setOpenErrorAlert(true);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log("err : " + err);
          setLoading(false);
        });
    }
  };

  const submitReleaseLock = () => {
    fetch(pathUrl.localServerPath+"SaveReleaseLocker", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(unconditionalLockObject),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setOpen(true);
          setOpenSuccessAlert(true);
        } else {
          setOpenErrorAlert(true);
        }
        setOpen(true);
      })
      .catch((err) => {
        console.log("err : " + err);
        setOpenErrorAlert(true);
        setLoading(false);
      });
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  // to get the lockers from the selected terminal id
  const terminalIDHandler = (e) => {
    setUnconditionalLockObject({
      ...unconditionalLockObject,
      terminalID: e.target.value,
      LockerNo: "",
      MobileNo: "",
    });
    // getInProgressLocks(e.target.value);
  };

  // send uncondional open lock request to the server

  const openLockFunction = () => {
    const dataObj = {
      ...unconditionalLockObject,
    };

    console.log("called");
    if (unconditionalLockObject.LockerNo.length === 0) {
    } else {
      fetch(pathUrl.serverUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(unconditionalLockObject),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.responseCode === "REQAC-200") {
            fetchDataInDatabase();
          } else if (data.responseCode === "REQF-201") {
          }
        })
        .catch((err) => {
          console.log("err : " + err);
        });
    }
  };

  // const dbStoreUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";
  
  const fetchDataInDatabase = () => {
    const Obj = {
      ...unconditionalLockObject,
    };

    delete Obj.LockerNo;

    const respObj = {
      ...Obj,
      LOCKNO: unconditionalLockObject.LockerNo,
      TransType: "internet",
    };

    fetch(urlPath.localServerPath+"FetchTransactionDetails", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(respObj),
    })
      .then((resp) => JSON.stringify(resp))
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setUnconditionalLockObject({
            ...unconditionalLockObject,
            LockerNo: "",
          });
        } else {
        }
      });
  };

  const mobileNumberHandler = (e) => {
    if (e.target.value.length <= 10) {
      setUnconditionalLockObject({
        ...unconditionalLockObject,
        MobileNo: e.target.value,
      });
    }
  };

  return (
    <div className="release-lock-container">
      <h2 className="page-title">Unconditional open locker</h2>
      <div className="terminalId-dropdown-container">
        <Box sx={{ width: "100%" }}>
          {/* <Collapse in={openErrorAlert}>
          <Alert severity="error" onClose={() => {setOpenErrorAlert(false)}}>Somthing went Wrong ! please try again</Alert>
        </Collapse>

        <Collapse in={lockerWarning}>
          <Alert severity="warning" onClose={() => {setLockerWarning(false)}}> Please Choose a Locker ! </Alert>
        </Collapse>

        <Collapse in={mobileNumberWarning}>
          <Alert severity="warning" onClose={() => {setMobileNumberWarning(false)}}>Please provide Valid mobile Number !</Alert>
        </Collapse>     

        <Collapse in={openSuccessAlert}>
          <Alert severity="success" onClose={() => {setOpenSuccessAlert(false)}}>This is a success alert — check it out!</Alert>
        </Collapse> */}

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={lockerWarning}
            autoHideDuration={6000}
            onClose={() => {
              setLockerWarning(false);
            }}
          >
            <Alert
              onClose={() => {
                setLockerWarning(false);
              }}
              severity="warning"
            >
              Please Choose a Locker !
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openErrorAlert}
            autoHideDuration={6000}
            onClose={() => {
              setOpenErrorAlert(false);
            }}
          >
            <Alert
              onClose={() => {
                setOpenErrorAlert(false);
              }}
              severity="error"
            >
              Somthing went Wrong ! please try again
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={mobileNumberWarning}
            autoHideDuration={6000}
            onClose={() => {
              setMobileNumberWarning(false);
            }}
          >
            <Alert
              onClose={() => {
                setMobileNumberWarning(false);
              }}
              severity="warning"
            >
              Please provide Valid mobile Number !
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openSuccessAlert}
            autoHideDuration={6000}
            onClose={() => {
              setOpenSuccessAlert(false);
            }}
          >
            <Alert
              onClose={() => {
                setOpenSuccessAlert(false);
              }}
              severity="success"
            >
              This is a success alert — check it out!
            </Alert>
          </Snackbar>
        </Box>

        <Box>
          <FormControl sx={{ m: 1 }} focused fullWidth>
            <InputLabel variant="standard " htmlFor="uncontrolled-native">
              Choose terminalId
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "Choose terminalId",
                id: "uncontrolled-native",
              }}
              value={unconditionalLockObject.terminalID}
              onChange={(e) => terminalIDHandler(e)}
            >
              {terminalIds.map((termID, index) => (
                <option className="option-container" value={termID} key={index}>
                  {termID}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <TextField
            color="primary"
            variant="outlined"
            name="mobileNo"
            value={unconditionalLockObject.MobileNo}
            onChange={(e) => mobileNumberHandler(e)}
            label="Enter user mobileNumber"
            sx={{
              m: 1,
              marginTop: 2,
            }}
            focused
            fullWidth
          />
        </Box>
      </div>
      <div className="layout-container">
        <table className="table table-responsive grid">
          <tbody>
            <tr>
              {locksMapping.seatNoA.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoB.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoC.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoD.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoE.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="releaselock-button-container">
        <Button
          variant="contained"
          color="info"
          onClick={() => sendReleaseLockToServer()}
          fullWidth
        >
          submit
        </Button>
        {/* <LoadingButton
                loading
                loadingPosition="end"
                variant="contained"
                fullWidth
            >
            submitting
            </LoadingButton> */}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {unconditionalLockObject.LockerNo + " is Open now"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => handleLoadingClose()}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UnconditionalLockerOpen;
