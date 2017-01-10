import React from 'react';
import { connect } from 'react-redux';
import SearchResultRow from './searchResultRow';

const styles = {
  searchResult: {
    display: 'block',
    width: '100%',
  },
}

class SearchResult extends React.Component {
  render () {
    let rows = Object.keys(this.props.data[this.props.type]).map((item, index) => {
      return (
        <SearchResultRow vendor={item} type={this.props.type} key={index} />
      )
    })

    return(
      <div style={styles.searchResult}>
        {rows}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.searchResult
  }
}

export default connect(mapStateToProps)(SearchResult);
