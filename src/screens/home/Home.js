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

    render() {
        return (
            <div>
                <Header/>
            </div>
        )
    }
}

export default Home;