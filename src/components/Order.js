import React from 'react';

import Card from '../components/Card';

function Order({ items, isLoading }) {
  const renderItems = () => {
    return (isLoading ? [...Array(4)] : items).map((item, index) => (
      <Card key={index} loading={isLoading} {...item} />
    ));
  };

  return <div className="wrapperCard">{renderItems()}</div>;
}

export default Order;
