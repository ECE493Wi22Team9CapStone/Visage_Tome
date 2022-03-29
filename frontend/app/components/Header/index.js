import React, {useRef, useState} from 'react';

import NavBar from './NavBar';
import Grid from "@mui/material/Grid";
import Item from "../ListItem/Item";
import Button from "@mui/material/Button";
import {Modal, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import HeaderLink from "./HeaderLink";
import {FormattedMessage} from "react-intl";
import messages from "./messages";
import {BACKEND_URL} from "../../utils/constants";
import axios from "axios";

function Header() {
  const customStyles = {
    container: {
      // width: "100%",
      // backgroundColor: "green"
    },
    borderLine: {
      borderBottom: "1px solid black"
    },
    title: {
      paddingLeft: "30px"
    },
    login: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "20px",
    },
    authButtons: {
      width: "100%",
      height: "90%",
    },
    modalContainer: {
      position: 'absolute',
      padding: "20px 20px",
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: "calc(768px + 16px * 2)",
      width: "90%",
      backgroundColor: 'white',
      border: '2px solid #000',
      boxShadow: 24,
    },
    authFields: {
      justifyContent: 'center',
    }
  }

  const [isOpenLogin, setLoginModal] = useState(false);
  const [isOpenSignup, setSignupModal] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedInUsername, setLoggedInUsername] = useState(localStorage.getItem('username'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const backendUrl = `${BACKEND_URL}/users/`;

  const unauthComponent = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button style={customStyles.authButtons} variant="outlined" onClick={openLogin}>Login</Button>
        </Grid>
        <Grid item xs={6}>
          <Button style={customStyles.authButtons} variant="outlined" onClick={openSignup}>Signup</Button>
        </Grid>
      </Grid>
    )
  }



  const openLogin = () => {
    setLoginModal(true);
    setErrorMessage('');
  }

  const closeLogin = () => {
    setLoginModal(false);
  }

  const openSignup = () => {
    setSignupModal(true);
    setErrorMessage('');
  }

  const closeSignup = () => {
    setSignupModal(false);
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem('admin');
    setToken('');
    setLoggedInUsername('');
    window.dispatchEvent(new Event("storage"));
  }

  const authComponent = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="body1">{loggedInUsername}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Button style={customStyles.authButtons} variant="outlined" onClick={logout}>Logout</Button>
        </Grid>
      </Grid>
    )
  }


  const signup = () => {
    let usernameCheck = true;
    let passwordCheck = true;
    if (username.length < 3 || !username.trim()) {
      usernameCheck = false;
    }

    if (password.length < 8 || !password.trim()) {
      passwordCheck = false;
    }

    if (usernameCheck != true && passwordCheck != true) {
      setErrorMessage("Username must be at least 3 characters, Password must be at least 8 characters");
      setUsername('');
      setPassword('');
      return;
    } else if (usernameCheck != true ) {
      setErrorMessage("Username must be at least 3 characters");
      setUsername('');
      return;
    } else if (passwordCheck != true) {
      setErrorMessage("Password must be at least 8 characters");
      setPassword('');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("password does not match");
      setConfirmPassword('');
      return;
    }

    const formData = {username, password};
    axios.post(backendUrl + 'signup', formData).then(res => {

      console.log(res);
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        localStorage.setItem("username", username);
        setLoggedInUsername(username);
        closeSignup()
      }
    }).catch(err => {
      if (err.response.status) {
        // some issue
        setErrorMessage(err.response.data);
      }
      console.log(err);
    });
  }

  const signupModal = () => {
    return (<Modal open={isOpenSignup} onClose={closeSignup}>
      <Box style={customStyles.modalContainer}>
        <Typography align="center" variant="h4">Signup for Visage Tome</Typography>
        <Grid container spacing={2} style={{marginTop: "20px"}}>
          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Item style={customStyles.authFields}>
              <TextField fullWidth onChange={e => setUsername(e.target.value)} id="outlined-basic" label="Username" variant="outlined" />
            </Item>
          </Grid>
          <Grid item xs={0.5}/>

          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Item style={customStyles.authFields}>
              <TextField fullWidth onChange={e => setPassword(e.target.value)}  type="password" id="outlined-basic" label="Password" variant="outlined" />
            </Item>
          </Grid>
          <Grid item xs={0.5}/>

          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Item style={customStyles.authFields}>
              <TextField fullWidth onChange={e => setConfirmPassword(e.target.value)}  type="password" id="outlined-basic" label="Verify Password" variant="outlined" />
            </Item>
          </Grid>
          <Grid item xs={0.5}/>

          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Button style={customStyles.authButtons} variant="outlined" onClick={signup}>Signup</Button>
          </Grid>
          <Grid item xs={0.5}/>
        </Grid>
        <Box height="10px"/>
        {errorMessage && <Typography align="center" variant="body1">{errorMessage}</Typography>}
      </Box>
    </Modal>)
  }

  const login = () => {
    const formData = {username, password};
    axios.post(backendUrl, formData).then(res => {

      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        localStorage.setItem("username", username);
        setLoggedInUsername(username);
        localStorage.setItem("admin", res.data.admin);
        window.dispatchEvent(new Event("storage"));
        closeLogin();
      }
    }).catch(err => {
      if (err.response.status) {
        // some issue
        setErrorMessage(err.response.data);
      }
      console.log(err);
    });
  }

  const loginModal = () => {
    return (<Modal open={isOpenLogin} onClose={closeLogin}>
      <Box style={customStyles.modalContainer}>
        <Typography align="center" variant="h4">Login to Visage Tome</Typography>
        <Grid container spacing={2} style={{marginTop: "20px"}}>
          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Item style={customStyles.authFields}>
              <TextField fullWidth onChange={e => setUsername(e.target.value)} id="outlined-basic" label="Username" variant="outlined" />
            </Item>
          </Grid>
          <Grid item xs={0.5}/>

          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Item style={customStyles.authFields}>
              <TextField fullWidth onChange={e => setPassword(e.target.value)}  type="password" id="outlined-basic" label="Password" variant="outlined" />
            </Item>
          </Grid>
          <Grid item xs={0.5}/>

          <Grid item xs={0.5}/>
          <Grid item xs={11}>
            <Button style={customStyles.authButtons} variant="outlined" onClick={login}>Login</Button>
          </Grid>
          <Grid item xs={0.5}/>
        </Grid>
        <Box height="10px"/>
        {errorMessage && <Typography align="center" variant="body1">{errorMessage}</Typography>}
      </Box>
    </Modal>)
  }

  return (
    <div style={customStyles.container}>
      <NavBar>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Item style={customStyles.title}>
              <h1>Visage Tome</h1>
            </Item>
          </Grid>
          <Grid item xs={5}>
            <Item style={customStyles.login}>
              {token ? authComponent() : unauthComponent()}
            </Item>
          </Grid>
        </Grid>
        <Box style={customStyles.borderLine}/>
        <HeaderLink to="/">
          <FormattedMessage {...messages.home} />
        </HeaderLink>
        <HeaderLink to="/create">
          <FormattedMessage {...messages.create} />
        </HeaderLink>
      </NavBar>
      {loginModal()}
      {signupModal()}
    </div>
  );
}

export default Header;
