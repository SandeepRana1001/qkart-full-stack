import React, { useState } from 'react'
import { Search } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import axios from 'axios'
import { config } from "../../App";

const Searchbar = ({ device,getSearchResultFromComponent }) => {
    const [debounceTimer, setDebounceTimer] = useState(null);




    const getResponse = (value)=>{

        const url = config.endpoint+`/products/search?value=${value}`;
        const responseData = {
            success:false,
            data:[],
            hasError:false,
            error:''
        }

        axios.get(url)
        .then((response)=>{

            responseData['success'] = true
            responseData['data'] = response.data            
            getSearchResultFromComponent(responseData)
        })
        .catch((error)=>{
            if(error.response.status!==404){
                responseData['success'] = false
                responseData['data'] = []
                responseData['hasError'] = true         
                responseData.error = 'Something Went Wrong. Please Reload The Page'
                getSearchResultFromComponent(responseData)
            }else{
                responseData['success'] = true
                responseData['data'] = []
                getSearchResultFromComponent(responseData)
            }
        })
    }



      // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */


    const debounceSearch = (event, debounceTimeout) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer)
        }

        let value = event.target.value
        let timer;


        timer = setTimeout(() => {
            getResponse(value)
        }, 500)

        setDebounceTimer(timer)

    };


    return (
        <TextField
            className={device}
            autoComplete="off"
            onChange={(event) => debounceSearch(event, 1000)}
            size="small"
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Search color="primary" />
                    </InputAdornment>
                ),
            }}
            placeholder="Search for items/categories"
            name="search"
        />
    )

}

export default Searchbar