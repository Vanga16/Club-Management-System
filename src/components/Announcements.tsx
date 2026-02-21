import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error fetching announcements');
      return;
    }

    setAnnouncements(data || []);
  }

  async function addAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast.error('You must be logged in to add announcements');
      return;
    }

    const { error } = await supabase.from('announcements').insert([
      {
        ...newAnnouncement,
        created_by: userData.user.id,
      },
    ]);

    if (error) {
      toast.error('Error adding announcement');
      return;
    }

    toast.success('Announcement added successfully');
    setIsAddingAnnouncement(false);
    setNewAnnouncement({ title: '', content: '' });
    fetchAnnouncements();
  }

  async function deleteAnnouncement(id: string) {
    const { error } = await supabase.from('announcements').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting announcement');
      return;
    }

    toast.success('Announcement deleted successfully');
    fetchAnnouncements();
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setIsAddingAnnouncement(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Bell className="w-4 h-4 mr-2" />
          Add Announcement
        </button>
      </div>

      {isAddingAnnouncement && (
        <form onSubmit={addAnnouncement} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                required
                value={newAnnouncement.content}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingAnnouncement(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">
                  {announcement.title}
                </h3>
                <div className="flex space-x-2">
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}