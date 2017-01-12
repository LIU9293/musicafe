import React, { Component } from 'react';
import { Icon, notification } from 'antd';
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
    paddingRight: '10px',
    flexDirection: 'row',
    alignItems: 'center',
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
  payBadge: {
    display: 'inline',
    backgroundColor: 'LightCoral',
    color: '#fff',
    borderRadius: '3px',
    padding: '2px 6px',
    fontSize: '12px',
    marginLeft: '10px',
    minWidth: '60px',
  }
}
const name = {
  qq: 'QQ',
  netease: '网易',
  xiami: '虾米'
}

class SongListRow extends Component{
  constructor(props){
    super(props);
    this.state = {
      bgColor: this.props.index%2 === 0 ? '#fff' : '#fbfbfd'
    };
    this.addSong = this.addSong.bind(this);
    this.checkAddSong = this.checkAddSong.bind(this);
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
        message: '音乐咖还不支持网易付费歌曲哦~',
        description: '尝试其他搜索源试试？'
      });
      return;
    } else if (needPay){
      notification.warning({
        message: '您尝试添加了一首付费歌曲~',
        description: '音乐咖会尝试帮您加载!'
      });
    }
    this.addSong(vendor, data);
  }

  addSong(vendor, data){
    if(!data.artists && data.artist){
      data.artists = [...data.artist];
    }
    if(!data.album){
      data.album = {
        id: this.props.albumID,
        name: this.props.album,
      }
    }
    this.props.addSong({...data, vendor});
  }

  render(){
    return(
      <div style={{...styles.row, backgroundColor: this.state.bgColor}}>
        <div style={styles.name}>
          {`${this.props.index + 1}.  ${this.props.name || ''}`}
          {
            this.props.needPay && this.props.needPay !== false
            ? <div style={styles.payBadge}>{`${name[this.props.vendor]}付费`}</div>
            : null
          }
          {
            this.props.offline
            ? <div style={styles.payBadge}>{`${name[this.props.vendor]}已下线`}</div>
            : null
          }
        </div>
        <div style={styles.album}>
          {this.props.album || ''}
        </div>
        <div style={styles.artist}>
          {this.props.artist || ''}
        </div>
        {
          this.props.offline
          ? <div style={{...styles.action, cursor: 'default'}} />
          : <div style={styles.action} onClick={e => this.checkAddSong(this.props.vendor, this.props.data, this.props.needPay)}>
              <Icon type="plus" />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    playlist: state.playlist,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addSong: (song) => {dispatch({type: 'INSERT_ONE_SONG', playlistID: 0, song: song})},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SongListRow);
