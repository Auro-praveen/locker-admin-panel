import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import "./SiteRegCom.css";
import { useLogDetails } from "../../utils/UserLogDetails";
import { useAuth } from "../../utils/Auth";
import PathUrl from '../../GlobalVariable/urlPath.json'

function SiteRegistrationCom() {
  const [siteRegistration, setSiteRegistration] = useState({
    siteId: "",
    siteName: "",
    noOfLockers: "",
    terminalId: "",
    areaCode: "",
    areaName: "",
    cityName: "",
    status: "",
    imeiNumber: "",
    mobileNumber: "",
    userName: "",
  });

  const useLogs = useLogDetails();
  const Auth = useAuth();

  const [isDisabled, setIsDisabled] = useState(false);

  const userEnteredData = (e) => {
    e.preventDefault();
    const inputName = e.target.name;
    setSiteRegistration({ ...siteRegistration, [inputName]: e.target.value });
  };

  const submitSiteRegForm = (e) => {
    e.preventDefault();
    setIsDisabled(true);
    console.log(siteRegistration);
    const baseUrl =
      "http://192.168.0.198:8080/AuroAutoLocker/SaveSiteRegistration";

    fetch(PathUrl.localServerPath+"SaveSiteRegistration", {
      method: "POST",
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        Accept: "application/json",
        // 'Content-Type': 'application/json'
      },
      // mode:'no-cors',
      body: JSON.stringify(siteRegistration),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("data Stored Successfully");
          fetchToUserLogs();
        } else {
          alert("some problem occured");
        }
      })
      .catch((err) => console.log(err));

    e.target.reset();
    setIsDisabled(false);
  };

  const fetchToUserLogs = () => {
    const fetchObj = {
      username: Auth.user,
      eventType: "siteRegistration",
      remarks: "site registered successfully",
    };
    useLogs.storeUserLogs(fetchObj);
  };

  return (
    <>
      <div className="user-creation-container">
        <div className="user-form-container">
          <div className="form-header form-head-siteReg">
            <h2>Site Registration Page</h2>
          </div>

          <div className="form-container">
            <form onSubmit={submitSiteRegForm}>
              <table className="usercreation-table">
                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="siteId">Site Id : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="siteId"
                      id="site_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="siteName">Site Name : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="siteName"
                      id="siteName_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="noOfLockers">No. Of Lockers : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="number"
                      name="noOfLockers"
                      id="NoOfLockers_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="terminalId">Terminal Id : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="terminalId"
                      id="terminal_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="areaCode">Area Code : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="areaCode"
                      id="areaCode_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="areaName">Area Name : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="areaName"
                      id="areaName_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="cityName">City Name : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="cityName"
                      id="cityName_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="status">Status : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="status"
                      id="status_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="imeiNumber">IMEI Number : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="imeiNumber"
                      id="imeiNumber_id"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="mobileNumber">Mobile Number : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="number"
                      name="mobileNumber"
                      id="mobileNumber"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>

                <tr className="usercreation-table-row">
                  <td>
                    <label htmlFor="userName">User Name : </label>
                  </td>
                  <td>
                    <input
                      onChange={userEnteredData}
                      type="text"
                      name="userName"
                      id="userName"
                      className="form-intput"
                      required
                    />
                  </td>
                </tr>
              </table>
              <input
                type="submit"
                value="Submit"
                className="btn submitBtn btn-siteReg"
                disabled={isDisabled}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SiteRegistrationCom;
