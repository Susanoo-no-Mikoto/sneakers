import React from 'react';

import Order from '../components/Order';

function Orders({ orders }) {
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="wrapperOrders">
        {orders.map((order, index) => (
          <>
            <h3>Заказ #{order.id}</h3>
            <Order key={index} {...order} />
          </>
        ))}
      </div>
    </div>
  );
}

export default Orders;
