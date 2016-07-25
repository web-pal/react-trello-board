import React, { PropTypes } from 'react';
import Card from './Cards/Card';

const styles = {
  display: 'inline-block',
  transform: 'rotate(-7deg)',
  WebkitTransform: 'rotate(-7deg)'
};

const propTypes = {
  card: PropTypes.object
};

const CardDragPreview = (props) => (
  <div style={styles}>
    <Card item={props.card} />
  </div>
);

CardDragPreview.propTypes = propTypes;

export default CardDragPreview;
