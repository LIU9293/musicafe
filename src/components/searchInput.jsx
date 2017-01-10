import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { searchSong, searchAlbum, searchPlaylist } from '../redux/action/fetch';
import Checkbox from './checkbox';
import { notification } from 'antd';

const styles = {
  container: {
    marginTop: '40px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: 'transparent',
    padding: '10px',
    width: '100%',
    cursor: 'text',
    color: 'DarkSlateGray',
    border: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
    fontSize: '16px',
    textAlign: 'center',
    borderBottom: `solid 1px LightGrey`,
  },
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      searchVendor: ['xiami', 'qq', 'netease'],
      xiamiDisabled: false,
      qqDisabled: false,
      neteaseDisabled: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeVendor = this.changeVendor.bind(this);
  }

  handleInputChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  handleSearch(e) {
    e.preventDefault();
    if(this.state.value){
      this.props.updateKey(this.state.value);
      this.props.clearResult(this.props.searchType);
      this.state.searchVendor.map(i => {
        switch (this.props.searchType) {
          case 'song':
            searchSong(i, this.state.value, 12, 1)
              .then(res => {
                if(res.success){
                  this.props.updateResult(i, 'song', res)
                } else {
                  notification.open({
                    message: '出错啦',
                    description: res.message,
                  });
                }
              })
              .catch(err => {
                notification.open({
                  message: '出错啦',
                  description: err,
                });
              });
            break;
          case 'album':
            searchAlbum(i, this.state.value, 12, 1)
              .then(res => {
                if(res.success){
                  this.props.updateResult(i, 'album', res);
                } else {
                  notification.open({
                    message: '出错啦',
                    description: res.message,
                  });
                }
              })
              .catch(err => {
                notification.open({
                  message: '出错啦',
                  description: err,
                });
              });
            break;
          case 'playlist':
            searchPlaylist(i, this.state.value, 12, 1)
              .then(res => {
                if(res.success){
                  this.props.updateResult(i, 'playlist', res);
                } else {
                  notification.open({
                    message: '出错啦',
                    description: res.message,
                  });
                }
              })
              .catch(err => {
                notification.open({
                  message: '出错啦',
                  description: err,
                });
              });
            break;
          default:
            break;
        }
        return null;
      });
      browserHistory.push(`/search/${this.props.searchType}`);
    } else {
      notification.open({
        message: '出错啦',
        description: '请输入搜索内容！',
      });
    }
  }

  changeVendor(vendor, e){
    if(e){
      if(this.state.searchVendor.length === 1){
        // if only one left and check one, undisable all
        this.setState({
          xiamiDisabled: false,
          qqDisabled: false,
          neteaseDisabled: false,
        });
      }
      this.setState({
        searchVendor: this.state.searchVendor.concat([vendor])
      });
    } else {
      if(this.state.searchVendor.length === 2){
        // if only two left and uncheck one, disable another
        let another = [...this.state.searchVendor].filter(i => i !== vendor)[0];
        console.log(another + 'Disabled');
        this.setState({
          [another + 'Disabled']: true
        });
      }
      this.setState({
        searchVendor: this.state.searchVendor.filter(i => i !== vendor)
      });
    }
  }

  render() {
    return (
      <div className="search" style={styles.container}>
        <form onSubmit={this.handleSearch}>
          <input
            style={styles.searchInput}
            type="search"
            placeholder="搜索"
            value={this.state.value || ''}
            onChange={this.handleInputChange}
          />
        </form>
        <div style={{width: '400px', display: 'flex', flexDirection: 'row'}}>
            <Checkbox
              default={true}
              onCheck={(e) => this.changeVendor('netease', e)}
              disabled={this.state.neteaseDisabled}
            >
              网易云
            </Checkbox>
            <Checkbox
              default={true}
              onCheck={(e) => this.changeVendor('xiami', e)}
              disabled={this.state.xiamiDisabled}
            >
              虾米
            </Checkbox>
            <Checkbox
              default={true}
              onCheck={(e) => this.changeVendor('qq', e)}
              disabled={this.state.qqDisabled}
            >
              QQ音乐
            </Checkbox>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchType: state.searchKey.type
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //update redux store => searchKey
    updateKey: (key) => {
      dispatch({type: 'SEARCH_KEY_UPDATE_KEY', key: key});
    },
    //update search result date, store => searchResult
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
    clearResult: (t) => {
      dispatch({type: 'SEARCH_RESULT_CLEAR', t: t});
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
