import React, {Component} from 'react';
import './Header.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from '@material-ui/core/Modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from "@material-ui/core/InputLabel";
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {MenuList} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link} from 'react-router-dom';

const TabContainer = function (props) {
    return (
        <Typography component="form" style={{padding: 0, textAlign: 'center'}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const styles = (theme => ({
    searchText: {
        'color': 'white',
        '&:after': {
            borderBottom: '2px solid white',
        }
    }
}))

class Header extends Component {

    setDefaultState() {
        this.setState({

            contactnumber: "",
            password: "",
            firstname: "",
            lastname: "",
            email: "",
            passwordReg: "",
            mobile: "",
            passwordRequired: "dispNone",
            contactNumberRequired: "dispNone",
            emailRequired: "dispNone",
            firstnameRequired: "dispNone",
            lastnameRequired: "dispNone",
            mobileRequired: "dispNone",
            passwordRegRequired: "dispNone",
            passwordMsg: "required",
            passwordRegMsg: "required",
            emailRegMsg: "required",
            mobileMsg: "required",
            contactNumberMsg: "required",
            signupError: "dispNone",
            signupErrorMsg: "",
            loginError: "dispNone",
            loginErrorMsg: "",
            snackBarOpen: false,
            snackBarMessage: "",
            registrationSuccess: false,
            transition: Fade,
        });
    }

    constructor() {
        super();

        this.state = {
            contactnumber: "",
            password: "",
            firstname: "",
            lastname: "",
            email: "",
            passwordReg: "",
            mobile: "",
            passwordRequired: "dispNone",
            contactNumberRequired: "dispNone",
            emailRequired: "dispNone",
            firstnameRequired: "dispNone",
            lastnameRequired: "dispNone",
            mobileRequired: "dispNone",
            passwordRegRequired: "dispNone",
            passwordMsg: "required",
            passwordRegMsg: "required",
            emailRegMsg: "required",
            mobileMsg: "required",
            contactNumberMsg: "required",
            signupError: "dispNone",
            signupErrorMsg: "",
            loginError: "dispNone",
            loginErrorMsg: "",
            snackBarOpen: false,
            snackBarMessage: "",
            registrationSuccess: false,
            transition: Fade,
            modalIsOpen: false,
            isMenuOpen:false,
            value: 0,
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true
        };
    }

    //method to handle when the modal is opened
    openModalHandler = () => {
        this.setDefaultState();
        this.setState({modalIsOpen: true});
    }

    //method to handle when the modal is closed
    closeModalHandler = () => {
        this.setState({modalIsOpen: false})
    }

    //method to handle the change in the tabs
    tabChangeHandler = (event, value) => {

        this.setState({
            ...this.state,
            value: value
        });

    }

    //method to handle any changes in the contact number  of the customer and updates state
    inputContactNumberChangeHandler = (e) => {
        this.setState({contactnumber: e.target.value})
    }

    //method to handle any changes in the password of the customer and updates state
    inputPasswordChangeHandler = (e) => {
        this.setState({password: e.target.value})
    }

    //method to handle any changes in the email of the customer and updates state
    inputEmailChangeHandler = (e) => {
        this.setState({email: e.target.value})

    }

    //method to handle any changes in the first name of the customer and updates state
    inputFirstnameChangeHandler = (e) => {
        this.setState({firstname: e.target.value})

    }

    //method to handle any changes in the last name  of the customer and updates state
    inputLastnameChangeHandler = (e) => {
        this.setState({lastname: e.target.value})

    }

    //method to handle any changes in the contact number of the customer during signup and updates state
    inputMobileChangeHandler = (e) => {
        this.setState({mobile: e.target.value})

    }

    //method to handle any changes in the password of the customer during signup and updates state
    inputPasswordRegChangeHandler = (e) => {
        this.setState({passwordReg: e.target.value})

    }

    //method to handle the snackbar close
    snackBarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        })
    }

    //method to handle when the login button is clicked
    loginClickHandler = () => {
        let contactnumber = this.state.contactnumber;
        contactnumber === "" ? this.setState({contactNumberRequired: "dispBlock"}) : this.setState({contactNumberRequired: "dispNone"});
        this.state.password === "" ? this.setState({passwordRequired: "dispBlock"}) : this.setState({passwordRequired: "dispNone"});

        if (contactnumber === "" || this.state.password === "") {
            return
        }

        if (contactnumber.length !== 10) {
            this.setState({contactNumberMsg: "Invalid Contact"})
            this.setState({contactNumberRequired: "dispBlock"})
            return;
        }

        let that = this;
        let dataLogin = null

        let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                let loginResponse = JSON.parse(xhrLogin.response);
                if (loginResponse.code === 'ATH-001' || loginResponse.code === 'ATH-002') {
                    that.setState({loginError: "dispBlock"});
                    that.setState({loginErrorMsg: loginResponse.message});
                } else {
                    sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
                    sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));
                    sessionStorage.setItem("customer-name", loginResponse.first_name);

                    that.setState({
                        loggedIn: true,
                        snackBarMessage: "Logged in successfully!",
                        snackBarOpen: true,
                    })
                    that.closeModalHandler();
                }
            }
        })

        xhrLogin.open("POST", this.props.baseUrl + "customer/login  ");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(contactnumber + ":" + this.state.password));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);

    }

    //method to handle when the signup button is clicked
    signUpClickHandler = () => {
        this.state.email === "" ? this.setState({emailRequired: "dispBlock"}) : this.setState({emailRequired: "dispNone"});
        this.state.firstname === "" ? this.setState({firstnameRequired: "dispBlock"}) : this.setState({firstnameRequired: "dispNone"});
        this.state.lastname === "" ? this.setState({lastnameRequired: "dispBlock"}) : this.setState({lastnameRequired: "dispNone"});
        this.state.mobile === "" ? this.setState({mobileRequired: "dispBlock"}) : this.setState({mobileRequired: "dispNone"});
        this.state.passwordReg === "" ? this.setState({passwordRegRequired: "dispBlock"}) : this.setState({passwordRegRequired: "dispNone"});

        if (this.state.email === "" || this.state.firstname === "" || this.state.lastname === "" || this.state.mobile === "" || this.state.passwordReg === "") {
            return;
        }

        let that = this;
        let dataSignUp = JSON.stringify({
            "email_address": this.state.email,
            "first_name": this.state.firstname,
            "last_name": this.state.lastname,
            "contact_number": this.state.mobile,
            "password": this.state.passwordReg
        })

        let xhrSignup = new XMLHttpRequest();
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (xhrSignup.status === 201) {
                    that.setState({
                        ...that.state,
                        value: 0,
                        snackBarMessage: "Registered successfully! Please login now!",
                        snackBarOpen: true,
                    })
                }
                if (xhrSignup.status === 400) { //checking if error to display the error message
                    let signupResponse = JSON.parse(this.response);

                    if (signupResponse.code === 'SGR-001') {
                        that.setState({signupError: "dispBlock"});
                        that.setState({signUpErrorMsg: signupResponse.message});
                    } else if (signupResponse.code === 'SGR-002') {
                        that.setState({emailRequired: "dispBlock"});
                        that.setState({emailRegMsg: "Invalid Email"});
                    } else if (signupResponse.code === 'SGR-003') {
                        that.setState({mobileRequired: "dispBlock"});
                        that.setState({mobileMsg: "Contact No. must contain only numbers and must be 10 digits long"});
                    } else if (signupResponse.code === 'SGR-004') {
                        that.setState({passwordRegRequired: "dispBlock"});
                        that.setState({passwordRegMsg: "Password must contain at least one capital letter, one small letter, one number, and one special character"});
                    }
                }
            }
        })

        xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignUp);

    }

    //method to handle when logout is clicked
    logoutHandler = () => {
        console.log(sessionStorage.getItem('access-token'));
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('access-token');
        sessionStorage.removeItem('customer-name');
        this.setState({
            loggedIn: false,
            isMenuOpen: false
        })

    }

    //method to handle when the profile button is clicked
    profileClickHandler = (event) => {
        this.state.anchorEl ? this.setState({anchorEl: null}) : this.setState({anchorEl: event.currentTarget});
        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        })
    };

    //method called when text is entered in search box which in turn calls the search method in home page
    searchHandler = (event) => {
        this.props.searchHandler(event);
    };

    render() {
        const {classes} = this.props;
        return (
            <div className="flex-container header">
                <div className="logo"><FastfoodIcon/></div>
                {this.props.showHeaderSearchBox != false ?
                    <div className="search">
                        <Input id="search"
                               className={classes.searchText}
                               fullWidth={true}
                               startAdornment={
                                   <InputAdornment position="start">
                                       <SearchIcon id="search-icon" htmlcolor={"white"}></SearchIcon>
                                   </InputAdornment>
                               }
                               onChange={this.searchHandler}
                               placeholder='Search by Restaurant Name' type="text" htmlcolor="white"/>
                    </div>
                    : ""
                }


                <div className="btn-header">
                    {this.state.loggedIn !== true ?

                        <Button size="medium" variant="contained" onClick={this.openModalHandler}>
                            <AccountCircle/>
                            LOGIN
                        </Button>
                        : <Button size="medium" variant="text" onClick={this.profileClickHandler}>
                            <AccountCircle htmlColor="#c2c2c2"/>
                            <span className="profile-name">{sessionStorage.getItem("customer-name")}</span>
                        </Button>

                    }
                </div>
                <Menu id="profile-menu"
                      anchorEl={this.state.anchorEl}
                      open={this.state.isMenuOpen}
                      onClose={this.profileClickHandler}>
                    <MenuList className="header-menu">
                        <MenuItem component={Link} to='/profile' disableGutters={false}>My Profile</MenuItem>
                        <MenuItem component={Link} to='/' onClick={this.logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>


                <Modal
                    open={this.state.modalIsOpen}
                    contentlabel="Login"
                    onClose={this.closeModalHandler}
                    className="login-modal">
                    <div className="login-modal-content">
                        <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                            <Tab label="Login"/>
                            <Tab label="Signup"/>
                        </Tabs>
                        {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required className="text-input">
                                <InputLabel htmlFor="contactnumber">Contact No.</InputLabel>
                                <Input id="contactnumber" onChange={this.inputContactNumberChangeHandler}

                                       value={this.state.contactnumber}/>
                                <FormHelperText className={this.state.contactNumberRequired}><span
                                    className="red">{this.state.contactNumberMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required className="text-input">
                                <InputLabel htmlFor="password"> Password </InputLabel>
                                <Input id="password" type="password" onChange={this.inputPasswordChangeHandler}
                                       value={this.state.password}/>
                                <FormHelperText className={this.state.passwordRequired}><span
                                    className="red">{this.state.passwordMsg}</span></FormHelperText>
                            </FormControl>
                            <br/>

                            <FormControl className="text-input">
                                <Typography variant="body2" color="error" className={this.state.loginError}
                                            align="left">{this.state.loginErrorMsg}</Typography>
                            </FormControl>
                            <br/>
                            <br/>
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>}
                        {this.state.value === 1 && <TabContainer>
                            <FormControl required className="text-input">
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" onChange={this.inputFirstnameChangeHandler}
                                       value={this.state.firstname}/>
                                <FormHelperText className={this.state.firstnameRequired}><span
                                    className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl className="text-input">
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" onChange={this.inputLastnameChangeHandler}
                                       value={this.state.lastname}/>
                            </FormControl><br/><br/>
                            <FormControl required className="text-input">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="email" onChange={this.inputEmailChangeHandler}
                                       value={this.state.email}/>
                                <FormHelperText className={this.state.emailRequired}><span
                                    className="red">{this.state.emailRegMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required className="text-input">
                                <InputLabel htmlFor="passwordReg">Password</InputLabel>
                                <Input type="password" id="passwordReg" onChange={this.inputPasswordRegChangeHandler}
                                       value={this.state.passwordReg}/>
                                <FormHelperText className={this.state.passwordRegRequired}><span
                                    className="red">{this.state.passwordRegMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required className="text-input">
                                <InputLabel htmlFor="mobile">Contact No.</InputLabel>
                                <Input id="mobile" onChange={this.inputMobileChangeHandler}
                                       value={this.state.mobile}/>
                                <FormHelperText className={this.state.mobileRequired}><span
                                    className="red">{this.state.mobileMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            {this.state.registrationSuccess === false &&
                            <FormControl className="text-input">
                                <Typography variant="body2" color="error" className={this.state.signupError}
                                            align="left">{this.state.signUpErrorMsg}</Typography>
                            </FormControl>}
                            <br/><br/>
                            <Button variant="contained" color="primary" onClick={this.signUpClickHandler}>
                                SIGNUP
                            </Button>
                        </TabContainer>}

                    </div>
                </Modal>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={4000}
                    onClose={this.snackBarClose}
                    TransitionComponent={this.state.transition}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackBarMessage}</span>}
                />

            </div>
        )
    }
}

export default withStyles(styles)(Header);