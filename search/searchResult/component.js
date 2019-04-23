import React, { Component } from 'react';
import classNames from 'classnames';

import './style.scss';

/**
 * Depicts one single item from search results.
 * on click of item, it expands and shows details. Another click will toggle the state.
 * item's header font size is varying depending on population size, as per below:
 * fontSize = (1 + (population / maxPopulation)) * 14 + 'px';
 */
class SearchResult extends Component {
  constructor() {
    super();
    this.state = {
      showDetails: false
    }
  }

  onSelect = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }
  render() {
    const { maxPopulation, data } = this.props;
    const { showDetails } = this.state;
    const itemClass = classNames('results-item', {
      'expanded': showDetails
    });
    const arrowClass = classNames('arrow', {
      'expanded': showDetails
    });
    const { name, population, diameter, gravity,
      climate, surface_water, terrain,
      rotation_period, orbital_period } = data;
    const minFontSize = 14;
    const fontSize = (1 + (population / maxPopulation)) * minFontSize + 'px';
    return (
      <li className={itemClass} onClick={this.onSelect}>
        <h3 className="results-title" style={{ fontSize }}>{name}</h3>
        <div className={arrowClass}></div>
        {showDetails && (
          <ul className="results-info">
            <li><div className="icon population" title="Population"></div><div className="value">{population}</div></li>
            <li><div className="icon size" title="Size (diameter)"></div><div className="value">{diameter}</div></li>
            <li><div className="icon gravity" title="Gravity"></div><div className="value">{gravity}</div></li>
            <li><div className="icon climate" title="Climate"></div><div className="value">{climate}</div></li>
            <li><div className="icon surface-water" title="Surface water"></div><div className="value">{surface_water}</div></li>
            <li><div className="icon terrain" title="Terrain"></div><div className="value">{terrain}</div></li>
            <li><div className="icon rotation-period" title="Rotation period"></div><div className="value">{rotation_period}</div></li>
            <li><div className="icon orbital-period" title="Orbital period"></div><div className="value">{orbital_period}</div></li>
          </ul>
        )}
      </li>);
  }
}

export default SearchResult;