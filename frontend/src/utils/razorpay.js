export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      return resolve(window.Razorpay);
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = (err) => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

export const RAZORPAY_KEY = 'rzp_test_owgbcWO6j2ha4V';