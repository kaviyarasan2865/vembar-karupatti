import React from 'react';

const ContactForm = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">Contact Us</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6">
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                    transition-colors placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                    transition-colors placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                    transition-colors placeholder-gray-400"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    rows={6}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                    resize-none transition-colors placeholder-gray-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 text-white font-medium 
                rounded-md hover:bg-orange-600 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="relative h-[500px] rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1969460138376!2d-122.084!3d37.422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDI1JzE5LjIiTiAxMjLCsDA1JzAyLjQiVw!5e0!3m2!1sen!2sus!4v1234567890"
            className="w-full h-full rounded-lg"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;