import React, { Component } from 'react';
import Playlist from './userPlaylist';
import Search from './searchInput';
import Player from './player';
import Footer from './footer';
import { connect } from 'react-redux';
import { defaultTheme } from '../lib/color';
import { browserHistory } from 'react-router';
const logo = require('../../public/logo.png');

const styles = {
  leftPanel: {
    backgroundColor: defaultTheme.leftPanelBg,
    color: defaultTheme.leftPanelText,
  },
  blurImage: {
    zIndex: -1,
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(90px)',
    WebkitFilter: 'blur(90px)',
    opacity: 0.6,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'all 1s',
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  slogan: {
    marginLeft: '10px',
  },
  navbar: {
    position: 'fixed',
    width: 'calc(100% - 320px)',
    marginLeft: '-20px',
    top: '0',
    padding: '20px 30px 20px 30px',
    zIndex: '99999',
    transition: 'all 0.2s',
    backgroundColor: '#fff',
  },
  navbarInner: {
    position: 'relative',
    maxWidth: '1000px',
    minWidth: '840px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}

class Layout extends Component {
  constructor(props){
    super(props);
    this.scroll = (e) => {
      if(document.body.scrollTop > 20){
        document.getElementById("navbar").className = "navbar_scroll";
      } else {
        document.getElementById("navbar").className = "";
      }
    }
  }
  componentDidMount(){
    window.addEventListener('scroll', this.scroll)
  }
  pushToStart(){
    browserHistory.push('/');
  }
  render(){
    const {playlist, playlistID, songIndex} = this.props;
    let cover;
    if(playlist[playlistID].songs[songIndex]){
      cover = playlist[playlistID].songs[songIndex].album.cover;
    }
    return(
      <div className="app">
        <div
          className="leftPanel"
          style={{...styles.leftPanel}}
        >
          {
            cover
            ? <div style={{
                  ...styles.blurImage,
                  backgroundImage: `url(${cover})`
                }}
              />
            : null
          }
          <div className="logo"></div>
          <div style={{display: 'flex', flex: 1}}>
            <Playlist />
          </div>
          <Player />
        </div>
        <div className="rightPanel">
          <div style={styles.navbar} id="navbar">
            <div style={styles.navbarInner}>
              <div style={styles.logo} onClick={this.pushToStart}>
                <img src={logo} alt={'logo'} width={60} height={60} />
                <h1 style={styles.slogan}>musicafe 音乐咖</h1>
              </div>
              <Search />
            </div>
          </div>
          <div className="content">
            {this.props.children}
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist,
    playlistID: state.playStatus.playlistID,
    songIndex: state.playStatus.index
  }
}

module.exports = connect(mapStateToProps)(Layout)
