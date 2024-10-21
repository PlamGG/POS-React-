import React from 'react';
import TransactionRecord from './TransactionRecord';

const BillingManagement = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Billing Management</h2>
      <TransactionRecord />
    </div>
  );
};

export default BillingManagement;