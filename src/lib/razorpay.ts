interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayInstance {
  open: () => void;
  // Add other Razorpay methods as needed
}

interface RazorpayResponse {
  // Define the properties based on the Razorpay response structure
  id: string;
  entity: string;
  amount: number;
  currency: string;
  // Add other relevant properties as needed
}

export function loadRazorpay(): Promise<RazorpayConstructor> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const w = window as unknown as Window & { Razorpay: RazorpayConstructor };
      resolve(w.Razorpay);
    };
    document.body.appendChild(script);
  });
}