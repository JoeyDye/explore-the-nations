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
    const { query } = this.state;
    return (
      <div>
        <SearchSection>
          <form role="search">
            <div>
              <Input
                id="search"
                onChange={e => this.searchLocation(e.target.value)}
                type="search"
                value={query}
              />
              <label htmlFor="search">Search Location</label>
            </div>
          </form>
        </SearchSection>
      </div>
    );
  }
}
