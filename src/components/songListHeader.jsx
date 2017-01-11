import React, { Component } from 'react';

const styles = {
  row: {
    display: 'flex',
    width: '100%',
    height: '50px',
    alignItems: 'center',
    backgroundColor: '#fbfbfd',
  },
  name: {
    display: 'flex',
    flex: 12,
    paddingLeft: '15px',
  },
  album: {
    display: 'flex',
    flex: 8,
  },
  artist: {
    display: 'flex',
    flex: 6,
  },
  action: {
    display: 'flex',
    flex: 3,
  },
}

class SongListHeader extends Component{
  render(){
    return(
      <div style={styles.row}>
        <div style={styles.name}>
          曲目
        </div>
        <div style={styles.album}>
          专辑
        </div>
        <div style={styles.artist}>
          音乐人
        </div>
        <div style={styles.action}></div>
      </div>
    )
  }
}

export default SongListHeader;
