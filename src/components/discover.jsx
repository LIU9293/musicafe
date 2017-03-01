import React, {Component} from 'react';
import Loading from './loading';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Carousel, Pagination } from 'antd';
import suggestion from '../lib/suggestion';

const styles = {
  carouselBox: {
    display: 'block',
    width: '220px',
    margin: 'auto',
    marginBottom: '40px',
    cursor: 'pointer',
  },
  caouselTitle: {
    height: '70px',
    width: '220px',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    background: '#333',
    color: '#fff',
    flexDirection: 'column',
  },
  caouselTitleBlurCover: {
    zIndex: 0,
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(20px)',
    WebkitFilter: 'blur(20px)',
    opacity: 0.8,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'all 1s',
  },
  listContainer: {
    margin: '0px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  titleArea: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: '20px',
  },
  cell: {
    display: 'flex',
    margin: '10px 5px',
    height: '150px',
    width: '150px',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    textAlign: 'center',
  },
  blur: {
    position: 'absolute',
    bottom: 0,
    width: '150px',
    left: 0,
    height: '50px',
    color: '#fff',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}

class Dicover extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      carouselItems: null,
      suggestionItems: null,
      pageIndex: 1,
    };
    this.getSuggestion = this.getSuggestion.bind(this);
    this.renderCarousel = this.renderCarousel.bind(this);
    this.sliceList = this.sliceList.bind(this);
    this.pushToAlbumDetail = this.pushToAlbumDetail.bind(this);
    this.pushToPlaylistDetail = this.pushToPlaylistDetail.bind(this);
    let width = document.getElementsByTagName('body')[0].offsetWidth;
    this.numOfSongs = width > 1327 ? 12 : 10;
  }

  componentDidMount(){
    if(this.props.discoverData){
      this.setState(this.props.discoverData);
    } else {
      this.getSuggestion();
    }
  }

  getSuggestion(){
    /**
     * random some albums for the carousel
     */
    let albumItems = [...suggestion.album];
    let carouselItems = [];
    for(let i = 0; i < 9; i++){
      let randomItem = albumItems[Math.floor(Math.random()*(albumItems.length))];
      carouselItems.push(randomItem);
      albumItems = albumItems.filter(i => i.id !== randomItem.id);
    }
    console.log(carouselItems, albumItems);

    /**
     * combine other albums and playlist for the suggestion
     */
    albumItems = albumItems.map(i => {
      return {
        ...i,
        type: 'album',
      }
    });
    let playlistItems = suggestion.playlist.map(i => {
      return {
        ...i,
        type: 'playlist',
      }
    });
    this.setState({
      loaded: true,
      carouselItems,
      suggestionItems: [...albumItems, ...playlistItems],
    }, () => {
      this.props.transferDiscoverData(this.state);
    });
  }

  renderCarousel(){
    const { carouselItems } = this.state;
    let carouselList = carouselItems.map((item, index) => {
      return(
        <div key={index}>
          <div style={styles.carouselBox} onClick={e => this.pushToAlbumDetail(item)}>
            <img src={item.cover} alt={item.name} width={220} height={220} />
            <div style={styles.caouselTitle}>
              <div style={{...styles.caouselTitleBlurCover,
                backgroundImage: `url(${item.cover})`
              }}></div>
              <h3 className="ellipsis">{item.name}</h3>
              <h4 className="ellipsis">{item.artist}</h4>
            </div>
          </div>
        </div>
      )
    });
    return carouselList;
  }

  sliceList(array){
    return array.slice((this.state.pageIndex - 1)*this.numOfSongs, this.state.pageIndex*this.numOfSongs);
  }

  pushToAlbumDetail(item){
    browserHistory.push(`/album/${item.vendor}/${item.id}`);
  }

  pushToPlaylistDetail(item){
    this.props.transferPlaylistData(item.cover, item.name, item.id, item.author);
    browserHistory.push(`/playlist/${item.vendor}/${item.id}`);
  }

  renderSuggestion(){
    let { suggestionItems } = this.state;
    suggestionItems = this.sliceList(suggestionItems);
    let suggestionList = suggestionItems.map((item, index) => {
      return(
        <div style={{
            ...styles.cell,
            backgroundImage: `url(${item.cover})`,
            cursor: 'pointer',
          }}
          key={index}
          onClick={e => {
            if(item.type==='album'){
              this.pushToAlbumDetail(item);
            } else {
              this.pushToPlaylistDetail(item);
            }
          }}
        >
          <div style={styles.blur}>
            <div className="ellipsis" style={styles.name}>{item.name}</div>
            <div className="ellipsis" style={styles.artist}>{item.type === 'album' ? item.artist : item.author}</div>
          </div>
        </div>
      )
    });
    return suggestionList;
  }

  onPageChange(page){
    this.setState({
      pageIndex: page
    });
  }

  render() {
    if(this.state.loaded && this.state.carouselItems){
      let carouselList = this.renderCarousel();
      let suggestionList = this.renderSuggestion();
      return (
        <div style={{padding: '10px 20px 0 20px'}}>
          <Carousel
            autoplay={true}
            centerMode={true}
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={3}
          >
            {carouselList}
          </Carousel>
          <div style={styles.titleArea}>
            <h1 className="title-primary">
              编辑推荐
            </h1>
            <div style={{display: 'flex', marginBottom: '20px'}}>
              <Pagination
                simple
                defaultCurrent={1}
                total={this.state.suggestionItems.length}
                onChange={(page) => {this.onPageChange(page)}}
                current={this.state.pageIndex}
              />
            </div>
          </div>
          <div style={styles.listContainer}>
            {suggestionList}
          </div>
        </div>
      );
    }
    return <Loading />
  }
}

const mapStateToProps = (state) => {
  return {
    discoverData: state.dataTrans.discover
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    transferPlaylistData: (cover, title, id, author) => {
      dispatch({type: 'DATA_TRANS_PLAYLIST', cover, title, id, author});
    },
    transferDiscoverData: (discoverData) => {
      dispatch({type: 'DATA_TRANS_DISCOVER', discoverData})
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dicover);
