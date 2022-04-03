/*
 * AdminPage
 *
 * This component let admin to configure parameters
 * Related Function Requirements:
 *  FR7 - Change.LifeSpan
 *  FR10 - Ban.User
 */


import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {BACKEND_URL} from "../../utils/constants";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Item from "../../components/ListItem/Item";
import {InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";


// 1. ban users
// 2. lifespan params of posts (needs endpoint)
// #
// Guest post lifespan:
// 7
// User post lifespan:
// 30
// Like lifespan add:
// 1

//{
//     "guest_post_lifespan": 7,
//     "user_post_lifespan": 30,
//     "like_lifespan_add": 1
// }
const AdminPage = () => {
  const [editableSettings, setEditableSettings] = useState({
    guest_post_lifespan: undefined,
    user_post_lifespan: undefined,
    like_lifespan_add: undefined
  })
  const [guestPostLifespan, setGuestPostLifespan] = useState("");
  const [userPostLifespan, setUserPostLifespan] = useState("");
  const [likeLifespanAdd, setLikeLifespanAdd] = useState("");
  const [banUserField, setBanUser] = useState("");
  const [banTime, setBantime] = useState(0.25);

  const backendUrl = `${BACKEND_URL}/api/`

  // retrieve required data
  useEffect(() => {
    axios.get(backendUrl).then(res => {
        setEditableSettings(res.data);
        setGuestPostLifespan(res.data.guest_post_lifespan.toString());
        setUserPostLifespan(res.data.user_post_lifespan.toString());
        setLikeLifespanAdd(res.data.like_lifespan_add.toString());
      }
    ).catch(err => {
      if (err.response.status) {
        //
        alert("cannot change settings right now, try again later");
      }
    });
  }, [])

  const customStyles = {
    container: {
    },
    gridContainer: {
    },
    header: {
      margin: "20px",
    },
    editableFieldsContainer: {
      display: "flex",
      gap: "20px"
    },
    editableField: {

    },
    changeButton: {
      margin: "15px",
      width: "50%",
      left: "25%",
    },
    banField: {
      flex: 3,
    },
    banTimeField: {
      flex: 1,
    },
  }

  const changeSettings = (e) => {
    const formData = editableSettings
    if (parseInt(likeLifespanAdd) && parseInt(userPostLifespan) && parseInt(guestPostLifespan)) {
      formData.like_lifespan_add = parseInt(likeLifespanAdd);
      formData.user_post_lifespan = parseInt(userPostLifespan);
      formData.guest_post_lifespan = parseInt(guestPostLifespan);
      setEditableSettings(formData);
    } else {
      alert("Please use numbers for editable settings")
      return;
    }

    axios.patch(backendUrl, formData).then(res => {
      if (res.status >= 200 && res.status < 300) {
        alert("saved settings");
      }
    }).catch(err => {
      if (err.response.status) {
        alert("issue setting the editable settings");
      }
      console.log(err);
    });
  }

  const userPostTextChange = (e) => {
    setUserPostLifespan(e.target.value);
  }

  const guestPostTextChange = (e) => {
    setGuestPostLifespan(e.target.value);
  }

  const lifespanAddTextChange = (e) => {
    setLikeLifespanAdd(e.target.value);
  }

  const renderEditableSettings = () => {
    // settings dont exist
    if (editableSettings.like_lifespan_add === undefined)
      return undefined;

    return (
      <Grid container spacing={0} style={customStyles.gridContainer}>
        <Grid item xs={12}>
          <Item>
            <Typography style={customStyles.header} variant="h4">Editable Settings</Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item style={customStyles.editableFieldsContainer}>
            <TextField fullWidth onChange={guestPostTextChange} value={guestPostLifespan} id="outlined-basic" label="Guest Post Lifespan" variant="outlined" style={customStyles.editableField}/>
            <TextField fullWidth onChange={userPostTextChange} value={userPostLifespan} id="outlined-basic" label="User Post Lifespan" variant="outlined" style={customStyles.editableField}/>
            <TextField fullWidth onChange={lifespanAddTextChange} value={likeLifespanAdd} id="outlined-basic" label="Like Lifespan Add" variant="outlined" style={customStyles.editableField}/>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item style={customStyles.editableFieldsContainer}>
            <Button style={customStyles.changeButton} variant="outlined" onClick={changeSettings}>Save Settings</Button>
          </Item>
        </Grid>
      </Grid>
    )
  }

  const banUserFieldTextChange = (e) => {
    setBanUser(e.target.value);
  }

  const banUser = () => {
    const endpointUrl = `${BACKEND_URL}/users/`;
    const bantime = new Date((new Date().setHours(new Date().getHours() + banTime*24))).toISOString();
    const formData = {username: banUserField, bantime}

    axios.patch(endpointUrl, formData).then(res => {
      if(res.status === 200) {
        alert("successfully banned user");
      }
    }).catch(err => {
      if (err.response.status) {
        // some issue
        alert(err.response.data);
      }
      console.log(err);
    });
  }

  const handleBanTimeChange = (e) => {
    setBantime(e.target.value);
  }

  const renderBanUser = () => {
    return (
      <Box>
        <Typography style={customStyles.header} variant="h4">Ban Users</Typography>
        <Box style={customStyles.editableFieldsContainer}>
          <TextField fullWidth onChange={banUserFieldTextChange} value={banUserField} id="outlined-basic" label="Ban User" variant="outlined" style={customStyles.banField}/>
          <Select labelId="BanTimeLabel" id="BanTime" label="Ban Time" value={banTime} onChange={handleBanTimeChange} style={customStyles.banTimeField}>
            <MenuItem value={0.25}>6 Hours</MenuItem>
            <MenuItem value={1}>1 Day</MenuItem>
            <MenuItem value={7}>1 Week</MenuItem>
            <MenuItem value={30}>1 Month</MenuItem>
            <MenuItem value={365}>1 Year</MenuItem>
            <MenuItem value={36500}>Permanent</MenuItem>
          </Select>
        </Box>
        <Button style={customStyles.changeButton} variant="outlined" onClick={banUser}>Ban</Button>
      </Box>
    )
  }

  return (
    <Box style={customStyles.container}>
      {renderEditableSettings()}
      {renderBanUser()}
    </Box>
  );
}

export default AdminPage;

