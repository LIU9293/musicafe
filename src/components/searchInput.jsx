import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import api from '../redux/action/fetch';
import { notification, Select  } from 'antd';
const Option = Select.Option;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '300px',
  },
  searchInput: {
    backgroundColor: 'transparent',
    padding: '10px 10px 10px 80px',
    width: '250px',
    cursor: 'text',
    color: 'DarkSlateGray',
    border: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
    fontSize: '13px',
    textAlign: 'center',
  },
  select: {
    width: '80px',
    position: 'absolute',
    left: '0',
    border: 'none',
    top: '6px',
  }
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      xiamiDisabled: false,
      qqDisabled: false,
      neteaseDisabled: false,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onChangeSearchType = this.onChangeSearchType.bind(this);
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
      this.props.searchVendor.map(vendor => {
        api[`search${this.props.searchType}`](vendor, this.state.value, 12, 1)
          .then(res => {
              if(res.success){
                this.props.updateResult(vendor, this.props.searchType, res);
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

  onChangeSearchType(e){
    this.props.updateSearchType(e);
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
          <Select defaultValue="album" style={styles.select} onChange={this.onChangeSearchType}>
            <Option value="album">专辑</Option>
            <Option value="song">歌曲</Option>
            <Option value="playlist">歌单</Option>
          </Select>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    searchType: state.searchKey.type,
    searchVendor: state.searchKey.vendor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //update redux store => searchKey
    updateKey: (key) => {
      dispatch({type: 'SEARCH_KEY_UPDATE_KEY', key: key});
    },
    //update redux store => search type
    updateSearchType: (searchType) => {
      dispatch({type: 'SEARCH_KEY_UPDATE_TYPE', searchType});
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
