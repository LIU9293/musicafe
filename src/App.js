import React from 'react';
import Heart from 'react-icons/fa/heart-o';

class App extends React.Component{
  render(){
    return(
      <div className="remove">
        <p className="hue">由于可能涉及到一些版权问题，musicafe已经下线，sorry~</p>
        <div className="hr" />
        <p className="hue">
          originally made with <Heart className="heart" /> on 
          <a style={{marginLeft: '5px'}} href="https://github.com/LIU9293/musicafe" target="_blank">
            github
          </a>
        </p>
      </div>
    )
  }
}

export default App;
