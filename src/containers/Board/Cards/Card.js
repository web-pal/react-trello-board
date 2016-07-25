import React, { PropTypes } from 'react';

const propTypes = {
  item: PropTypes.object.isRequired
};

const bJpg = require('../../../assets/images/b.jpg');
const galPng = require('../../../assets/images/gal.png');
const delPng = require('../../../assets/images/del.png');

const Card = (props) => (
  <div className="item">
    <div className="item-name">{props.item.title}</div>
    <div className="item-container">
      <div className="item-avatar-wrap"><img src={bJpg} alt="" /></div>
      <div className="item-content">
        <div className="item-author">{`${props.item.firstName} ${props.item.lastName}`}</div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero, blanditiis.</p>
      </div>
    </div>
    <div className="item-perfomers">
      <div className="add-perfomers">
        <a href="#"><img src={galPng} alt="Add perfomers" /></a>
        <div className="perfomer"><img src={bJpg} alt="Perfomer" /></div>
        <div className="perfomer"><img src={bJpg} alt="Perfomer" /></div>
        <div className="perfomer"><img src={bJpg} alt="Perfomer" /></div>
      </div>
      <div className="delete-perfomers">
        <a href="#"><img src={delPng} alt="Delete perfomers" /></a>
        <div className="perfomer"><img src={bJpg} alt="Perfomer" /></div>
      </div>
    </div>
  </div>
);

Card.propTypes = propTypes;

export default Card;
