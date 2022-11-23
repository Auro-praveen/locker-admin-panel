import "./userCreation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "../../utils/Auth";
import { useLogDetails } from "../../utils/UserLogDetails";
import PathUrl from '../../GlobalVariable/urlPath.json'

function UserCreation() {
  const [permission, setPermission] = useState();
  const [isDisabled, setIsDisabled] = useState(false);

  const [permissionType, setPermissionType] = useState({
    Outlet: "",
    AvailableLockers: "",
    OccupiedLockers: "",
    Charts: "",
  });

  const [data, setData] = useState({
    userName: "",
    userPassword: "",
    userType: "",
    userStatus: "",
    userPermissions: "",
  });

  let slectedValue = (e) => {
    const inputName = e.target.name;
    setData({ ...data, [inputName]: e.target.value });
  };

  let userPermissionFun = (e) => {
    e.preventDefault();
    setPermission(e.target.value);
    e.target.value = "Choose From Dropdown";
  };

  const Auth = useAuth();
  const useLogs = useLogDetails();

  const textAreaWindow = document.getElementById("text-container-id");

  let userPermissionType = (e) => {
    e.preventDefault();
    console.log("inside logg");
    console.log(permission + " : " + e.target.value);

    setPermissionType({ ...permissionType, [permission]: e.target.value });
    textAreaWindow.style.display = "block";
    e.target.value = "Choose From Dropdown";
  };

  let userTypes = [
    "Choose From Dropdown",
    "Outlet",
    "AvailableLockers",
    "OccupiedLockers",
    "Charts",
  ];
  let usetPts = ["Choose From Dropdown", "Enable", "Disable"];

  //axios call in react

  function sendUserReg(e) {
    e.preventDefault();

    setIsDisabled(false);
    // const baseURL = "http://192.168.0.198:8080/AuroAutoLocker/SaveUserCreation";

    //copting two objects to single object

    if (
      permissionType.AvailableLockers !== "" &&
      permissionType.Charts !== "" &&
      permissionType.OccupiedLockers !== "" &&
      permissionType.Outlet !== ""
    ) {
      const userCreationData = {
        ...data,
        userPermissions: permissionType,
      };

      console.log(Object.keys(userCreationData));
      fetch(PathUrl.localServerPath+"SaveUserCreation", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },

        body: JSON.stringify(userCreationData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("stored successfully");
            fetchToUserLogs();
            e.target.reset();
          } else {
            alert("something went wrong");
          }
        })

        .catch((err) => {
          console.log("Error : " + err.message);
        });
    } else {
      alert("all the permissions required");
    }
    setIsDisabled(false);
  }

  //userLogsDetails
  const fetchToUserLogs = () => {
    const fetchObj = {
      username: Auth.user,
      eventType: "userCreation",
      remarks: "user created successfully",
    };
    useLogs.storeUserLogs(fetchObj);
  };

  //   if (!post) return "No post!"

  return (
    <>
      <div className="user-creation-container">
        <div className="user-form-container">
          <div className="form-header">
            <h2>User Creation</h2>
          </div>

          <div className="form-container">
            <form
              onSubmit={(e) => {
                sendUserReg(e);
              }}
            >
              <table className="usercreation-table">
                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="userName">User Name : </label>
                  </td>
                  <td>
                    <input
                      onChange={(e) => slectedValue(e)}
                      type="text"
                      name="userName"
                      id="userName_id"
                      value={data.userName}
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="userPassword">Password : </label>
                  </td>
                  <td>
                    <input
                      onChange={(e) => slectedValue(e)}
                      value={data.userPassword}
                      type="password"
                      name="userPassword"
                      id="userPassword_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="userType">Type : </label>
                  </td>
                  <td>
                    <input
                      onChange={(e) => slectedValue(e)}
                      value={data.userType}
                      type="text"
                      name="userType"
                      id="userType_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="userStatus">Status : </label>
                  </td>
                  <td>
                    <input
                      onChange={(e) => slectedValue(e)}
                      value={data.userStatus}
                      type="text"
                      name="userStatus"
                      id="userStatus_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="userPermission">User Permissions : </label>
                  </td>
                  <td>
                    {/* <input type="text" name='userPermission' id='userPermissionId' className='form-intput' required /> */}
                    <select
                      name="userPermission"
                      id="userPermission_id"
                      className="form-intput permission-select"
                      onChange={(e) => userPermissionFun(e)}
                    >
                      {userTypes.map((userType) => {
                        return (
                          <option value={userType} key={userType}>
                            {userType}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td>
                    <label htmlFor="userPt">PT : </label>
                  </td>
                  <td>
                    <select
                      name="userPt"
                      id="userPt_id"
                      className="form-intput permission-select"
                      onChange={(e) => userPermissionType(e)}
                    >
                      {usetPts.map((usetPt) => {
                        return (
                          <option value={usetPt} key={usetPt}>
                            {usetPt}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
              </table>

              <div className="textarea-container" id="text-container-id">
                {/* <textarea onChange={(e) => slectedValue(e) }  name="allUserPermissions" id="allUserPermission_id" cols="50" rows="5" readOnly></textarea> */}
                <table className="table selected-permission">
                  {permissionType.AvailableLockers !== "" && (
                    <tr>
                      <td>{"AvailableLockers  "}</td>
                      <td>{permissionType.AvailableLockers}</td>
                    </tr>
                  )}
                  {permissionType.Outlet !== "" && (
                    <tr>
                      <td>{"Outlet  "}</td>
                      <td>{permissionType.Outlet}</td>
                    </tr>
                  )}
                  {permissionType.OccupiedLockers !== "" && (
                    <tr>
                      <td>{"OccupiedLockers  "}</td>
                      <td>{permissionType.OccupiedLockers}</td>
                    </tr>
                  )}
                  {permissionType.Charts !== "" && (
                    <tr>
                      <td>{"Charts "}</td>
                      <td>{permissionType.Charts}</td>
                    </tr>
                  )}
                </table>
              </div>

              <input
                type="submit"
                value="Submit"
                className="btn submitBtn"
                disabled={isDisabled}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserCreation;
