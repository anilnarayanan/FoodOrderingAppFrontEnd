import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { red, grey } from "@material-ui/core/colors";
import ShareIcon from "@material-ui/icons/Share";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Collapse from "@material-ui/core/Collapse";
import "./Details.css";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    backgroundColor: grey,
  },
  media: {
    height: 215,
    paddingTop: "56.25%", // 16:9
    width: 151,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

class Details extends Component {
  constructor() {
    super();
    this.state = {
      restaurantList: [],
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
        let categories = [];
        httpResponse.categories.forEach((category) => {
          categories.push(category.category_name);
        });

        let restaurantList = {
          id: httpResponse.id,
          photoURL: httpResponse.photo_URL,
          name: httpResponse.restaurant_name,
          avgCost: httpResponse.average_price,
          rating: httpResponse.customer_rating,
          noOfCustomerRated: httpResponse.number_customers_rated,
          locality: httpResponse.address.locality,
          categoriesName: categories.toString(),
        };

        that.setState({
          ...that.state,
          restaurantList: restaurantList,
        });
      }
    });
    xhr.open(
      "GET",
      this.props.baseUrl + "restaurant/" + this.props.match.params.id
    );
    xhr.send(data);
  }

  render() {
    // const classes = useStyles();
    // const [expanded, setExpanded] = React.useState(false);

    // const handleExpandClick = () => {
    //   setExpanded(!expanded);
    // };
    const classes = this.props;
    return (
      <div>
      <div>
        {/* <Card>
          <CardContent className="root"> */}
        <div>
          <img
            src={this.state.restaurantList.photoURL}
            alt={this.state.restaurantList.photoURL}
            height="215px"
            width="275px"
          />
        </div>
        <div className="restaurant-details">
          <div className="restaurant-name">
            <Typography
              variant="h5"
              component="h5"
              className={classes.restaurantName}
            >
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
              className={classes.restaurantCategory}
            >
              {this.state.restaurantList.categoriesName}
            </Typography>
          </div>
          <div className="restaurant-rating-cost-container">
            <div className="restaurant-rating-container">
              <div className="restaurant-rating">
                {/* <FontAwesomeIcon icon="star" size="sm" color="black" /> */}
                <Typography variant="subtitle1" component="p">
                  {this.state.restaurantList.rating}
                </Typography>
              </div>
              <Typography
                variant="caption"
                component="p"
                className={classes.textRatingCost}
              >
                AVERAGE RATING BY{" "}
                {
                  <span className="restaurant-NoOfCustomerRated">
                    {this.state.restaurantList.noOfCustomerRated}
                  </span>
                }{" "}
                CUSTOMERS
              </Typography>
            </div>
            <div className="restaurant-avg-cost-container">
              <div className="restaurant-avg-cost">
                <i className="fa fa-inr" aria-hidden="true"></i>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.avgCost}
                >
                  {this.state.restaurantList.avgCost}
                </Typography>
              </div>
              <Typography
                variant="caption"
                component="p"
                className={classes.textRatingCost}
              >
                AVERAGE COST FOR TWO PEOPLE
              </Typography>
            </div>
          </div>
        </div>
        {/* </CardContent>
        </Card> */}
      </div>
      
      </div>
    );
  }
}

export default Details;
