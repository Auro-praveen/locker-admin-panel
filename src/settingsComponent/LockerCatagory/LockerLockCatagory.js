import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./LockerLockCatagoryDes.css";
import LockerCatagoryTable from "../TableFunction/LockerCatagoryTable";
// import { FaAdjust } from 'react-icons/fa'; //importing react icons
import FadeLoader from "react-spinners/FadeLoader";
import { GiLockedBox } from "react-icons/gi";
import { FaRegWindowClose } from "react-icons/fa";
import { useAuth } from "../../utils/Auth";
import { useLogDetails } from "../../utils/UserLogDetails";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import PathUrl from '../../GlobalVariable/urlPath.json';

// from material ui
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const LockerLockCatagory = () => {
  const [isLoading, setISLoading] = useState(false);
  const [terminalIds, setTerminalIds] = useState([]);
  const [locationName, setLocationName] = useState();
  const [noOfLockers, setNoOfLockers] = useState();

  const [selectLocks, setSelectLocks] = useState([]);
  const [selectedLocks, setSelectedLocks] = useState([]);


  const [locksDetail, setLocksDetails] = useState({
    terminalId: "",
    locksSelected: "",
    locName: "",
    totNoOfLocks: "",
    catagory: "",
    slotTime: "",
    amount: "",
  });

  const [tableData, setTableData] = useState({
    SlNo: "",
    TerminalId: "",
    Location: "",
    NoOfLockers: "",
    Locks: "",
    Catagory: "",
    SlotTime: "",
    Amount: "",
  });

  const Auth = useAuth();
  const useLogs = useLogDetails();
  let targetInput = (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    if (e.target.value !== "chooseCatagory") {
      setLocksDetails({ ...locksDetail, [targetName]: e.target.value });
    } else {
      alert("choose valid catagory");
    }
  };

  //For selecting locks from the user input tag

  // let selectingLocks = (e) => {
  //   e.preventDefault();
  //   const targetName = e.target.name;
  //   const targetValue = e.target.value;

  //   if(targetValue > noOfLockers) {
  //     alert("no locks on that number")
  //   } else  if(targetValue.match('/[a-zA-Z]+/g')) {
  //     alert("Alphabets are not allowed")
  //   }
  //    else {
  //     setLocksDetails({...locksDetail , [targetName] : targetValue });
  //   }
  // }

  let catagoriesName = ["chooseCatagory", "Small", "Medium", "Large"];

  //fetch terminal id
  // const getTerminalIds =
  //   "http://192.168.0.198:8080/AuroAutoLocker/LockerLocksDetails";

  useEffect(() => {
    setISLoading(true);
    fetch(PathUrl.localServerPath+"LockerLocksDetails", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        const termId = jsonData.terminalId;
        setTerminalIds(termId);
      })
      .catch((err) => {
        console.log("err = ", err);
      });
    setISLoading(false);
  }, []);

  // const baseUrl = "http://192.168.0.198:8080/AuroAutoLocker/LockerLocksDetails";

  // submit the form
  const saveLockDetails = (e) => {
    e.oreventDefault();
    setISLoading(true);
    console.log("====================================");
    console.log(locksDetail);
    console.log("====================================");
    if (
      locksDetail.catagory === "" &&
      locksDetail.terminalId === "" &&
      locksDetail.locName === "" &&
      locksDetail.totNoOfLocks === "" &&
      locksDetail.locksSelected === ""
    ) {
      e.preventDefault();
      alert("Please fill all the details \nsome inputs may be empty");
    } else if (locksDetail.catagory !== "chooseCatagory") {
      fetch(PathUrl.localServerPath+"LockerLocksDetails", {
        method: "POST",
        headers: {
          Accept: "application/json",
          // "Content-Type": "application/json"
        },
        body: JSON.stringify(locksDetail),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            fetchDataToTable();
            fetchToUserLogs();
            e.target.reset();
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      e.preventDefault();
      alert("choose valid catagory");
    }
    setISLoading(false);
  };

  //fetch location name and no of lockers of corresponding terminal id from backend
  const fetchFromTerminalId = (e) => {
    const value = document.getElementById("terminal_id").value;
    e.preventDefault();
    setISLoading(true);
    const selectedVal = e.target.value;

    setLocksDetails({ ...locksDetail, terminalId: selectedVal });

    fetch(PathUrl.localServerPath + "LockerLocksDetails?termId=" + selectedVal, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((termId) => {
        setNoOfLockers(termId.noLockers);
        setLocationName(termId.locationName);

        setLocksDetails({
          ...locksDetail,
          totNoOfLocks: termId.noLockers,
          terminalId: value,
          locName: termId.locationName,
        });
      })

      .catch((err) => console.log("err :" + err));
    setISLoading(false);
  };

  // to fetch lockers category to table
  useEffect(() => {
    fetchDataToTable();
  }, []);

  const fetchDataToTable = (e) => {
    setISLoading(true);
    // const fetchTableUrl =
    //   "http://192.168.0.198:8080/AuroAutoLocker/FetchLocksDetail";
    fetch(PathUrl.localServerPath+"FetchLocksDetail", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTableData({
          ...tableData,
          SlNo: data.slno,
          TerminalId: data.termId,
          Location: data.siteName,
          NoOfLockers: data.noOfLocks,
          Locks: data.locks,
          Catagory: data.catagory,
          SlotTime: data.slotTime,
          Amount: data.amount,
        });
      })
      .catch((err) => console.log("err " + err));

    setISLoading(false);
  };

  //for the select locks window
  const blurrWindow = document.getElementById("blurr-window-id");
  const lockContainer = document.getElementById("locks-container-id");

  const selectLocksHandler = (e) => {
    e.preventDefault();
    if (noOfLockers) {
      let i = 0;
      const max = 3;
      const min = 1;
      const newArr = [];
      while (i < noOfLockers) {
        newArr.push(Math.floor(Math.random() * max) + min);
        i++;
        blurrWindow.style.display = "block";
        lockContainer.style.display = "block";
      }
      setSelectLocks(newArr);
    } else {
      alert("No of Lockers cant be empty");
    }
  };
  const closeLocksWindowBtn = () => {
    blurrWindow.style.display = "none";
    lockContainer.style.display = "none";
  };

  // const lockIconSelect = (e) => {
  //   const lockIcon = document.getElementsByClassName("lock-icon-class");
  //   for (let i = 0; i < lockIcon.length; i++) {
  //     lockIcon[i].addEventListener('click', function () {
  //       console.log("clicked");
  //     })

  //   }
  // }

  //cant use e.target.value for other tags other than input
  const selectLocksFromIconFun = (value, clsName, e) => {
    // console.log("inside "+selClassName);

    // e.target.style.color='rgb(56, 245, 128)';
    if (!selectedLocks.includes(value)) {
      setSelectedLocks((arr) => [...arr, value]);
      // setSelectedLocks([...selectedLocks , value]);
    } else {
      const selectedArr = [...selectedLocks];
      const index = selectedArr.indexOf(value);

      if (index !== -1) {
        selectedArr.splice(index, 1);
        setSelectedLocks([...selectedArr]);
      }

      console.log(selectedArr);
    }
  };

  const selectedLockItemId = document.getElementById("selected_locks_id");

  const collectSelectedLocks = (e) => {
    e.preventDefault();

    if (selectedLocks.length) {
      setLocksDetails({
        ...locksDetail,
        locksSelected: selectedLocks.toString(),
      });
      blurrWindow.style.display = "none";
      lockContainer.style.display = "none";
      selectedLockItemId.style.display = "block";
    } else {
      console.log("absent");
    }
  };

  const fetchToUserLogs = () => {
    const fetchObj = {
      username: Auth.user,
      eventType: "userCreation",
      remarks: "user created successfully",
    };
    useLogs.storeUserLogs(fetchObj);
  };

  return (
    <>
      <div className="locks-window-container" id="blurr-window-id"></div>
      <div className="locks-window" id="locks-container-id">
        <button
          onClick={() => {
            closeLocksWindowBtn();
          }}
          id="close-locks-window-id"
          className="close-locks-window"
        >
          <FaRegWindowClose color="#ff267d" size="25" />
        </button>
        <div className="window-btn-container">
          <button
            onClick={collectSelectedLocks}
            className="btn selected-locks-btn"
          >
            {" "}
            confirm selected locks ...{" "}
          </button>
        </div>
        <div className="all-locks">
          <table className="table">
            <tbody>
              {selectLocks.map((lock, index) => {
                let name;
                if (lock === 1) {
                  lock = 50;
                  name="S"
                } else if (lock === 2) {
                  lock = 65;
                  name="M"
                } else if (lock === 3) {
                  lock = 80;
                  name="L"
                }

                return (
                  <>
                  <tr>
                  <td
                      onClick={selectLocksFromIconFun.bind(this, index + 1)}
                      // rowSpan={lock===80 ? 4 :  lock === 65 ? 3 : lock === 50 ? 2 : 1}
                      rowSpan='2'
                      name="selectedVal"
                      key={index + 1}
                      className="lockBox-icon"
                    >
                      {/* <GiLockedBox
                        value="value"
                        className="lock-icon-class"
                        size={lock}
                      /> */}
                      {name} 
                    </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading ? (
        <div>
          <div className="loading-frame-container">
            <div className="loading-container">
              <FadeLoader
                className="fileLoader-icon"
                color="#050024"
                height="10px"
                width="10px"
                speedMultiplier="2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="locker-catagory-container">
          <div>
            <div className="locker-locks-form">
              <div className="locks-form-container">
                <div className="locker-catagory-head">
                  <h1>Locker Locks Catagory</h1>
                </div>
                <form onSubmit={(e) => saveLockDetails(e)}>
                  <table>
                    <tr>
                      <td>
                        <label htmlFor="terminsalId">Terminal ID :</label>
                      </td>
                      <td>
                        {/* <input onChange={targetInput} type="text" value={locksDetail.terminalId} className='form-input-tag' placeholder='terminalId' id='terminal_id'name='terminalId' required/> */}
                        <select
                          onChange={fetchFromTerminalId}
                          name="terminalId"
                          id="terminal_id"
                          className="form-input-tag"
                          value={locksDetail.terminalId}
                          required
                        >
                          {terminalIds.map((termId) => {
                            return (
                              <option value={termId} key={termId}>
                                {termId}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label htmlFor="locationName">Location :</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          id="locationName_id"
                          className="form-input-tag"
                          value={locationName}
                          name="locationName"
                          readOnly
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label htmlFor="noOfLockers">No. Of Lockers :</label>
                      </td>
                      <td>
                        <input
                          type="number"
                          id="noOfLockers_id"
                          value={noOfLockers}
                          className="form-input-tag input-num"
                          name="noOfLockers"
                          readOnly
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <input
                          onClick={selectLocksHandler}
                          type="button"
                          value={"Choose Locks..."}
                          className="btn choose-locks-btn"
                          id="locksSelected_id"
                          name="locksSelected"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          id="selected_locks_id"
                          className="form-input-tag selected-locks-field"
                          value={selectedLocks}
                          name="selected_locks"
                          readOnly
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label htmlFor="catagories">Catagories:</label>
                      </td>
                      <td>
                        <select
                          onChange={targetInput}
                          name="catagory"
                          id="catagories_id"
                          className="form-input-tag"
                          value={locksDetail.catagory}
                          required
                        >
                          {catagoriesName.map((catagory) => {
                            return (
                              <option value={catagory} key={catagory}>
                                {catagory}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label htmlFor="slotTime">Slot :</label>
                      </td>
                      <td>
                        <input
                          onChange={targetInput}
                          type="text"
                          id="slot_time_id"
                          className="form-input-tag"
                          value={locksDetail.slotTime}
                          name="slotTime"
                          required
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label htmlFor="amount">amount :</label>
                      </td>
                      <td>
                        <input
                          onChange={targetInput}
                          type="number"
                          id="amount_id"
                          className="form-input-tag input_number"
                          value={locksDetail.amount}
                          name="amount"
                          required
                        />
                      </td>
                    </tr>
                  </table>
                  <input
                    className="btn btn-submit"
                    type="submit"
                    value="Save"
                  />
                </form>
              </div>
            </div>
            {!tableData ? (
              <div> No data is available in table </div>
            ) : (
              <LockerCatagoryTable
                tableData={tableData}
                fetchtableFun={fetchDataToTable}
                tableType={"lockerLocksDetails"}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LockerLockCatagory;
