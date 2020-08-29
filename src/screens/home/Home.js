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
                <Header baseUrl={this.props.baseUrl} />
            </div>
        )
    }
}

export default Home;