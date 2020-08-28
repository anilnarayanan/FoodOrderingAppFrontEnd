import React, { Component } from "react";
import Header from "../../common/header/Header";
import "./Home.css";
import Details from "../details/Details";

class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <Header />
        <Details />
      </div>
    );
  }
}

export default Home;
