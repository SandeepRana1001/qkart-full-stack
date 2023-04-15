import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Link, useHistory } from 'react-router-dom'
import "./Register.css";

/* eslint-disable */

const Register = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
  })


  const handleFormData = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (event) => {
    event.preventDefault();

    if (!validateInput(formData))
      return;

    const url = `${config.endpoint}/auth/register`

    setLoading(true)

    axios.post(url,
      {
        name: formData.username,
        email: formData.email,
        password: formData.password
      }
    )
      .then(function (response) {
        setLoading(false)

        if (response.status === 201) {
          enqueueSnackbar('Registered successfully', {
            variant: 'success',
            snackbarprops: 'data-role="alert"'
          })
          history.push('/login')
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

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    let result = false, variant = 'error'
    let msg = ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Usage:


    if (formData.username.trim().length < 3) {
      msg = 'Name should be at least 3 characters'
      variant = 'error'
      result = false
    } else if (!emailRegex.test(formData.email)) {
      msg = 'Please provide a valid email'
      variant = 'error'
      result = false
    } else if (formData.password.trim().length < 6) {
      msg = 'Password required and should contain atleast 6 characters'
      variant = 'error'
      result = false
    } else if (formData.confirmPassword !== formData.password) {
      msg = 'Confirm Password do not match with Password'
      variant = 'error'
      result = false
    } else {
      msg = 'All Validation Passes'
      variant = 'success'
      result = true
    }
    if (!result) {
      enqueueSnackbar(msg, {
        variant: variant,
        snackbarprops: 'data-role="alert"'
      })
    }
    return result
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
        <Stack spacing={2} className="form" >
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Full Name"
            variant="outlined"
            title="Full Name"
            name="username"
            placeholder="Enter Name"
            fullWidth
            value={formData.username}
            onChange={handleFormData}
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            title="Email"
            name="email"
            placeholder="Enter Email"
            fullWidth
            value={formData.email}
            onChange={handleFormData}
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
            onChange={handleFormData}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmation}
            onChange={handleFormData}
          />

          {
            !loading &&
            <Button className="button" variant="contained" onClick={register} >
              Register Now
            </Button>
          }

          {loading &&
            <div className="text-center">
              <CircularProgress color="primary" />
            </div>
          }

          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
