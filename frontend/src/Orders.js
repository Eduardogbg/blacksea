import React from 'react';

function Orders({ orders }) {
  return (
    <div className="orders-section">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>Amount</th>
            <th>To</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.fromToken}</td>
              <td>{order.fromAmount}</td>
              <td>{order.toToken}</td>
              <td>{order.toAmount}</td>
              <td className={`status-${order.status.toLowerCase()}`}>
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
