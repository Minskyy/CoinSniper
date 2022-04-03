import React, { Component } from 'react';
import Body from '../../Components/Body';
import Header from '../../Components/Header';
import NavBar from '../../Components/NavBar';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: '',
    };
  }

  componentDidMount() {
    const ethereum = window.ethereum;

    if (typeof ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
  }

  render() {
    return (
      <div className="App">
        <NavBar onClickConnectButton={this.handleOnClickConnect}></NavBar>
        <Header></Header>
        <Body></Body>
      </div>
    );
  }
}

export default HomePage;
