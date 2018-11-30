import React, { Component } from 'react';
import { SearchSection, Input } from '../styles/searchStyles';

export default class Search extends Component {
  state = {
    query: ''
  };

  searchLocation = query => {
    this.setState({ query });
    this.props.getLocation(query);
  };

  render() {
    return (
      <div>
        <SearchSection>
          <Input
            onChange={e => this.searchLocation(e.target.value)}
            type="search"
            placeholder="Search Location"
            value={this.state.query}
          />
        </SearchSection>
      </div>
    );
  }
}
