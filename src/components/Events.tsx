import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      toast.error('Error fetching events');
      return;
    }

    setEvents(data || []);
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast.error('You must be logged in to add events');
      return;
    }

    const { error } = await supabase.from('events').insert([
      {
        ...newEvent,
        created_by: userData.user.id,
      },
    ]);

    if (error) {
      toast.error('Error adding event');
      return;
    }

    toast.success('Event added successfully');
    setIsAddingEvent(false);
    setNewEvent({ title: '', description: '', date: '', location: '' });
    fetchEvents();
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      toast.error('Error deleting event');
      return;
    }

    toast.success('Event deleted successfully');
    fetchEvents();
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events</h2>
        <button
          onClick={() => setIsAddingEvent(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {isAddingEvent && (
        <form onSubmit={addEvent} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="datetime-local"
                required
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                required
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingEvent(false)}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{event.description}</p>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleString()}
                </div>
                <div className="mt-2 text-sm text-gray-500">{event.location}</div>
              </div>
            </div>
            <div className="border-t bg-gray-50 px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => {
                  /* Edit functionality */
                }}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}