import React from 'react'
import { connect } from 'react-redux';
import {Icon} from 'antd';

const styles = {
  row: {
    height: '40px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 15px',
    color: 'white',
  },
  button: {
    height: '40px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'white',
  },
  right: {
    display: 'flex',
    flexDirection: 'row'
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  }
}

class PlaylistDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: 0,
    };
    this.deleteSong = this.deleteSong.bind(this);
    this.changeSong = this.changeSong.bind(this);
  }

  deleteSong(listID, songID, index){
    if(songID === this.props.playlist[this.props.playlistID].songs[this.props.currentIndex].id){
      /**
       * if we are deleting what we are listened
       * we must dispatch change song
       */
      if(this.props.currentIndex === (this.props.playlist[this.props.playlistID].songs.length - 1)){
        // current listening is the last song
        this.props.changeSong(listID, 0);
      } else {
        this.props.changeSong(listID, this.props.currentIndex);
      }
    }
    if(this.props.currentIndex > index){
      /**
       * if we are deleting what before we are playing
       * we must change the play index
       */
       this.props.changeSong(listID, this.props.currentIndex-1);
    }
    this.props.deleteSong(listID, songID);
  }

  changeSong(listId, songIndex){
    this.props.changeSong(listId, songIndex);
  }

  render () {
    const { data, id, playlist, playlistID, currentIndex, playStatus } = this.props;
    let list;
    list = data.map((item, index) => {
      if(!playlist[playlistID].songs[currentIndex]){
        return null
      }
      let songID = playlist[playlistID].songs[currentIndex].id, playing;
      if(songID === item.id && playStatus === 'play'){
        playing = <Icon style={{marginLeft: '5px', fontSize: '14px'}} type="smile-o" />;
      } else if (songID === item.id){
        playing = <Icon style={{marginLeft: '5px', fontSize: '14px'}} type="meh-o" />;
      } else {
        playing = null;
      }
      return (
        <div style={{...styles.row,
            borderTop: index === 0 ? '0px' : '1px solid rgba(200, 200, 200, 0.5)'
          }}
          key={index}
        >
          <div
            style={styles.left}
            onClick={() => this.changeSong(id, index)}
          >
            {`${index+1}. ${item.name} - ${item.artists.map(i => i.name).join('&')}`}
            {playing}
          </div>
          <div style={styles.right}>
            <div style={styles.button} className="deleteSongButton" onClick={() => this.deleteSong(id, item.id, index)}>
              <Icon type="close" />
            </div>
          </div>
        </div>
      )
    })
    return(
      <div style={styles.container}>
        {list}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    playlistID: state.playStatus.playlistID,
    playlist: state.playlist,
    currentIndex: state.playStatus.index,
    playStatus: state.playStatus.status,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSong: (playlistID, songID) => {
      dispatch({type: 'DELETE_ONE_SONG', playlistID, songID});
    },
    changeSong: (playlistID, songIndex) => {
      dispatch({type: 'PLAY_STATUS_UPDATE_INDEX', index: songIndex});
      dispatch({type: 'PLAY_STATUS_UPDATE_PLAYLIST_ID', playlistID});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetail);
