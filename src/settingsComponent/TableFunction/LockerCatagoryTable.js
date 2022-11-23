import { React, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { MdDelete } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import "./LockerCatagoryTable.css";
import PathUrl from '../../GlobalVariable/urlPath.json';

const LockerCatagoryTable = (props) => {
  const [loading, setloading] = useState(false);

  const jsonData = props.tableData; //table data is sent from parent object LockerLockCatagory to this child class
  const arrayValue = Object.values(jsonData);
  const tableType = props.tableType;
  console.log(jsonData);
  let jsonArrayTableValues;

  const deleteTableRow = (tddata) => {
    setloading(true);
    const slno = tddata[0];
    // const deleteTableRow =
    //   "http://192.168.0.198:8080/AuroAutoLocker/DeleteAndUpdateLockerLockDetails";
    fetch(PathUrl.localServerPath + "?DeleteAndUpdateLockerLockDetailsslno=" + slno, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          props.fetchtableFun();
        } else {
          alert("error occured");
        }
      })
      .catch((err) => console.log("err : " + err));
    setloading(false);
  };

  // self executing function
  (function () {
    jsonArrayTableValues = [];
    //converting table from row to colums ex [[2,4,6],[1,3,5]] can be converted to [[2,1],[4,4],[6,5]]

    //keys for the table head and values for the table column
    for (let n1 = 0; n1 < arrayValue[0].length; n1++) {
      let content = [];

      for (let n2 = 0; n2 < arrayValue.length; n2++) {
        content.push(arrayValue[n2][n1]);
      }
      jsonArrayTableValues.push(content);
    }
  })();

  let renderTableBody = () => {
    if (tableType === "lockerLocksDetails") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues) => {
            return (
              <tr>
                {tableValues.map((tableValue) => {
                  return <td>{tableValue}</td>;
                })}
                <td>
                  {loading ? (
                    <button className="del-icon-table isloading-true">
                      <ClipLoader color="#002970" />{" "}
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteTableRow(tableValues)}
                      className="del-icon-table"
                    >
                      <MdDelete 
                      size="30" 
                      color="#ff858f" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "transactionDetails") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues) => {
            return (
              <tr>
                {tableValues.map((tableValue) => {
                  return <td>{tableValue}</td>;
                })}
                <td>
                  {loading ? (
                    <button className="del-icon-table isloading-true">
                      <ClipLoader color="#002970" />{" "}
                    </button>
                  ) : (
                    <button className="del-icon-table">
                      <AiOutlineExclamationCircle
                        onClick={(e) =>
                          props.manualOverrideFun(
                            tableValues[3], // mobile number
                            tableValues[1], //terminal id
                            tableValues[10], // locker number
                            e
                          )
                        }
                        size="30"
                        color="#ff858f"
                      />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "transactionDetailsHistory") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues) => {
            return (
              <tr>
                {tableValues.map((tableValue) => {
                  return <td>{tableValue}</td>;
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "deviceHealthStatus") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues) => {
            return (
              <tr>
                {tableValues.map((tableValue) => {
                  return <td>{tableValue}</td>;
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "lockerStatus") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues) => {
            return (
              <tr>
                {tableValues.map((tableValue) => {
                  return <td>{tableValue}</td>;
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "refundTransactionDetails") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues) => {
            return (
              <tr>
                {tableValues.map((tableValue) => {
                  return <td>{tableValue}</td>;
                })}
                <td>
                  <button className="del-icon-table">
                    <AiOutlineExclamationCircle
                      size="30"
                      color="#ff858f"
                      onClick={(e) =>
                        props.selectRowFun(
                          tableValues[2],
                          tableValues[3],
                          tableValues[4],
                          tableValues[5],
                          tableValues[6],
                          tableValues[8],
                          tableValues[7],
                          tableValues[11],
                          tableValues[1],
                          e
                        )
                      }
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </>
      );
    }
  };

  return (
    <div>
      <div className="locker-table-container">
        <table className="table-conteiner table">
          <thead className="table-head">
            <tr>
              {tableType === "transactionDetailsHistory" ? (
                Object.keys(jsonData).map((tableHeader) => {
                  return (
                    <th scope="col" key={tableHeader}>
                      {tableHeader}
                    </th>
                  );
                })
              ) : tableType === "lockerStatus" ? (
                Object.keys(jsonData).map((tableHeader) => {
                  return (
                    <th scope="col" key={tableHeader}>
                      {tableHeader}
                    </th>
                  );
                })
              ) : tableType === "deviceHealthStatus" ? (
                Object.keys(jsonData).map((tableHeader) => {
                  return (
                    <th scope="col" key={tableHeader}>
                      {tableHeader}
                    </th>
                  );
                })
              ) : (
                <>
                  {Object.keys(jsonData).map((tableHeader) => {
                    return (
                      <th scope="col" key={tableHeader}>
                        {tableHeader}
                      </th>
                    );
                  })}
                  <th></th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="table-body">{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default LockerCatagoryTable;
