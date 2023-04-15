/* eslint-disable react-hooks/exhaustive-deps */
import { SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

import Searchbar from './search/search'

import Cart, { generateCartItemsFrom, getTotalCartValue } from './Cart'

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const [token, setToken] = useState('')

  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [noDataFound, setNoDataFound] = useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [debounceTimer, setDebounceTimer] = useState(null);

  const [cartData, setCartData] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState([])


  // Check if user is logged In
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true)
      setToken(localStorage.getItem('token'))
    }
  }, [localStorage])

  const showSnackBar = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant: variant,
      snackbarprops: 'data-role="alert"'

    })
  }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    const url = config.endpoint + '/products'
    axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          setProducts([...response.data])
          setAllProducts([...response.data])
        }
      })
      .catch((error) => {
        let msg = 'Something went wrong'
        showSnackBar(msg, 'error')

      })
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (result) => {

    if (result.success) {

      if (result.data.length === 0) {
        setNoDataFound(true)
      } else {
        setProducts(result.data)
        setNoDataFound(false)

      }

    } else {
      setNoDataFound(true)
      showSnackBar(result.error, 'error')
    }
  }


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


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    const options = {
      url: config.endpoint + '/cart',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      axios(options)
        .then((response) => {
          setCartData([...response.data])
        }).catch((error) => {
        })
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        showSnackBar('Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.', 'error')
      }
      return null;
    }
  };

  /* To Fetch All Products  */

  useEffect(() => {
    performAPICall()
  }, [])

  /* To Make Fetch Cart Data */

  useEffect(() => {
    fetchCart(token)
  }, [isLoggedIn])

  /* To Generate Items From Cart */

  useEffect(() => {
    const response = generateCartItemsFrom(cartData, allProducts)
    setCartItems([...response])
  }, [cartData])

  /* To Get Total Of Items Generated From Cart */

  useEffect(() => {
    setTotal(getTotalCartValue(cartItems))
  }, [cartItems])


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let response = items.find((item) => item._id === productId)
    if (response) {
      return true
    }
    return false
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token = '',
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if (token.length < 1) {
      showSnackBar('Login to add an item to the Cart', 'warning')
      return;
    }

    let checkIfItemInCart = isItemInCart(items, productId)

    if (checkIfItemInCart && (!options['add']&&!options['remove'])) {
      showSnackBar('Item already in cart. Use the cart sidebar to update quantity or remove item.', 'warning')
      return;
    }

    else {
      const axiosData = {
        url: config.endpoint + '/cart',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json'
        },
        data: {
          productId,
          qty
        }
      }

      if (options['add']) {
        if (axiosData.data.qty >= 1) {
          axiosData.data.qty = axiosData.data.qty + 1
        }
      }
      if (options['remove']) {
        if (axiosData.data.qty > 0) {
          axiosData.data.qty = axiosData.data.qty - 1
        }
      }


      try {
        axios(axiosData)
          .then((response) => {
            setCartData([...response.data])
            showSnackBar('Item Successfully Added To Cart', 'success')

          }).catch((error) => {
            showSnackBar(error.response, 'error')
          })
      } catch (err) {
        showSnackBar('Something Went Wrong', 'error')
      }

    }
  };


  const handleDelete = () => {

  }

  const handleAdd = (token, product, qty) => {

  }


  return (
    <div>
      <Header hasHiddenAuthButtons={true} showSearch={true} getSearchResultFromHeader={performSearch} >
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      </Header>

      {/* Search view for mobiles */}

      <Searchbar device="search-mobile" getSearchResultFromComponent={performSearch} />

      <Grid container>
        <Grid item className="product-grid" alignItems='stretch' sm={12} md={isLoggedIn ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          <Grid container>

            {
              products.length === 0 && !noDataFound &&
              <div className="loading">
                <CircularProgress
                  sx={{
                    color: '#45c09f'
                  }}
                />
                <h6 className="loading-text">Loading Products...</h6>
              </div>
            }

            {
              noDataFound &&

              <div className="loading">
                <SentimentDissatisfied />
                <h6 className="loading-text">No Products Found</h6>
              </div>
            }

            <Grid container >
              {products.length > 0 && !noDataFound &&
                products.map((product, key) => {
                  return <Grid item xs={6} md={3} key={product._id}
                  >
                    <ProductCard
                      product={product}
                      isLoggedIn={isLoggedIn}
                      token={token}
                      cartItems={cartItems}
                      allProducts={allProducts}
                      handleAddToCart={addToCart}
                    />
                  </Grid>
                })
              }
            </Grid>
          </Grid>



        </Grid>
        {
          isLoggedIn &&
          <Grid item sm={12} md={3}>
            <Cart
            items={cartItems}
            token={token}
            cartItems={cartItems}
            allProducts={allProducts}
            handleQuantity={addToCart}
             />
          </Grid>
        }

      </Grid>



      <Footer />
    </div >
  );
};
export default Products;
