import React, { Component } from 'react';
import Playlist from './userPlaylist';
import Search from './searchInput';
import Player from './player';
import { connect } from 'react-redux';
import { defaultTheme } from '../lib/color';

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
  }
}

class Layout extends Component {
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
          <div className="content">
            <Search />
            {this.props.children}
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
