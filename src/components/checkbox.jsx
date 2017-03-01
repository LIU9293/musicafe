import React, { Component } from 'react';

class Checkbox extends Component{

  constructor(props){
    super(props);
    this.state = {
      checked: false,
    }
    this.check = this.check.bind(this);
  }

  componentWillMount(){
    if(this.props.default){
      this.setState({checked: true})
    }
  }

  check(){
    // if(!this.props.disabled){
    //   this.props.onCheck(!this.state.checked);
    //   this.setState({checked: !this.state.checked});
    // } else {
    //   notification.open({
    //     message: '最少需选择一个搜索内容~ 🔍'
    //   })
    // }
  }

  render(){
    const style = {
      borderRadius: '2px',
      transition: 'all 0.2s',
      border: 'solid 1px',
      borderColor: this.state.checked ? this.props.checkedColor : this.props.uncheckedColor,
      color: this.state.checked ? this.props.checkedColor : this.props.uncheckedColor,
      height: '28px',
      cursor: 'pointer',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '74px',
      marginLeft: '10px',
    };
    return(
      <div
        style={{...style, ...this.props.style}}
        onClick={this.check}
      >
        {this.props.children}
      </div>
    )
  }
}

Checkbox.defaultProps = {
  default: false,
  checkedColor: 'DarkSlateGrey',
  uncheckedColor: 'LightGray',
  onCheck: () => {},
  disabled: false,
}

module.exports = Checkbox
