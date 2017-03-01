import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Pagination, notification } from 'antd';
import api from '../redux/action/fetch';
import { browserHistory } from 'react-router';
const name = {
  qq: 'qq',
  netease: 'NET',
  xiami: 'XIA'
}

const styles = {
  cell: {
    display: 'flex',
    margin: '10px 5px',
    height: '150px',
    width: '150px',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    textAlign: 'center',
  },
  hr: {
    width: '80px',
    margin: '0 0 20px 20px',
    height: '1px',
    background: 'rgba(50, 50, 50, 0.5)',
  },
  caption: {
    fontSize: '22px',
  },
  blur: {
    position: 'absolute',
    bottom: 0,
    width: '150px',
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
  titleArea: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: '20px',
  },
  listContainer: {
    margin: '0px 10px 0px 10px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  payBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'LightCoral',
    color: '#fff',
    padding: '2px 6px',
    fontSize: '12px',
    minWidth: '60px',
  },
}

class SearchResultRow extends Component {

  constructor(){
    super();
    this.state = {
      pageIndex: 1
    };
    this.renderSongList = this.renderSongList.bind(this);
    this.renderAlbum = this.renderAlbum.bind(this);
    this.renderPlaylist = this.renderPlaylist.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    let width = document.getElementsByTagName('body')[0].offsetWidth;
    this.numOfSongs = width > 1327 ? 12 : 10;
    this.sliceList = this.sliceList.bind(this);
    this.checkAddSong = this.checkAddSong.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.searchKey !== this.props.searchKey){
      this.setState({
        pageIndex: 1
      });
    }
  }

  pushToAlbumDetail(vendor, id){
    browserHistory.push(`/album/${vendor}/${id}`);
  }

  pushToPlaylistDetail(vendor, id, title, cover, author){
    this.props.transferData(cover, title, id, author);
    browserHistory.push(`/playlist/${vendor}/${id}`);
  }

  checkAddSong(vendor, data, needPay){
    const { playlist } = this.props;
    const songs = playlist['0'].songs;
    for(let i = 0; i < songs.length; i++){
      if(songs[i].vendor === vendor && songs[i].id === data.id){
        notification.warning({
          message: '出错啦~',
          description: '歌单里面已经有这首歌了哦!'
        });
        return;
      }
    }
    if(needPay && vendor==='netease'){
      notification.warning({
        message: '音乐咖还搜不到这首歌~',
        description: '尝试其他搜索源试试？'
      });
      return;
    }
    this.addSong(vendor, data);
  }

  addSong(vendor, data){
    this.props.addSong({...data, vendor});
  }

  sliceList(array){
    return array.slice((this.state.pageIndex - 1)*this.numOfSongs, this.state.pageIndex*this.numOfSongs);
  }

  renderSongList(){
    const { vendor, type } = this.props;
    let data = this.sliceList(this.props.data[type][vendor].songList);
    return data.map((item, index) => {
      return (
        <div style={{
            ...styles.cell,
            backgroundImage: `url(${item.album.cover})`
          }}
          key={index}
        >
          {/*
            item.needPay
            ? <div style={styles.payBadge}>{`${badgeName[vendor]}付费`}</div>
            : null*/
          }
          <div style={styles.blur}>
            <div className="ellipsis" style={styles.name}>{item.name}</div>
            <div className="ellipsis" style={styles.artist}>{item.artists.map(i => i.name).join(' & ')}</div>
          </div>
          <div
            onClick={() => {this.checkAddSong(vendor, item, item.needPay)}}
            style={styles.addSongButton}
            className="addSongButton"
          >+</div>
        </div>
      );
    });
  }

  renderAlbum(){
    const { vendor, type } = this.props;
    let data = this.sliceList(this.props.data[type][vendor].albumList);
    return data.map((album, index) => {
      return (
        <div style={{
            ...styles.cell,
            backgroundImage: `url(${album.cover})`,
            cursor: 'pointer',
          }}
          key={index}
          onClick={e => this.pushToAlbumDetail(vendor, album.id)}
        >
          <div style={styles.blur}>
            <div className="ellipsis" style={styles.name}>{album.name}</div>
            <div className="ellipsis" style={styles.artist}>{album.artist.name}</div>
          </div>
        </div>
      )
    })
  }

  renderPlaylist(){
    const { vendor, type } = this.props;
    let data = this.sliceList(this.props.data[type][vendor].playlists);
    return data.map((playlist, index) => {
      return (
        <div style={{
            ...styles.cell,
            backgroundImage: `url(${playlist.cover})`,
            cursor: 'pointer',
          }}
          key={index}
          onClick={e => this.pushToPlaylistDetail(vendor, playlist.id, playlist.name, playlist.cover, playlist.author.name)}
        >
          <div style={styles.blur}>
            <div className="ellipsis" style={styles.name}>{playlist.name}</div>
            <div className="ellipsis" style={styles.artist}>{playlist.author.name}</div>
          </div>
        </div>
      )
    })
  }

  onPageChange(page){
    const { vendor, type } = this.props;
    const converName = {
      song: 'songList',
      album: 'albumList',
      playlist: 'playlists',
    };
    if(this.props.data[type][vendor][converName[type]].length < (page*this.numOfSongs)){
      let nextPage = this.props.data[type][vendor][converName[type]].length/12 + 1;
      api[`search${type}`](vendor, this.props.searchKey, 12, nextPage)
        .then(res => {
          if(res.success){
            this.props.updateResult(vendor, type, {
              ...this.props.data[type][vendor],
              [converName[type]]: this.props.data[type][vendor][converName[type]].concat(res[converName[type]])
            });
            this.setState({pageIndex: page});
          } else {
            throw res.message;
          }
        })
        .catch(err => {
          notification.error({
            message: '出错啦',
            description: err
          });
        });
    }
    this.setState({pageIndex: page});
  }

  render() {
    const { vendor, type } = this.props;
    let lists;
    if(type === 'song'){
      lists = this.renderSongList();
    }
    if(type === 'album'){
      lists = this.renderAlbum();
    }
    if(type === 'playlist'){
      lists = this.renderPlaylist();
    }
    return (
      <div style={{marginBottom: '50px'}}>
        <div style={styles.titleArea}>
          <h1 className="title-primary" style={{marginLeft: '20px'}}>
            {name[this.props.vendor]}
          </h1>
          <div style={{display: 'flex', marginBottom: '20px'}}>
            <Pagination
              simple
              defaultCurrent={1}
              total={this.props.data[type][vendor].total}
              onChange={(page) => {this.onPageChange(page)}}
              current={this.state.pageIndex}
            />
          </div>
        </div>
        <div style={styles.hr} />
        <div style={styles.listContainer}>
          {lists}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.searchResult,
    searchKey: state.searchKey.key,
    playlist: state.playlist,
    playlistID: state.playStatus.playlistID,
    playStatus: state.playStatus.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSong: (song) => {dispatch({type: 'INSERT_ONE_SONG', playlistID: 0, song: song})},
    updateResult: (vendor, type, data) => {
      switch (type) {
        case 'song':
          dispatch({type: 'SEARCH_RESULT_UPDATE_SONG', data: data, vendor: vendor});
          break;
        case 'artist':
          dispatch({type: 'SEARCH_RESULT_UPDATE_ARTIST', data: data, vendor: vendor});
          break;
        case 'album':
          dispatch({type: 'SEARCH_RESULT_UPDATE_ALBUM', data: data, vendor: vendor});
          break;
        case 'playlist':
          dispatch({type: 'SEARCH_RESULT_UPDATE_PLAYLIST', data: data, vendor: vendor});
          break;
        default:
          return;
      }
    },
    updatePlayStatus: (status) => {
      dispatch({type: 'PLAY_STATUS_UPDATE_STATUS', status});
    },
    transferData: (cover, title, id, author) => {
      dispatch({type: 'DATA_TRANS_PLAYLIST', cover, title, id, author});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultRow);
