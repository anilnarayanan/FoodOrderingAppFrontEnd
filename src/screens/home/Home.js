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
            xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant`);
            xhrRestaurants.send(dataRestaurants);

            this.updateCardsGridListCols();
        }

        componentDidMount(){
            window.addEventListener('resize', this.updateCardsGridListCols);
        }

        componentWillUnmount(){
            window.removeEventListener('resize', this.updateCardsGridListCols);
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
                xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant`);
            } else {
                xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant/name/${event.target.value}`);
            }
            xhrRestaurants.send(dataRestaurants);
        }




    render(){
        const { classes } = this.props;
        return (
            <div>
                <Header
                    showSearch="true"
                    searchHandler={this.searchHandler}
                />
            </div>
        );
    }
}
export default Home;