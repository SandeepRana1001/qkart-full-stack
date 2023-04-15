import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Search from './search/search'

import "./Header.css";


import { CardHeader } from '@mui/material';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Header = ({ children, hasHiddenAuthButtons, showExplore = false, showSearch = false, getSearchResultFromHeader }) => {
  const history = useHistory()

  const backToProductPage = () => {
    history.push('/')
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {

    if (localStorage.getItem('username')) {
      setIsLoggedIn(true)
      setUsername(localStorage.getItem('username'))
    } else {
      setIsLoggedIn(false)
      setUsername('')

    }
  }, [isLoggedIn])


  const login = () => {
    history.push('/login')
  }

  const register = () => {
    history.push('/register')
  }

  const logout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('balance')
    setIsLoggedIn(false)
  }

  // const getSearchResultFromComponent  = (result)=>{
  //   getSearchResultFromHeader(result);
  // }

  return (
    <Box className="header">
      <Box className="header-title">
        <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Link>
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        {
          showSearch &&
          <Search device="search-desktop"
            getSearchResultFromComponent={getSearchResultFromHeader}
          />
        }
      </Stack>


      {
        showExplore &&
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={backToProductPage}
        >
          Back to explore
        </Button>
      }

      {
        isLoggedIn && hasHiddenAuthButtons &&
        <div className="center">

          <CardHeader
            avatar={
              <Avatar alt={username} src='avatar.png' />
            }
            title={username}
          />
          <Button variant="text" className="explore-button" onClick={logout}>LOGOUT</Button>
        </div>
      }

      {
        !isLoggedIn && hasHiddenAuthButtons &&
        <div className="center">

          <Button variant="text" className="explore-button" onClick={login}>LOGIN</Button>
          <Button className="button" variant="contained" onClick={register} >
            Register
          </Button>
        </div>
      }

    </Box>
  );
};

export default Header;
