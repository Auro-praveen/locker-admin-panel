import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./releaseLock.css";
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
import Snackbar from "@mui/material/Snackbar";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const ReleaseLock = () => {
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
  const [inProgressLocks, setInProgressLocks] = useState([]);
  const Auth = useAuth();

  const [releaseLockObject, setReleaseLockObject] = useState({
    PacketType: "releaselocker",
    MobileNo: "9900990099",
    terminalID: "",
    LockerNo: "",
    userId: Auth.user,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isTerminalIdPresent, seIsTerminalIdPresent] = useState(true)
  const [openErrorAlert, setOpenErrorAlert] = useState(false)
  const [openWarningAlert, setOpenWarningAlert] = useState(false)

  const [tdTerminalIds, setTdTerminalIds] = useState([]);

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal } = state;


  const handleClose = () => {
    setOpen(false);
  };

  // asking admin wheather releaselock or uncondtionally open lock

  useEffect(() => {
    getTerminalIdsOfTransactionDetails();
  }, [])

  // for selecting the lockers
  const userSelectedLockFun = (lock) => {
    if (lock !== "QR") {
      if (inProgressLocks.indexOf(lock) === -1) {
        setReleaseLockObject({
          ...releaseLockObject,
          LockerNo: lock,
        });
      }
    }
  };

  // const fetchUrl = "http://192.168.0.198:8080/AuroAutoLocker/SaveReleaseLocker";

  // const fetchTdLockers =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  const getInProgressLocks = (terminalid) => {
    setLoading(true);
    const getLocksObj = {
      PacketType: "getprogresslock",
      terminalID: terminalid,
    };
    fetch(urlPath.localServerPath+"FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(getLocksObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "TDLOCK-200") {
          setInProgressLocks(data.LOCKERS);
        } else if (data.responseCode === "NOLOCK-201") {
          alert("No locks present");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  // to get all ther terminalids from the present transaction details
  const getTerminalIdsOfTransactionDetails = () => {
    setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
    };
    fetch(urlPath.localServerPath+"FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(getLocksObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "avltd-200") {
          setTdTerminalIds(data.terminalID);

          setReleaseLockObject({
            ...releaseLockObject,
            terminalID: data.terminalID[0],
          });
          if (data.terminalID[0]) {
            getInProgressLocks(data.terminalID[0]);
          }
        } else if (data.responseCode === "notd-201") {
          alert("no terminalId in transaction details");
          seIsTerminalIdPresent(false)
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  const sendReleaseLockToServer = () => {
    if (releaseLockObject.LockerNo === "") {
      setOpenWarningAlert(true)
    } else {
      setLoading(true);
      const serverObj = {
        ...releaseLockObject,
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
            alert("something went wrong");
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
    fetch(urlPath.localServerPath+"SaveReleaseLocker", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(releaseLockObject),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setOpen(true);
        }
        setOpen(true);
      })
      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  // to get the lockers from the selected terminal id
  const terminalIDHandler = (e) => {
    setReleaseLockObject({
      ...releaseLockObject,
      terminalID: e.target.value,
      LockerNo: "",
    });
    getInProgressLocks(e.target.value);
  };



  return (
    <div className="release-lock-container">
      <h2 className="page-title">Release Lock</h2>
      {isTerminalIdPresent ? 
      <>
      <div className="terminalId-dropdown-container">

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
            open={openWarningAlert}
            autoHideDuration={6000}
            onClose={() => {
              setOpenWarningAlert(false);
            }}
          >
            <Alert
              onClose={() => {
                setOpenWarningAlert(false);
              }}
              severity="warning"
            >
              Please Choose a Locker !
            </Alert>
          </Snackbar>

        <Box>
          <FormControl sx={{ m: 1, width: 300 }} focused>
            <InputLabel variant="standard " htmlFor="uncontrolled-native">
              Choose terminalId
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "Choose terminalId",
                id: "uncontrolled-native",
              }}
              value={releaseLockObject.terminalID}
              onChange={(e) => terminalIDHandler(e)}
            >
              {tdTerminalIds.map((termID, index) => (
                <option className="option-container" value={termID} key={index}>
                  {termID}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
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
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : releaseLockObject.LockerNo === row
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
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : releaseLockObject.LockerNo === row
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
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : releaseLockObject.LockerNo === row
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
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : releaseLockObject.LockerNo === row
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
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : releaseLockObject.LockerNo === row
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
          {releaseLockObject.LockerNo +" is released Successfully"}
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
      </> :
       <h2>No active Terminal Id's are present currently. Try again</h2>}
    </div>
  );
};

export default ReleaseLock;
