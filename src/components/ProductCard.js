/* eslint-disable */
import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import { useSnackbar } from "notistack";

import "./ProductCard.css";

// const data = 
// {
// "name":"Tan Leatherette Weekender Duffle",
// "category":"Fashion",
// "cost":150,
// "rating":4,
// "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
// "_id":"PmInA797xJhMIPti"
// }


const ProductCard = ({ product, handleAddToCart, token, cartItems, allProducts }) => {


  return (
    <Card className="card">
      <CardMedia

        component="img"
        height="194"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>${product.cost}</b>
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions className={`card-foote`}>
        <Button className="button" variant="contained"
          onClick={() => handleAddToCart(
            token,
            cartItems,
            allProducts,
            product._id,
            1
          )
          }>
          <AddShoppingCartOutlined></AddShoppingCartOutlined>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
