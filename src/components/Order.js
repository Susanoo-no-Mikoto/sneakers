import React from 'react';

import Card from '../components/Card';

function Order({ items }) {
  return (
    <div className="wrapperCard">
      {items.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
}

export default Order;
