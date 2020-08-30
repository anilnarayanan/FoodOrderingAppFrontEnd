import React, { Component } from "react";
import "./Details.css";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { FaStar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import Fade from "@material-ui/core/Fade";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

export default class Details extends Component {
  constructor() {
    super();
    this.state = {
      restaurantList: [],
      categoryList: [],
      cartList: [],
      totAmt: 0,
      snackBarState: false,
      snackBarMessage: "",
      transition: Fade,
      badgeVisible: false,
    };
  }

  componentDidMount() {
    let data = null;
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);

        let httpResponse = JSON.parse(xhr.responseText);
        let category;
        let categories = [];
        httpResponse.categories.forEach((category) => {
          categories.push(category.category_name);
        });
        category = httpResponse.categories;
        let restaurantDict = {
          id: httpResponse.id,
          photoUrl: httpResponse.photo_URL,
          name: httpResponse.restaurant_name,
          avgCost: httpResponse.average_price,
          rating: httpResponse.customer_rating,
          noOfCustomerRated: httpResponse.number_customers_rated,
          locality: httpResponse.address.locality,
          categories: categories.toString(),
        };
        that.setState({
          ...that.state,
          restaurantList: restaurantDict,
          categoryList: category,
        });
      }
    });
    xhr.open(
      "GET",
      this.props.baseUrl + "restaurant/" + this.props.match.params.id
    );
    xhr.send(data);
  }

  itemAddOnClickHandler = (item) => {
    let totAmount = 0;
    let cartItemsList = this.state.cartList;
    let itemsInCart = false;
    console.log(cartItemsList);
    cartItemsList.forEach((cartItem) => {
      if (cartItem.id === item.id) {
        itemsInCart = true;
        cartItem.quantity++;
        cartItem.totalAmount = cartItem.price * cartItem.quantity;
      }
    });
    if (!itemsInCart) {
      let cartItem = {
        id: item.id,
        itemType: item.item_type,
        name: item.item_name,
        price: item.price,
        quantity: 1,
        totalAmount: item.price,
      };
      cartItemsList.push(cartItem);
    }
    cartItemsList.forEach((cartItem) => {
      totAmount = totAmount + cartItem.totalAmount;
      console.log(totAmount);
    });
    this.setState({
      ...this.state,
      cartList: cartItemsList,
      snackBarState: true,
      snackBarMessage: "Item added to cart!",
      totAmt: totAmount,
    });
  };

  minusOnClickHandler = (item) => {
    let totAmount = 0;
    let cartItemsList = this.state.cartItems;
    let itemRemoved = false;
    let index = cartItemsList.indexOf(item);
    cartItemsList[index].quantity--;
    if (cartItemsList[index].quantity === 0) {
      cartItemsList.splice(index, 1);
      itemRemoved = true;
    } else {
      cartItemsList[index].totalAmount =
        cartItemsList[index].price * cartItemsList[index].quantity;
    }
    cartItemsList.forEach((cartItem) => {
      totAmount = totAmount + cartItem.totalAmount;
    });

    this.setState({
      ...this.state,
      cartItems: cartItemsList,
      snackBarState: true,
      snackBarMessage: itemRemoved
        ? "Item removed from cart!"
        : "Item quantity decreased by 1!",
      totalAmount: totAmount,
    });
  };

  cartAddOnClickHandler = (item) => {
    let cartItems = this.state.cartItems;
    let index = cartItems.indexOf(item);
    cartItems[index].quantity++;
    cartItems[index].totalAmount =
      cartItems[index].price * cartItems[index].quantity;
    let totAmount = 0;
    cartItems.forEach((cartItem) => {
      totAmount = totAmount + cartItem.totalAmount;
    });
    this.setState({
      ...this.state,
      cartItems: cartItems,
      snackBarState: true,
      snackBarMessage: "Item quantity increased by 1!",
      totAmount: totAmount,
    });
  };

  checkoutOnClickHandler = () => {
    let cartItems = this.state.cartItems;
    let isLoggedIn =
      sessionStorage.getItem("access-token") == null ? false : true;
    if (cartItems.length === 0) {
      this.setState({
        ...this.state,
        snackBarState: true,
        snackBarMessage: "Please add an item to your cart!",
      });
    } else if (!isLoggedIn) {
      this.setState({
        ...this.state,
        snackBarState: true,
        snackBarMessage: "Please login first!",
      });
    } else {
      this.props.history.push({
        pathname: "/checkout",
        cartItems: this.state.cartItems,
        restaurantDetails: this.state.restaurantDetails,
      });
    }
  };

  snackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      ...this.state,
      snackBarMessage: "",
      snackBarState: false,
    });
  };

  changeBadgeVisibility = () => {
    this.setState({
      ...this.state,
      badgeVisible: !this.state.badgeVisible,
    });
  };

  render() {
    const classes = this.props;
    return (
      <div>
        <div className="rest_list">
          <div>
            <img
              src={this.state.restaurantList.photoUrl}
              alt="Restaurant"
              height="215px"
              width="275px"
            />
          </div>
          <div className="rest_details">
            <div className="rest_name">
              <Typography variant="h5" component="h5" className="rest_name">
                {this.state.restaurantList.name}
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                className={classes.restaurantLocation}
              >
                {this.state.restaurantList.locality}
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                className="rest_cat"
              >
                {this.state.restaurantList.categoriesName}
              </Typography>
            </div>
            <div className="rest_rating_cost_parent">
              <div className="rest_rating_parent">
                <div className="rest_rating">
                  <FaStar />
                  <Typography variant="subtitle1" component="p">
                    {this.state.restaurantList.rating}
                  </Typography>
                </div>
                <Typography
                  variant="caption"
                  component="p"
                  className="text_rating_cost"
                >
                  AVERAGE RATING BY{" "}
                  {
                    <span className="rest_cust_rated">
                      {this.state.restaurantList.noOfCustomerRated}
                    </span>
                  }{" "}
                  CUSTOMERS
                </Typography>
              </div>
              <div className="rest_avgcost_parent">
                <div className="rest_avgcost">
                  <i className="fa fa-inr" aria-hidden="true"></i>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    className="avg_cost"
                  >
                    {this.state.restaurantList.avgCost}
                  </Typography>
                </div>
                <Typography
                  variant="caption"
                  component="p"
                  className="text_rating_cost"
                >
                  AVERAGE COST FOR TWO PEOPLE
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="menu_details_cart_parent">
          <div className="menu_details">
            {this.state.categoryList.map((category) => (
              <div key={category.id}>
                <Typography
                  variant="overline"
                  component="p"
                  className={classes.categoryName}
                >
                  {category.category_name}
                </Typography>
                <Divider />
                {category.item_list.map((item) => (
                  <div className="menu_item_parent" key={item.id}>
                    <FaCircle
                      color={
                        item.item_type === "NON_VEG" ? "#BE4A47" : "#5A9A5B"
                      }
                    />
                    &nbsp;&nbsp;
                    <Typography
                      variant="subtitle1"
                      component="p"
                      className="menu_item_name"
                    >
                      {item.item_name[0].toUpperCase() +
                        item.item_name.slice(1)}
                    </Typography>
                    <div className="item_price">
                      <i className="fa fa-inr" aria-hidden="true"></i>
                      <Typography
                        variant="subtitle1"
                        component="p"
                        className="item_price"
                      >
                        {item.price.toFixed(2)}
                      </Typography>
                    </div>
                    <IconButton
                      className="add_button"
                      aria-label="add"
                      onClick={() => this.itemAddOnClickHandler(item)}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="my_cart">
          <Card className={classes.myCart}>
            <CardHeader
              avatar={
                <Avatar aria-label="shopping-cart" className="shoppingCart">
                  <Badge
                    badgeContent={this.state.cartList.length}
                    color="primary"
                    showZero={true}
                    invisible={this.state.badgeVisible}
                    className={classes.badge}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </Avatar>
              }
              title="My Cart"
              titleTypographyProps={{
                variant: "h6",
              }}
              className="cartHeader"
            />
            <CardContent className="cardContent">
              {this.state.cartList.map((cartItem) => (
                <div className="cart_menu_item_name" key={cartItem.id}>
                  <i
                    className="fa fa-stop-circle-o"
                    aria-hidden="true"
                    style={{
                      color:
                        cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B",
                    }}
                  ></i>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    className="menu_item_name"
                    id="cart-menu-item-name"
                  >
                    {cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}
                  </Typography>
                  <div className="quantity_parent">
                    <IconButton
                      className={classes.cartItemButton}
                      id="minus_button"
                      aria-label="remove"
                      onClick={() => this.minusOnClickHandler(cartItem)}
                    >
                      <FaMinus />
                    </IconButton>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      className={classes.itemQuantity}
                    >
                      {cartItem.quantity}
                    </Typography>
                    <IconButton
                      className={classes.cartItemButton}
                      aria-label="add"
                      onClick={() => this.cartAddOnClickHandler(cartItem)}
                    >
                      <FaPlus />
                    </IconButton>
                  </div>
                  <div className="item_price">
                    <i
                      className="fa fa-inr"
                      aria-hidden="true"
                      style={{ color: "grey" }}
                    ></i>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      className="item_price"
                      id="cart_item_price"
                    >
                      {cartItem.totalAmount.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              ))}
              <div className="total_amt_parent">
                <Typography
                  variant="subtitle2"
                  component="p"
                  className="totalAmount"
                >
                  TOTAL AMOUNT
                </Typography>
                <div className="total_price">
                  <i className="fa fa-inr" aria-hidden="true"></i>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    className={classes.itemPrice}
                    id="cart_tot_price"
                  >
                    {this.state.totAmt.toFixed(2)}
                  </Typography>
                </div>
              </div>

              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                className="checkOutButton"
                onClick={this.checkoutOnClickHandler}
              >
                CHECKOUT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
