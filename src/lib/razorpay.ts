import Razorpay from 'razorpay';

interface RazorpayOptions {
  key_id: string;
  key_secret: string;
}

const initializeRazorpay = (options: RazorpayOptions): Razorpay => {
  return new Razorpay({
    key_id: options.key_id,
    key_secret: options.key_secret,
  });
};

export default initializeRazorpay;