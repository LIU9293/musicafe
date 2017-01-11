import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import PlaylistDetail from './userPlaylistDetail';
const TabPane = Tabs.TabPane;

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      activeKey: '0',
    }
  }

  componentWillMount(){
    if(localStorage.getItem("playlist")){
      try{
        this.props.updateList(JSON.parse(localStorage.getItem("playlist")));
      }catch (e){
        console.log(e);
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.index !== this.props.index || nextProps.index === 0){
      this.setState({refresh: !this.state.refresh})
    }
    if(JSON.stringify(nextProps.playlist) !== JSON.stringify(this.props.playlist)){
      localStorage.setItem("playlist", JSON.stringify(nextProps.playlist));
    }
  }

  render(){
    let tabs = Object.keys(this.props.playlist).map(pane => {
      return(
        <TabPane tab={this.props.playlist[pane].name} key={pane}>
          <PlaylistDetail data={this.props.playlist[pane].songs} id={pane} />
        </TabPane>
      )
    })
    return (
      <Tabs
        style={{marginTop: '20px'}}
        onChange={this.onChange}
        activeKey={this.state.activeKey}
      >
        {tabs}
      </Tabs>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    playlist: state.playlist,
    index: state.playStatus.index,
    playlistID: state.playStatus.playlistID,
    songIndex: state.playStatus.index,
    playStatus: state.playStatus.status,
  }
}
const mapDispatchToProps = (dispatch) => {
  return{
    updateList: (playlist) => {
      dispatch({type: 'UPDATE_PLAYLIST', playlist})
    },
    deleteList: (playlistID) => {
      dispatch({type: 'DELETE_ONE_LIST', playlistID: playlistID});
      dispatch({type: 'PLAY_STATUS_RESET'})
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
