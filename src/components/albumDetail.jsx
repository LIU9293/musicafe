import React, { Component }  from 'react';
import { getalbum } from '../redux/action/fetch';
import { notification, Icon } from 'antd';
import SongListRow from './songListRow';
import SongListHeader from './songListHeader';
import { browserHistory } from 'react-router';
import Loading from './loading';

const styles = {
  top: {
    display: 'flex',
    width: '50px',
    height: '50px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '26px',
    marginBottom: '20px',
  },
  headArea: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  },
  albumInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: '30px',
  },
  titleText: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '30px',
  },
  description: {
    color: '#888',
    marginTop: '10px',
    fontSize: '16px',
  },
  list: {
    margin: '30px 0',
  }
};

class AlbumDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.params.id,
      vendor: this.props.params.vendor,
      loaded: false,
      data: null,
    };
  }
  componentDidMount(){
    if(this.state.vendor && this.state.id){
      getalbum(this.state.vendor, this.state.id)
        .then(res => {
          if(res.success){
            this.setState({
              loaded: true,
              data: res
            });
          } else {
            throw new Error(res.message);
          }
        })
        .catch(e => {
          notification.error({
            message: '出错啦',
            description: e
          });
        });
    } else {
      notification.error({
        message: '出错啦',
        description: '路由错误，请检查URL地址'
      });
    }
  }
  render(){
    if(this.state.loaded){
      const { data, vendor } = this.state;
      const songlist = data.songList.map((item, index) => {
        return(
          <SongListRow
            key={index}
            index={index}
            type={'album'}
            name={item.name}
            needPay={item.needPay}
            offline={item.offlineNow || false}
            artist={item.artists.map(i => i.name).join(' & ')}
            album={data.name}
            albumCover={data.cover}
            albumID={data.id}
            id={item.id}
            vendor={vendor}
            data={item}
          />
        );
      });
      return(
        <div style={{margin: '0px 20px 0px 20px'}}>
          <div style={styles.top} onClick={e => browserHistory.goBack()}>
            <Icon type="arrow-left" />
          </div>
          <div style={styles.headArea}>
            <img src={data.cover} alt={`${data.name}`} height={250} width={250} />
            <div style={styles.albumInfo}>
              <h1 style={styles.titleText}>{data.name}</h1>
              <h2 style={styles.description}>{`音乐人: ${data.artist.name}`}</h2>
              <h2 style={styles.description}>{`曲目数: ${data.songList.length}首`}</h2>
            </div>
          </div>
          <div style={styles.list}>
            <SongListHeader />
            {songlist}
          </div>
        </div>
      )
    }
    return(
      <Loading />
    );
  }
}

export default AlbumDetail;
