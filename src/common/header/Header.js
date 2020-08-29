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
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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

    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            contactnumber: "",
            contactNumberRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            email: "",
            firstname: "",
            lastname: "",
            mobile: "",
            passwordReg: "",
            emailRequired: "dispNone",
            firstnameRequired: "dispNone",
            lastnameRequired: "dispNone",
            mobileRequired: "dispNone",
            passwordRegRequired: "dispNone",
            registrationSuccess: false,
            passwordMsg: "required",
            passwordRegMsg: "required",
            emailRegMsg: "required",
            mobileMsg: "required",

            loggedIn: sessionStorage.getItem('access-token') == null ? false : true
        };

    }

    openModalHandler = () => {
        this.setState({modalIsOpen: true});
        console.log("hello");
        console.log(this.state.modalIsOpen);
    }

    closeModalHandler = () => {
        this.setState({modalIsOpen: false})
    }

    tabChangeHandler = (event, value) => {
        this.setState({value});
    }

    inputContactNumberChangeHandler = (e) => {
        this.setState({contactnumber: e.target.value})
    }

    inputPasswordChangeHandler = (e) => {
        this.setState({password: e.target.value})
    }


    inputEmailChangeHandler = (e) => {
        this.setState({email: e.target.value})

    }

    inputFirstnameChangeHandler = (e) => {
        this.setState({firstname: e.target.value})

    }

    inputLastnameChangeHandler = (e) => {
        this.setState({lastname: e.target.value})

    }

    inputMobileChangeHandler = (e) => {
        this.setState({mobile: e.target.value})

    }

    inputPasswordRegChangeHandler = (e) => {
        this.setState({passwordReg: e.target.value})

    }

    loginClickHandler = () => {
        this.state.contactnumber === "" ? this.setState({contactNumberRequired: "dispBlock"}) : this.setState({contactNumberRequired: "dispNone"});
        this.state.password === "" ? this.setState({passwordRequired: "dispBlock"}) : this.setState({passwordRequired: "dispNone"});

        if (this.state.contactnumber === "" || this.state.password === "") {
            return
        }

        let that = this;
        let dataLogin = null

        let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(xhrLogin.getResponseHeader('access-token'));

                sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
                sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));

                that.setState({loggedIn: true});
                that.closeModalHandler();
            }
        })


        xhrLogin.open("POST", this.props.baseUrl + "customer/login  ");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.contactnumber + ":" + this.state.password));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);

    }

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
                        that.setState({"signUpErrorMsg": signupResponse.message});
                    } else if (signupResponse.code === 'SGR-002') {
                        that.setState({emailRequired: "dispBlock"});
                        that.setState({emailRegMsg: "Invalid Email"});
                    } else if (signupResponse.code === 'SGR-003') {
                        that.setState({mobileRequired: "dispBlock"});
                        that.setState({mobileMsg: "Contact No. must contain only numbers and must be 10 digits long"});
                    } else if (signupResponse.code === 'SGR-004') {
                        that.setState({passwordRegRequired: "dispBlock"});
                        that.setState({passwordRegMsg: "Password must contain at least one capital letter, one small letter, one number, and one special character"});
                    } else {
                        that.setState({registrationSuccess: true});
                       // that.openMessageHandler();
                        that.closeModalHandler();
                    }
                }
            }
        })

        xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignUp);

    }

    logoutHandler = () => {
        console.log(sessionStorage.getItem('access-token'));
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('access-token');
        this.setState({loggedIn: false})

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
                                   <SearchIcon id="search-icon" htmlcolor={"white"}></SearchIcon>
                               </InputAdornment>
                           }
                           placeholder='Search by Restaurant Name' type="text" htmlcolor="white"/>
                </div>

                <Button size="medium" variant="contained" onClick={this.openModalHandler}>
                    <AccountCircle className="login-button-icon"/>
                    LOGIN
                </Button>

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
                            <FormControl required>
                                <InputLabel htmlFor="contactnumber">Contact No.</InputLabel>
                                <Input id="contactnumber" onChange={this.inputContactNumberChangeHandler}/>
                                <FormHelperText className={this.state.contactNumberRequired}><span
                                    className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required>
                                <InputLabel htmlFor="password"> Password </InputLabel>
                                <Input id="password" type="password" onChange={this.inputPasswordChangeHandler}/>
                                <FormHelperText className={this.state.passwordRequired}><span
                                    className="red">{this.state.passwordMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>}
                        {this.state.value === 1 && <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" onChange={this.inputFirstnameChangeHandler}/>
                                <FormHelperText className={this.state.firstnameRequired}><span
                                    className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" onChange={this.inputLastnameChangeHandler}/>
                            </FormControl><br/><br/>
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="email" onChange={this.inputEmailChangeHandler}/>
                                <FormHelperText className={this.state.emailRequired}><span
                                    className="red">{this.state.emailRegMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required aria-describedby="name-helper-text">
                                <InputLabel htmlFor="passwordReg">Password</InputLabel>
                                <Input type="password" id="passwordReg" onChange={this.inputPasswordRegChangeHandler}/>
                                <FormHelperText className={this.state.passwordRegRequired}><span
                                    className="red">{this.state.passwordRegMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            <FormControl required>
                                <InputLabel htmlFor="mobile">Contact No.</InputLabel>
                                <Input id="mobile" onChange={this.inputMobileChangeHandler}/>
                                <FormHelperText className={this.state.mobileRequired}><span
                                    className="red">{this.state.mobileMsg}</span></FormHelperText>
                            </FormControl><br/><br/>
                            {this.state.registrationSuccess === false &&
                            <FormControl>
                                <Typography variant="subtitle1" color="error" className={this.state.signupError}
                                            align="left">{this.state.signUpErrorMsg}</Typography>
                            </FormControl>}
                            <br/><br/>
                            <Button variant="contained" color="primary" onClick={this.signUpClickHandler}>
                                SIGNUP
                            </Button>
                        </TabContainer>}

                    </div>
                </Modal>
            </div>
        )
    }
}

export default withStyles(styles)(Header);