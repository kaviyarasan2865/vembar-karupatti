'use client'
import React, { useEffect, useState } from 'react'
import { FiMail, FiUser, FiMessageSquare, FiCalendar, FiTrash, FiChevronDown, FiChevronRight } from 'react-icons/fi'

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMessage, setExpandedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/contact`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (expandedMessage === id) {
          setExpandedMessage(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const toggleMessage = (id) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen">
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Contact Messages</h1>
      </div>
      
      <div className="divide-y">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages found
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              {/* Message Preview */}
              <div 
                onClick={() => toggleMessage(message.id)}
                className={`px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer ${
                  expandedMessage === message.id ? 'bg-blue-50' : ''
                }`}
              >
               <span className="">
                <FiMail className="w-6 h-6 text-gray-400 mr-4" />
               </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900 truncate">
                      {message.name}
                    </span>
                   
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {message.message}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    
                <div className="w-8">
                  {expandedMessage === message.id ? (
                    <FiChevronDown className="text-gray-400" />
                  ) : (
                    <FiChevronRight className="text-gray-400" />
                  )}
                </div>
                <button
                  onClick={(e) => handleDelete(message.id, e)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete message"
                >
                  <FiTrash />
                </button>
              </div>

              {/* Expanded Message */}
              {expandedMessage === message.id && (
                <div className="px-14 py-6 bg-white border-t">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900">
                          {message.name}
                        </h3>
                        <a 
                          href={`mailto:${message.email}`} 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    
                    <div className="text-gray-800 whitespace-pre-wrap">
                      {message.message}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MessagesPage