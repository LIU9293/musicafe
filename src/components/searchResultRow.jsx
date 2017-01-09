import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Pagination, message } from 'antd';
import { searchSong } from '../redux/action/fetch';

const name = {
  qq: 'QQ音乐',
  netease: '网易云音乐',
  xiami: '虾米音乐'
}

const styles = {
  cell: {
    display: 'inline-block',
    marginTop: '10px',
    height: '140px',
    width: '140px',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    textAlign: 'center',
    overflow: 'hidden',
  },
  caption: {
    fontSize: '22px',
  },
  blur: {
    position: 'absolute',
    bottom: 0,
    width: '140px',
    left: 0,
    height: '50px',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
  },
  name: {
    color: '#fff',
    fontSize: '14px',
    marginTop: '6px',
    marginBottom: '2px',
  },
  artist: {
    color: '#bbb',
    fontSize: '12px',
  },
}

class SearchResultRow extends Component {

  constructor(){
    super();
    this.state = {
      pageIndex: 1
    };
    this.renderSongList = this.renderSongList.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    let width = document.getElementsByTagName('body')[0].offsetWidth;
    this.numOfSongs = width > 1327 ? 12 : 10;
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.searchKey !== this.props.searchKey){
      this.setState({
        pageIndex: 1
      })
    }
  }

  addSong(vendor, data){
    this.props.addSong({...data, vendor});
    if(this.props.playlistID === 0 && this.props.playStatus === 'stop'){
      this.props.updatePlayStatus('play');
    }
  }

  renderSongList(){
    const { vendor, type } = this.props;
    let data = this.props.data[type][vendor].songList.slice((this.state.pageIndex - 1)*this.numOfSongs, this.state.pageIndex*this.numOfSongs);
    return data.map((item, index) => {
      return (
        <div style={{
            ...styles.cell,
            backgroundImage: `url(${item.album.cover})`,
            marginLeft: '20px',
          }}
          key={index}
        >
          <div style={styles.blur}>
            <div style={styles.name}>{item.name}</div>
            <div style={styles.artist}>{item.artists.map(i => i.name).join(' & ')}</div>
          </div>
          <div
            onClick={() => {this.addSong(vendor, item)}}
            style={styles.addSongButton}
            className="addSongButton"
          >+</div>
        </div>
      )
    });
  }

  onPageChange(page){
    const { vendor, type } = this.props;
    if(this.props.data[type][vendor].songList.length < (page*this.numOfSongs)){
      searchSong(vendor, this.props.searchKey, this.numOfSongs, page)
        .then(res => {
          if(res.success){
            this.props.updateResult(vendor, type, {
              ...this.props.data[type][vendor],
              songList: this.props.data[type][vendor].songList.concat(res.songList)
            });
            this.setState({pageIndex: page})
          } else {
            message.error(`错误：${res.message}`);
          }
        })
        .catch(err => console.log(err))
    }
    this.setState({pageIndex: page})
  }

  render() {
    const { vendor, type } = this.props;
    let lists;
    if(type === 'song'){
      lists = this.renderSongList()
    }
    return (
      <div>
        <h1 className="title-primary" style={{marginLeft: '20px'}}>{name[this.props.vendor]}</h1>
        <Pagination
          simple
          defaultCurrent={1}
          total={this.props.data[type][vendor].total}
          onChange={(page) => {this.onPageChange(page)}}
          current={this.state.pageIndex}
        />
        {lists}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.searchResult,
    type: state.searchKey.type,
    searchKey: state.searchKey.key,
    playlistID: state.playStatus.playlistID,
    playStatus: state.playStatus.status
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    addSong: (song) => {dispatch({type: 'INSERT_ONE_SONG', playlistID: 0, song: song})},
    updateResult: (vendor, type, data) => {
      switch (type) {
        case 'song':
          dispatch({type: 'SEARCH_RESULT_UPDATE_SONG', data: data, vendor: vendor})
          break;
        case 'artist':
          dispatch({type: 'SEARCH_RESULT_UPDATE_ARTIST', data: data, vendor: vendor})
          break;
        case 'album':
          dispatch({type: 'SEARCH_RESULT_UPDATE_ALBUM', data: data, vendor: vendor})
          break;
        case 'playlist':
          dispatch({type: 'SEARCH_RESULT_UPDATE_PLAYLIST', data: data, vendor: vendor})
          break;
        default:
          return;
      }
    },
    updatePlayStatus: (status) => {
      dispatch({type: 'PLAY_STATUS_UPDATE_STATUS', status})
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchResultRow);
