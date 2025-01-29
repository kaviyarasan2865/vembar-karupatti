'use client'
import React, { useEffect, useState } from 'react'
import { FiMail, FiMessageSquare, FiCalendar, FiTrash } from 'react-icons/fi'

// Add interface at the top after imports
interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isViewed: boolean;
  createdAt: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== id));
        if (selectedMessage === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const toggleMessage = async (messageId: string) => {
    setSelectedMessage(selectedMessage === messageId ? null : messageId);
    
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isViewed: true })
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      const updatedMessage = await response.json();
      console.log('Response from server:', updatedMessage);

      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === messageId ? { ...msg, isViewed: true } : msg
        )
      );
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const markAsUnread = async (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation(); // Prevent message expansion
    
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isViewed: false }),
      });

      if (response.ok) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg._id === messageId ? { ...msg, isViewed: false } : msg
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark message as unread:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
        <div className="text-sm text-gray-600">
          {messages.filter(msg => !msg.isViewed).length} unread messages
        </div>
      </div>
      
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages found
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200
                ${!message.isViewed ? 'border-l-4 border-blue-500 bg-blue-50' : ''}
                ${selectedMessage === message._id ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div 
                onClick={() => toggleMessage(message._id)}
                className="p-6 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg ${!message.isViewed ? 'font-bold' : 'font-medium'} text-gray-800`}>
                        {message.name}
                      </h3>
                      {!message.isViewed && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${!message.isViewed ? 'font-medium text-gray-800' : 'text-gray-600'} line-clamp-2`}>
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <time className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                    {message.isViewed && (
                      <button
                        onClick={(e) => markAsUnread(e, message._id)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Mark as unread"
                      >
                        <FiMail className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(message._id, e)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete message"
                    >
                      <FiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {selectedMessage === message._id && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FiMail className="text-gray-400" />
                      <a 
                        href={`mailto:${message.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FiMessageSquare className="text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-gray-400" />
                      <time className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPage;