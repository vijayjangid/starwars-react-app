import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'

import './style.scss';
import SearchResult from './searchResult/component';
import SearchService from './service';

import Constants from '../helpers/constants';
import { SearchIcon } from '../helpers/components/icons';

import { ASYNC_START, ASYNC_END, LOGOUT, REDIRECT } from '../constants/actionTypes';

/**
 * Search screen, allowes user to search planets in type along fashion.
 * A normal user will be allowed maximum (15) search attempts per minute.
 * 
 * Search results are having diffrent font-size to denote their population.
 * 
 * if there are more than 10 results, it shows a "Load more" button in the footer to allow extend your search to multiple pages.
 * 
 * error:
 * Maximum search limit reached, please wait for {remainingTime} seconds
 */
const mapStateToProps = state => ({
  user: state.login.currentUser,
  isLoading: state.common.loading,
  redirectTo: state.common.redirectTo,
});

const mapDispatchToProps = dispatch => ({
  onLoadingStart: () => dispatch({ type: ASYNC_START }),
  onLoadingEnd: () => dispatch({ type: ASYNC_END }),
  onLogout: () =>
    dispatch({ type: LOGOUT }),
});
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      searchCounter: 0,
      maxSearchAllowed: 0,
      lastSearchedOn: null,
      query: '',
      results: [],
      page: 1,
      hasNextPage: false,
      total: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    const enableSearch = this.validateSearchAttempts();
    this.setState({ disabled: !enableSearch });
    const { user } = nextProps;
    if (user) {
      this.setState({ maxSearchAllowed: user.maxSearchAllowed });
    } else {
      this.props.onLogout();
      this.props.history.replace('/login');
    }
  }

  validateSearchAttempts = () => {
    const { maxSearchAllowed } = this.state;
    let { searchCounter, lastSearchedOn } = this.state;
    if (maxSearchAllowed == Constants.UNLIMITED) {
      return true;
    }

    if (Date.now() - lastSearchedOn >= 1 * 60 * 1000) {
      lastSearchedOn = Date.now();
      searchCounter = 0;
      this.setState({
        lastSearchedOn,
        searchCounter
      })
      return true;
    } else if (searchCounter >= maxSearchAllowed) {
      return false;
    }
    return true;
  }

  onSearch = ({ target: { value: query } }) => this.searchPlanets(query)

  searchPlanets = (query) => {
    let { page, results, hasNextPage } = this.state;
    const { onLoadingStart, onLoadingEnd } = this.props;
    if (this.state.query !== query) {
      page = 1;
      results = [];
    }
    const enableSearch = this.validateSearchAttempts();
    this.setState({ page, query, disabled: !enableSearch });

    if (enableSearch) {
      onLoadingStart();
      SearchService.get(query, page).then(res => {
        const { next, count } = res;
        const newResults = res.results;
        if (next != null && results.length < count) {
          page = page + 1;
          hasNextPage = true;
        } else {
          hasNextPage = false;
        }
        results = SearchService.sortByPopulation([...results, ...newResults]);
        this.setState(prevState => ({
          page,
          searchCounter: prevState.searchCounter + 1,
          lastSearchedOn: prevState.searchCounter == 0 ? Date.now() : prevState.lastSearchedOn,
          results,
          hasNextPage,
          total: count,
        }));
        onLoadingEnd();
      })
        .catch(error => {
          console.log(error);
          onLoadingEnd();
        });
    }
  }

  clear = () => this.setState({
    results: [],
    query: '',
    total: 0,
    hasNextPage: false
  });

  render() {
    const { results, query, disabled,
      lastSearchedOn, hasNextPage, total } = this.state;
    const remainingSeconds = parseInt(((lastSearchedOn + 1 * 60 * 1000) - Date.now()) / 1000);
    const maxPopulation = SearchService.getMaxPopulation(results);
    const activeClass = query.length ? 'active' : '';
    return (
      <div className="search-container">
        <div className="search-box">
          <div className={`search-icon ${activeClass}`}>
            <SearchIcon />
          </div>
          <input type="text" className="search" name="query" value={query} onChange={this.onSearch} placeholder="Start typing a planet's name..." />
          {disabled && (<p className="error">Maximum search limit reached, please wait for {remainingSeconds} seconds</p>)}
        </div>
        <ul className="results">
          {results.map(x => (<SearchResult key={x.name} data={x} maxPopulation={maxPopulation} />))}
          {(!results.length && query.length > 0) && (
            <li className="no-data">No matching planet found!</li>
          )}
          {(!results.length && !query.length) && (
            <li className="no-data">Let's discover a planet!</li>
          )}
        </ul>

        <div className="search-footer">
          {query.length > 0 && (
            <button className="button-clear" onClick={this.clear}>clear</button>
          )}
          {results.length > 0 && (<p>Showing {results.length} of total {total} records</p>)}
          {hasNextPage && (
            <button className="button-more" onClick={() => this.searchPlanets(query)}>Load more</button>)}

        </div>
      </div>
    );
  }
}

Search.contextTypes = {
  router: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));
