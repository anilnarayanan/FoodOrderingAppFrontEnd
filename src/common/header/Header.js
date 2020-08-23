import React, {Component} from 'react';
import './Header.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import {withStyles} from '@material-ui/core/styles';


const styles = (theme => ({
    searchText: {
        'color': 'white',
        '&:after': {
            borderBottom: '2px solid white',
        }
    }
}))

class Header extends Component {

    constructor() {
        super();
        this.state = {
        };


    }

    render() {
        const {classes} = this.props;
        return (
            <div className="flex-container header">
                <div className="logo"><FastfoodIcon/></div>
                <div className="search">
                    <Input id="search"
                           className={classes.searchText}
                           fullWidth={true}
                           startAdornment={
                               <InputAdornment position="start">
                                   <SearchIcon id="search-icon" htmlColor="white"></SearchIcon>
                               </InputAdornment>
                           }
                           placeholder='Search by Restaurant Name' type="text" htmlColor="white"/>
                </div>

                <Button size="medium" variant="contained">
                    <AccountCircle className="login-button-icon"/>
                    LOGIN
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(Header);