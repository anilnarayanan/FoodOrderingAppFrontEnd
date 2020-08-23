import React, {Component} from 'react';
import Header from '../../common/header/Header';
import './Home.css';


class Home extends Component {
    constructor() {
        super()
        this.state = {}
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