import React, { useState } from 'react'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import ReleaseLock from './releaseLock/ReleaseLock';
import UnconditionalLockerOpen from './uncoditionalOpenLock/UnconditionalLockerOpen';


const LockerOperations = () => {
    const [modeOfOperationDailogue, setModeOfOperationDailogue] = useState(true);
    const [releaseLockWind , setReleaseLockWindow] = useState(false)
    const [unconditionalLockWind , setUnconditionalLockWind] = useState(false)

    const onReleaseLockSelect = () => {
        setModeOfOperationDailogue(false);
        setReleaseLockWindow(true)
      };
    
      const onUnconditionalOpenLockSelect = () => {
        // getTerminalIdsOfTransactionDetails();
        setModeOfOperationDailogue(false);
        setUnconditionalLockWind(true)
      };

  return (
    <div>
              {/* dailogue box for choosing between unconditionally opoen lock and release lock */}
      <Dialog open={modeOfOperationDailogue}>
        <DialogTitle>Select Mode Of Operation</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem button onClick={() => onReleaseLockSelect()}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <LockResetIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Release Locker"} />
          </ListItem>

          <ListItem button onClick={() => onUnconditionalOpenLockSelect()}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <LockOpenIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Unconditional Open Lock"} />
          </ListItem>
        </List>
      </Dialog>
      {
        releaseLockWind &&
          <ReleaseLock />
      }
      {
        unconditionalLockWind &&
          <UnconditionalLockerOpen />
      }
    </div>
  )
}

export default LockerOperations