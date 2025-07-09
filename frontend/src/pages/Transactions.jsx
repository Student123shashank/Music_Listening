import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transaction';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionService.getUserTransactions(localStorage.getItem('token'));
        setTransactions(response.data.transactions);
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Transactions</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn) => (
                <tr key={txn._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.transactionId.slice(0, 8)}...</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{txn.paymentAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.subscriptionPlan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      txn.transactionStatus === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {txn.transactionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;