import React, { Component } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';

const styles = {
  row: {
    display: 'flex',
    width: '100%',
    height: '50px',
    alignItems: 'center',
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
    justifyContent: 'center',
    cursor: 'pointer',
    flex: 3,
  },
}

class SongListRow extends Component{
  constructor(props){
    super(props);
    this.state = {
      bgColor: this.props.index%2 === 0 ? '#fff' : '#fbfbfd'
    };
    this.addSong = this.addSong.bind(this);
  }
  addSong(vendor, data){
    if(!data.artists && data.artist){
      data.artists = [...data.artist];
    }
    this.props.addSong({...data, vendor})
  }
  render(){
    return(
      <div style={{...styles.row, backgroundColor: this.state.bgColor}}>
        <div style={styles.name}>
          {`${this.props.index + 1}.  ${this.props.name || ''}`}
        </div>
        <div style={styles.album}>
          {this.props.album || ''}
        </div>
        <div style={styles.artist}>
          {this.props.artist || ''}
        </div>
        <div style={styles.action} onClick={e => this.addSong(this.props.vendor, this.props.data)}>
          <Icon type="plus" />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addSong: (song) => {dispatch({type: 'INSERT_ONE_SONG', playlistID: 0, song: song})},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SongListRow);
