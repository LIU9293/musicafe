import React, { Component } from 'react';
import { Router, Route, IndexRoute  } from 'react-router';
import Layout from './layout';
import NotFound from './404';
import Discover from './discover';
import SearchResult from './searchResult';
import AlbumDetail from './albumDetail';
import PlaylistDetail from './playlistDetail';

class Routes extends Component{
  render(){
    return(
      <Router history={this.props.history} >
        <Route path="/" component={Layout}>
          <IndexRoute component={Discover} />
          <Route path="/search/song" component={() => (<SearchResult type="song" />)} />
          <Route path="/search/album" component={() => (<SearchResult type="album" />)} />
          <Route path="/search/playlist" component={() => (<SearchResult type="playlist" />)} />
          <Route path="/album/:vendor/:id" component={AlbumDetail} />
          <Route path="/playlist/:vendor/:id" component={PlaylistDetail} />
        </Route>
        <Route path="*" component={NotFound} />
      </Router>
    )
  }
}

export default Routes
