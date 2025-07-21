'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from '@/lib/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminData<ContactMessage[]>('api/admin/contact');
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      await fetchAdminData(`api/admin/contact/${id}`, 'PUT', { isRead });
      setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, isRead } : msg)
      );
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await fetchAdminData(`api/admin/contact/${id}`, 'DELETE');
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <button
          onClick={fetchMessages}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No contact messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                message.isRead ? 'border-gray-300' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{message.name}</h3>
                  <p className="text-gray-600">{message.email}</p>
                  {message.phone && (
                    <p className="text-gray-600">{message.phone}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAsRead(message.id, !message.isRead)}
                    className={`px-3 py-1 rounded text-sm ${
                      message.isRead
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {message.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 