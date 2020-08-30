import React, {Component} from 'react';
import Header from '../../common/header/Header';
import './Home.css';
import 'font-awesome/css/font-awesome.min.css';
import GridList from '@material-ui/core/GridList';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import GridListTile from '@material-ui/core/GridListTile';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class Home extends Component {
    constructor() {
        super()
        this.state = {
            restaurants: [],
            cards: 0
        }
    }

    componentWillMount(){
            // Intialize the cart
            sessionStorage.removeItem('customer-cart');
            // get restaurants from api
            let dataRestaurants = null;
            let xhrRestaurants = new XMLHttpRequest();
            xhrRestaurants.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    this.setState({
                        restaurants: JSON.parse(this.responseText).restaurants
                    })
                }
            })
            xhrRestaurants.open('GET', this.props.baseUrl + 'restaurant');
            xhrRestaurants.send(dataRestaurants);

            this.updateCardsGridListCols();
        }

        updateCardsGridListCols = () => {
            if (window.innerWidth >= 1300) {
                this.setState({ cards: 4 });
                return;
            }

            if (window.innerWidth >= 1000) {
                this.setState({ cards: 3 });
                return;
            }

            this.setState({ cards: 2 });
        }
        componentDidMount() {
            window.addEventListener('resize', this.updateCardsGridListCols);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.updateCardsGridListCols);
        }

        restaurantCardTileOnClickHandler = (restaurantId) => {
            this.props.history.push('/restaurant/' + restaurantId);
        }

        searchHandler = (event) => {
            let that = this;
            let dataRestaurants = null;
            let xhrRestaurants = new XMLHttpRequest();
            xhrRestaurants.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    if (!JSON.parse(this.responseText).restaurants) {
                        that.setState({
                            restaurants: null,
                        })
                    } else {
                        that.setState({
                            restaurants: JSON.parse(this.responseText).restaurants,
                        })
                    }
                }
            })
            if (event.target.value === ''){
                xhrRestaurants.open('GET', this.props.baseUrl+ 'restaurant');
            } else {
                xhrRestaurants.open('GET', this.props.baseUrl+ 'restaurant/name/'+ event.target.value);
            }
            xhrRestaurants.send(dataRestaurants);
        }




    render(){
        return (
            <div>
                <Header
                    showSearch={true}
                    searchHandler={this.searchHandler}
                />
                {this.state.restaurants === null ?
                    <Typography className='null-Restaurant' variant='h6'>
                        No restaurant with the given name.
                    </Typography>
                    :
                    <GridList
                        className='restaurant-GridList'
                        cols={this.state.cards}
                        cellHeight='auto'
                    >
                        {this.state.restaurants.map(restaurant => (
                            <GridListTile
                                onClick={() => this.restaurantCardTileOnClickHandler(restaurant.id)}
                                key={'restaurant' + restaurant.id}
                            >
                                <Card className='restaurent-Card' style={{ textDecoration: 'none' }}>
                                    <CardMedia
                                        className='restaurent-CardMedia'
                                        image={restaurant.photo_URL}
                                        title={restaurant.restaurant_name}
                                    />
                                    <CardContent className='cardContent'>
                                        <Typography className='restaurantName' gutterBottom variant='h5' component='h2'>
                                            {restaurant.restaurant_name}
                                        </Typography>
                                        <Typography variant='subtitle1' className='categories'>
                                            {restaurant.categories}
                                        </Typography>
                                        <div className='restaurant-RateSlab'>
                                            <div className='restaurant-Rate'>
                                                <i className="fa fa-star" aria-hidden="true"> </i>
                                                {restaurant.customer_rating}({restaurant.number_customers_rated})
                                            </div>
                                            <div>
                                                <i className="fa fa-inr" aria-hidden="true">
                                                    <span>{restaurant.average_price} for two</span> </i>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </GridListTile>
                        ))}
                    </GridList>
                }
            </div>
        );
    }
}
export default Home;