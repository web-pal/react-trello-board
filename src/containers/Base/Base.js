import React, { PropTypes } from 'react';

const propTypes = {
  children: PropTypes.element.isRequired
};


const BaseContainer = (props) => (
  <main>
    {props.children}
  </main>
);

BaseContainer.propTypes = propTypes;

export default BaseContainer;
