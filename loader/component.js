import React, { Component } from 'react';

import './style.scss';

/**
 * Loader spinner used for any API request
 */
const Loader = (props) => {
  const { isLoading } = props;
  return (<div className="loader-mask">
    <div className="loader"></div>
  </div>);
}

export default Loader;