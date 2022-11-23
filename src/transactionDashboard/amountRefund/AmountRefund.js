import React, { useState } from "react";
import "./refund.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Button,
  InputLabel,
  NativeSelect,
  FormControl,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import PathUrl from '../../GlobalVariable/urlPath.json'

const AmountRefund = () => {
  const [itemsToGetTransactionDetials, setTtemsToGetTransactionDetials] =
    useState({
      type: "Store",
      mobileNumber: "",
      dateOfTransaction: "",
    });

  const [itemsForRefund, setItemsForRefund] = useState({
    packetType: "refundreq",
    mobileNo: "",
    terminalID: "",
    lockerNo: "",
    paymentId: "",
    userName: "",
    // excessPayId: "",
    dateOfPayment: "",
    enteredAmount: "",
  });

  const [amountType, setAmountType] = useState({
    amount: "",
    excessAmount: "",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const openDailogue = Boolean(anchorEl);
  const [isDailogueOpen, setIsDailogueOpen] = useState(false);
  const [invalidAmount, setInvalidAmount] = useState(true);

  const [isRepayError, setIsRepayError] = useState(false);
  const [isRepaySuccess, setIsRepaySuccess] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState({
    slno: [],
    userName: [],
    amount: [],
    mobileNumber: [],
    lockerNo: [],
    terminalId: [],
    paymentId: [],
    dateOfTransaction: [],
    excessPayId: [],
    noOfHours: [],
    status: [],
    excessAmount: [],
  });

  const [tdTableView, setTdTableView] = useState(false);

  const changeEventHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;
    if (name === "mobileNumber") {
      if (e.target.value.length <= 10) {
        setTtemsToGetTransactionDetials({
          ...itemsToGetTransactionDetials,
          [name]: e.target.value,
        });
      }
    } else {
      setTtemsToGetTransactionDetials({
        ...itemsToGetTransactionDetials,
        [name]: e.target.value,
      });
    }
  };

  // const urlPath =
  //   "http://192.168.0.198:8080/AuroAutoLocker//TransactionRefundHandler";
  const submitRefundForm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const getTdItems = {
      ...itemsToGetTransactionDetials,
      packetType: "gettditems",
    };
    console.log(getTdItems);

    fetch(PathUrl.localServerPath+"TransactionRefundHandler", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(getTdItems),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "tdfetchsuccess") {
          setTransactionDetails({
            ...transactionDetails,
            slno: data.slno,
            userName: data.userName,
            mobileNumber: data.mobileNumber,
            terminalId: data.terminalID,
            amount: data.amount,
            dateOfTransaction: data.dateOfOpen,
            status: data.status,
            paymentId: data.paymentId,
            noOfHours: data.noOfHours,
            lockerNo: data.lockNo,
            excessPayId: data.excessPayId,
            excessAmount: data.excessAmount,
          });
          setTdTableView(true);
          setIsLoading(false);
        } else {
          alert("something went wrong");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err : " + err);
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDailogueFun = (
    amount,
    mobileNumber,
    lockerNo,
    terminalId,
    paymentId,
    excessPayId,
    dateOfPayment,
    excessAmount,
    userName,
    event
  ) => {
    setAnchorEl(event.currentTarget);

    if (excessAmount) {
      setItemsForRefund({
        ...itemsForRefund,
        mobileNo: mobileNumber,
        lockerNo: lockerNo,
        terminalID: terminalId,
        paymentId: excessPayId,
        dateOfPayment: dateOfPayment,
        userName: userName,
      });
    } else {
      setItemsForRefund({
        ...itemsForRefund,
        mobileNo: mobileNumber,
        lockerNo: lockerNo,
        terminalID: terminalId,
        paymentId: paymentId,
        dateOfPayment: dateOfPayment,
        userName: userName,
      });
    }

    setAmountType({
      ...amountType,
      amount: Math.floor(amount / 100),
      excessAmount: Math.floor(excessAmount / 100),
    });
  };

  const submitRefundAmountFun = (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(itemsForRefund);
    fetch(PathUrl.localServerPath+"TransactionRefundHandler", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(itemsForRefund),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "refundsucc") {
          setItemsForRefund({
            ...itemsForRefund,
            enteredAmount: "",
          });
          setIsLoading(false);
          setIsDailogueOpen(false)
          setInvalidAmount(true);
          setIsRepaySuccess(true)
          setIsRepayError(false)
        } else {
          setItemsForRefund({
            ...itemsForRefund,
            enteredAmount: "",
          });
          setIsLoading(false);
          setIsRepayError(true)
          setIsRepaySuccess(false)
          setIsDailogueOpen(false)
          setInvalidAmount(true);
          
        }
        
      })
      .catch((err) => {
        setIsLoading(false);
        isRepayError(true)
        setIsDailogueOpen(false)
        console.log("err : " + err);
      });
  };

  const openRefundAmountWin = () => {
    setIsDailogueOpen(true);
  };

  const closeDailogueWindFun = () => {
    setItemsForRefund({
      ...itemsForRefund,
      enteredAmount: "",
    });
    setInvalidAmount(true);
    setIsDailogueOpen(false);
    setAnchorEl(null);
  };

  const refundAmountHandler = (e) => {
    setItemsForRefund({
      ...itemsForRefund,
      enteredAmount: e.target.value,
    });

    if (amountType.excessAmount) {
      if (e.target.value === "") {
        setInvalidAmount(true);
      } else if (e.target.value <= amountType.excessAmount) {
        setInvalidAmount(false);
      } else {
        setInvalidAmount(true);
      }
    } else {
      if (e.target.value <= amountType.amount) {
        setInvalidAmount(false);
      } else {
        setInvalidAmount(true);
      }
    }
  };

  const closeErrorAlert = () => {
    setIsRepayError(false)
  }

  const closeSuccessAlert = () => {
    setIsRepaySuccess(false)
  }

  return (
    <div className="amount-refund-container">
      <h2 className="page-header">Refund Window !!</h2>

      <div className="refund-amount-wind">
        <Stack sx={{ width: "100%" }} spacing={2}>
        <Collapse in={isRepayError}>
          <Alert severity="error" onClose={() => closeErrorAlert()}>refund failed  — check it out!</Alert>
        </Collapse>

        <Collapse in={isRepaySuccess}>
          <Alert severity="success"
          onClose={() => closeSuccessAlert()}>
            refund was success — check it out!
          </Alert>
          </Collapse>
        </Stack>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => submitRefundForm(e)}
        >
          <div className="textfield-container">
            <TextField
              name="mobileNumber"
              value={itemsToGetTransactionDetials.mobileNumber}
              label="mobile number"
              variant="outlined"
              type="number"
              onChange={(e) => changeEventHandler(e)}
              fullWidth
              required
              focused
            />
          </div>

          <div className="textfield-container">
            <TextField
              name="dateOfTransaction"
              value={itemsToGetTransactionDetials.dateOfTransaction}
              label="date of transaction"
              variant="outlined"
              type="date"
              onChange={(e) => changeEventHandler(e)}
              fullWidth
              required
              focused
            />
          </div>

          <div className="textfield-container">
            <FormControl focused fullWidth>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                type Of Refund
              </InputLabel>
              <NativeSelect
                name="type"
                value={itemsToGetTransactionDetials.type}
                onChange={(e) => changeEventHandler(e)}
                inputProps={{
                  name: "type",
                  id: "uncontrolled-native",
                }}
              >
                <option value={"Store"}>Store</option>
                <option value={"Retrieve"}>Retrieve</option>
              </NativeSelect>
            </FormControl>
          </div>

          <div className="textfield-container">
            <Button color="info" variant="contained" type="submit" fullWidth>
              submit
            </Button>
          </div>
        </Box>
      </div>

      {tdTableView &&
        (transactionDetails.userName.length > 0 ? (
          <div className="table-view-container">
            <LockerCatagoryTable
              tableType="refundTransactionDetails"
              tableData={transactionDetails}
              selectRowFun={openDailogueFun.bind(this)}
            />
          </div>
        ) : (
          <h2>No data is present</h2>
        ))}

      {isDailogueOpen && (
        <>
          <div className="backround-cover"></div>
          <div className="refund-amount-container">
            <CloseIcon
              color="warning"
              onClick={(e) => closeDailogueWindFun(e)}
              className="close-icon"
            />
            <h2 className="page-header">Enter amount here for refund</h2>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                width: 300,
                m: "auto",
              }}
              onSubmit={(e) => submitRefundAmountFun(e)}
            >
              <div className="textfield-container">
                <TextField
                  error={invalidAmount}
                  name="enteredAmount"
                  value={itemsForRefund.enteredAmount}
                  label="total amount"
                  variant="outlined"
                  type="number"
                  color="success"
                  helperText={
                    amountType.excessAmount
                      ? "amount shoud less than " + amountType.excessAmount
                      : "amount shoud less than " + amountType.amount
                  }
                  onChange={(e) => refundAmountHandler(e)}
                  fullWidth
                  required
                  focused
                />
              </div>
              <div className="textfield-container">
                <Button
                  color="info"
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={invalidAmount}
                >
                  submit
                </Button>
              </div>
            </Box>
          </div>
        </>
      )}

      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={openDailogue}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => openRefundAmountWin()} disableRipple>
          <EditIcon />
          &nbsp; &nbsp; Refund Here
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {/* <Divider sx={{ my: 2 }} /> */}
      </Menu>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={() => c}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default AmountRefund;
