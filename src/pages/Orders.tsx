import React from 'react';
import axios from 'axios';

import Order from '../components/Order';
import { Item } from '../App';

type OrderProps = {
  isLoading: boolean;
};
type OrderType = {
  items: Item[];
  id: number;
};

const Orders: React.FC<OrderProps> = ({ isLoading }) => {
  const [orders, setOrders] = React.useState<OrderType[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const dataOrders = await axios.get('https://json-server-delta-sable.vercel.app/api/orders');
        setOrders(dataOrders.data);
      } catch (error) {
        alert('Ошибка при запросе заказов');
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="wrapperOrders">
        {orders.map((order, index) => (
          <>
            <h3>Заказ #{order.id}</h3>
            <Order key={index} isLoading={isLoading} {...order} />
          </>
        ))}
      </div>
    </div>
  );
};

export default Orders;
