import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionService } from '../services/subscription';
import { paymentService } from '../services/payment';
import { loadRazorpay } from '../utils/razorpay';

const Subscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('1-month');

  const plans = [
    { id: '1-month', name: '1 Month', price: 100, features: ['Ad-free listening', 'High quality audio'] },
    { id: '3-months', name: '3 Months', price: 250, features: ['All basic features', 'Save 17%'] },
    { id: '1-year', name: '1 Year', price: 900, features: ['All basic features', 'Save 25%'] }
  ];

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await subscriptionService.checkSubscriptionStatus(
          user._id, 
          localStorage.getItem('token')
        );
        setSubscription(response.data);
      } catch (err) {
        console.error('Subscription fetch error:', err);
        setError('Failed to fetch subscription status');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handlePayment = async (plan) => {
    try {
      setLoading(true);
      setError('');
      
      // 1. Load Razorpay script
      const Razorpay = await loadRazorpay();
      if (!Razorpay) {
        throw new Error('Failed to load Razorpay');
      }
      
      // 2. Create order on backend
      const orderResponse = await paymentService.createRazorpayOrder(
        plan.price, 
        localStorage.getItem('token')
      );
      
      if (!orderResponse.data?.id) {
        throw new Error('Invalid order response from server');
      }

      // 3. Setup payment options
      const options = {
        key: 'rzp_test_owgbcWO6j2ha4V', // Using direct key
        amount: orderResponse.data.amount,
        currency: 'INR',
        name: 'Music App',
        description: plan.name,
        order_id: orderResponse.data.id,
        handler: async (response) => {
          try {
            console.log('Razorpay payment response:', response);
            
            // Verify payment on backend
            await paymentService.capturePayment({
              paymentId: response.razorpay_payment_id,
              amount: plan.price,
              subscriptionPlan: plan.id,
              paymentMethod: 'razorpay'
            }, localStorage.getItem('token'));
            
            // Create subscription record
            await subscriptionService.createSubscription({
              userId: user._id,
              planType: plan.id,
              amount: plan.price,
              transactionId: response.razorpay_payment_id
            }, localStorage.getItem('token'));
            
            // Refresh subscription status
            const updatedSub = await subscriptionService.checkSubscriptionStatus(
              user._id,
              localStorage.getItem('token')
            );
            setSubscription(updatedSub.data);
            
            alert('Payment successful! Your subscription is now active.');
          } catch (err) {
            console.error('Payment processing error:', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: user.phone || '' // Add if available
        },
        notes: {
          userId: user._id,
          plan: plan.id
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          }
        }
      };

      console.log('Razorpay options:', options);
      
      // 4. Open payment modal
      const rzp = new Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
      });
      
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionService.cancelSubscription(
        subscription._id, 
        localStorage.getItem('token')
      );
      setSubscription({ ...subscription, status: 'cancelled' });
      alert('Subscription cancelled successfully');
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {subscription?.active ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Current Subscription</h2>
          <p className="mb-1">Plan: {subscription.planType}</p>
          <p className="mb-1">Status: {subscription.status}</p>
          <p className="mb-1">Expires on: {new Date(subscription.expiryDate).toLocaleDateString()}</p>
          <button
            onClick={cancelSubscription}
            disabled={subscription.status === 'cancelled' || loading}
            className={`mt-4 py-2 px-4 rounded text-white ${
              subscription.status === 'cancelled' 
                ? 'bg-gray-400' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loading ? 'Processing...' : 
             subscription.status === 'cancelled' ? 'Subscription Cancelled' : 'Cancel Subscription'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-2xl font-bold mb-4">₹{plan.price}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;