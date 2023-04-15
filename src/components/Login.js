import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory()

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const handleInput = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async () => {
    const isValid = validateInput(formData)

    if (!isValid) {
      return;
    }
    setLoading(true)

    const url = config.endpoint + '/auth/login'
    console.log(url)
    axios.post(url,
      {
        email: formData.email,
        password: formData.password
      }
    )
      .then(async (response) => {

        setLoading(false)

        if (response.status === 200) {
          enqueueSnackbar('Logged in successfully', {
            variant: 'success',
            snackbarprops: 'data-role="alert"'
          })
          persistLogin(response.data.token, response.data.username, response.data.balance)
          history.push('/')
        }
      })
      .catch(function (error) {

        setLoading(false)

        let msg = 'Something went wrong'
        try {
          const responseStatus = error.response.status
          if (responseStatus === 400) {
            msg = error.response.data.message
          }
        } catch (err) {
          msg = 'Something went wrong'
        }
        enqueueSnackbar(msg, {
          variant: 'error',
          snackbarprops: 'data-role="alert"'
        })
      });


  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {

    let msg = ''
    let response = false

    if (data.email.trim().length < 1) {
      msg = 'Email is required';
      response = false
    } else if (data.password.trim().length < 1) {
      msg = 'password is required'
      response = false
    } else {
      response = true
    }

    if (!response) {
      enqueueSnackbar(msg, {
        variant: 'error',
        snackbarprops: 'data-role="alert"'
      })
    }

    return response

  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, email, balance) => {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    localStorage.setItem('balance', balance)
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={false} showExplore={true} />
      <Box className="content">
        <Stack spacing={2} className="form">

          <h2 className="title">Login</h2>
          <TextField
            id="email"
            label="Email Address"
            variant="outlined"
            title="Email Address"
            name="email"
            placeholder="Enter Email Address"
            fullWidth
            value={formData.username}
            onChange={handleInput}
          />

          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleInput}
          />

          {
            !loading &&
            <Button className="button" variant="contained" onClick={login} >
              Login to Qkart
            </Button>
          }

          {
            loading &&
            <div className="text-center">
              <CircularProgress color="primary" />
            </div>
          }

          <p className="secondary-action">
            Don't have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>

        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
