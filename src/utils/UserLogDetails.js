import {createContext, useContext, useState} from "react";

import PathUrl from '../GlobalVariable/urlPath.json'

const logDetailContext = createContext(null);



export const UserLogDetails = ({children}) => {
    const [userLogDetails, setUserLogDetails] = useState()

    const storeUserLogs =(argObj) => {
        // const storeUrl = "http://192.168.0.198:8080/AuroAutoLocker/UserLogDetails";
        const date = getCurrentDate();
        const time = getCurrentTime();
        console.log("inside StoreUSerLogs");
        const jsonObj = {
            date: date,
            time: time,
            ...argObj
        }
        setUserLogDetails(jsonObj)

        fetch(PathUrl.localServerPath+"UserLogDetails", {
            method:'POST',
            headers: {
                Accept:'application/json'
            },
            body:JSON.stringify(jsonObj)
        })
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch(err => console.log("err : "+err))

    }

    const getCurrentDate = () => {
        const today = new Date();
        let date = today.getFullYear()+":"+(today.getMonth()+1) +":"+today.getDate();
        return date
    }

    const getCurrentTime = () => {
        const today = new Date();
        let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
        return time;
    }

    return (<logDetailContext.Provider value={{ storeUserLogs, userLogDetails }} >{children}</logDetailContext.Provider>)
}

export const useLogDetails = () => {
    return useContext(logDetailContext)
}