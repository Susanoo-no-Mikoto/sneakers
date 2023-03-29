import { FC } from 'react';

import Card from './Card';
import { Item } from '../App';

type OrderProps = {
  items: Item[];
  isLoading: boolean;
};

const Order: FC<OrderProps> = ({ items, isLoading }) => {
  const renderItems = () => {
    return (isLoading ? [...Array(4)] : items).map((item, index) => (
      <Card key={index} loading={isLoading} {...item} />
    ));
  };

  return <div className="wrapperCard">{renderItems()}</div>;
};

export default Order;
