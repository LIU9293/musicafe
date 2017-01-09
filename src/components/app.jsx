import React, { Component } from 'react';
import Playlist from './playlist';
import Search from './searchInput';
import Player from './player';
import { defaultTheme } from '../lib/color';

const styles = {
  leftPanel: {
    backgroundColor: defaultTheme.leftPanelBg,
    color: defaultTheme.leftPanelText,
  }
}

class App extends Component {
  render(){
    return(
      <div className="app">
        <div
          className="leftPanel"
          style={styles.leftPanel}
        >
          <div className="logo"></div>
          <Playlist />
          <Player />
        </div>
        <div className="rightPanel">
          <div className="content">
            <Search />
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = App
