import React,{useState} from 'react';
import { toast } from 'react-hot-toast';

const Footer = () => {
  const [email,setEmail] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setEmail("");
      } else {
        // Display the specific error message from the server
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }
  

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-[#FEF3C7] text-black py-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#92400E] rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">CALL US</h3>
              <p className="text-sm">+919876692368, +919788131234</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-[#92400E] rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">STORE ADDRESS</h3>
              <p className="text-sm">NO26, North Bazar, Udangudi-628203, Thoothukudi-dist, Tamilnadu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#92400E] rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v6h-2.05a2.5 2.5 0 01-4.9 0H14V7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">FREE SHIPPING DOMESTIC CITIES</h3>
              <p className="text-sm">Free Shipping All Over India...</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#92400E] rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold">100% SECURE PAYMENT</h3>
              <p className="text-sm">100% money back guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#92400E] text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="font-bold mb-4">CUSTOM LINKS</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Custom Links</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">MY ACCOUNT</h3>
            <ul className="space-y-2">
              <li>My Account</li>
              <li>Order History</li>
              <li>Newsletter</li>
              <li>Gift Certificates</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2">
              <li>Contact</li>
              <li>Site Map</li>
              <li>Brands</li>
              <li>Unlimited Links</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">NEWSLETTER</h3>
            <p className="mb-4">Don&apos;t miss any updates or promotions by signing up to our newsletter.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded text-black flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white">
                SEND
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;