import React, { Component } from 'react'
import { Howl } from 'howler';
import { connect } from 'react-redux';
import { getSongURL } from '../redux/action/fetch';
import { Icon, notification, Slider } from 'antd';
import Shuffle from 'react-icons/io/ios-shuffle-strong';

const styles = {
  buttonControl: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '40px',
    color: 'white',
    fontSize: '28px',
    padding: '0 20px',
    marginBottom: '10px',
  },
  slideControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '10px 15px',
  },
  songPosition: {
    color: '#fff',
    width: '67px',
    textAlign: 'right',
  },
  button: {
    height: '40px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  }
}

class Player extends Component{

  constructor(props){
    super(props);
    this.state = {
      volume: 0.5,
      url: null,
      songID: null,
      songLength: '--',
      songPosition: '--',
    };
    this.player = null;
    this.canNextSong = false;
    this.renderSong = this.renderSong.bind(this);
    this.next = this.next.bind(this);
    this.pause = this.pause.bind(this);
    this.getsongPosition = this.getsongPosition.bind(this);
    this.changeSongPosition = this.changeSongPosition.bind(this);
    this.changeSwitchType = this.changeSwitchType.bind(this);
  }

  componentWillMount(){
    if(localStorage.getItem('switchType') === 'random'){
      this.props.changeSwitchType('random');
    }
    if(localStorage.getItem('songIndex')){
      this.props.updateSongIndex(localStorage.getItem('songIndex'));
    }
  }

  componentWillReceiveProps(nextProps, nextState){
    let songs = nextProps.playlist[nextProps.playlistID].songs;
    if(!songs[nextProps.songIndex]){
      return
    }
    /**
     * once the next song id not equal current song id
     * delete the howler instance and render a new one
     */
    if(songs[nextProps.songIndex].id !== this.state.songID && nextProps.playStatus === 'play'){
      this.setState({songID: songs[nextProps.songIndex].id}, () => {
        localStorage.setItem('songIndex', nextProps.songIndex);
        this.renderSong(songs[nextProps.songIndex].vendor, songs[nextProps.songIndex].id, songs[nextProps.songIndex].album.id);
      });
    }
  }

  componentDidMount(){
    if(this.props.playStatus === 'play'){
      let songs = this.props.playlist[this.props.playlistID].songs;
      if(songs && songs.length > 0){
        this.renderSong(songs[this.props.songIndex].vendor, songs[this.props.songIndex].id, songs[this.props.songIndex].album.id);
      }
    }
  }

  renderSong(vendor, id, albumid){
    /**
     *  first delete the player instance in exist
     */
    if(this.player){
      this.setState({
        songLength: '--',
        songPosition: '--',
      })
      this.player.unload();
      this.player = null;
    }

    if(this.t){
      clearInterval(this.t);
    }

    getSongURL(vendor, id, albumid)
      .then(url => {
        this.setState({url}, () => {
          this.player = new Howl({
            src: url,
            html5: true,
            onend: this.next,
          });
          if(this.props.playStatus === "play"){
            this.player.play();
          }
          this.player.once('play', () => {
            let length = this.player.duration();
            this.setState({
              songLength: length
            });
            this.t = setInterval(this.getsongPosition, 1000);
          });
        });
      })
      .catch(err => {
        notification.open({
          message: '出错啦',
          description: err,
        });
        this.next();
      });
  }

  next(){
    let list = this.props.playlist[this.props.playlistID].songs;
    if(this.props.switchType === 'list'){
      if(list.length === this.props.songIndex + 1){
        this.props.updateSongIndex(0);
      } else {
        this.props.updateSongIndex(this.props.songIndex + 1);
      };
    }
    if(this.props.switchType === 'random'){
      if(list.length === 1){
        this.props.updateSongIndex(0);
        return
      }
      let indexs = list.map((item, index) => {return index}).filter(i => i !== this.props.songIndex);
      let nextIndex = indexs[Math.floor(Math.random()*indexs.length)];
      this.props.updateSongIndex(nextIndex);
    }
  }

  changeSwitchType(){
    const type = this.props.switchType === 'list' ? 'random' : 'list';
    this.props.changeSwitchType(type);
    if(localStorage){
      localStorage.setItem('switchType', type);
    }
  }

  pause(){
    const {playlist, playlistID} = this.props;
    if(playlist[playlistID].songs){
      if(playlist[playlistID].songs.length > 0){
        if(this.player){
          if(this.props.playStatus === 'pause'){
            this.player.play();
            this.props.updatePlayStatus('play');
          } else {
            this.player.pause();
            this.props.updatePlayStatus('pause');
          }
        } else {
          this.props.updatePlayStatus('play');
        }
      } else {
        notification.open({
          message: '歌单里面什么也没有哦~',
          description: '快往歌单里面添加歌曲吧!',
        });
      }
    }
  }

  formatTime(value){
    if(typeof(value) === 'string'){
      return value
    }
    let min = parseInt(value/60, 10);
    let sec = parseInt(value%60, 10);
    if(sec < 10){
      return `${min}:0${sec}`;
    } else {
      return `${min}:${sec}`;
    }
  }

  /**
   * once the user drag the slider,
   * clear the interval, set state of the drag value.
   */
  onChangeSongPosition(sec){
    if(this.t){
      clearInterval(this.t);
    }
    this.setState({
      songPosition: sec
    })
  }

  /**
   * once the user release drag of the slider
   */
  changeSongPosition(sec){
    if(this.player){
      this.player.seek(sec);
    }
    this.t = setInterval(this.getsongPosition, 1000);
  }

  getsongPosition(){
    this.setState({
      songPosition: this.player.seek()
    });
  }

  componentWillUnmount(){
    if(this.t){
      clearInterval(this.t);
    }
  }

  render(){
    return (
      <div className="audio-player">
        <div style={styles.slideControl}>
          <div style={{display: 'flex', flex: 1}}>
            <div style={{display: 'block', width: '100%', marginRight: '7px'}}>
              <Slider
                style={{width: '100%'}}
                defaultValue={0}
                max={typeof(this.state.songLength) === 'string' ? 1 : this.state.songLength}
                tipFormatter={(value) => this.formatTime(value)}
                onAfterChange={e => this.changeSongPosition(e)}
                value={typeof(this.state.songPosition) === 'string' ? 0 : this.state.songPosition}
                onChange={e => this.onChangeSongPosition(e)}
              />
            </div>
          </div>
          <div style={styles.songPosition}>
            {`${this.formatTime(this.state.songPosition)} / ${this.formatTime(this.state.songLength)}`}
          </div>
        </div>
        <div style={styles.buttonControl}>
          <div style={styles.button} onClick={this.changeSwitchType}>
            {
              this.props.switchType === 'list'
              ? <Icon type="retweet" />
              : <Shuffle />
            }
          </div>
          <div style={styles.button} onClick={this.pause}>
            {
              this.props.playStatus !== 'play'
              ? <Icon type='right' />
              : <Icon type='pause' />
            }
          </div>
          <div style={styles.button} onClick={this.next}>
            <Icon type="swap-right" />
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
    songIndex: state.playStatus.index,
    playStatus: state.playStatus.status,
    switchType: state.playStatus.switchType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePlayStatus: (status) => {
      dispatch({type: 'PLAY_STATUS_UPDATE_STATUS', status})
    },
    updateSongIndex: (index) => {
      dispatch({type: 'PLAY_STATUS_UPDATE_INDEX', index})
    },
    changeSwitchType: (type) => {
      dispatch({type: 'CHANGE_SWITCH_TYPE', switchType: type})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)
