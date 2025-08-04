import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function NotesTaker() {
  const [fetchednotes, setFetchedNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/notes');
        setFetchedNotes(res.data);
        console.log('Successfully fetched notes');
      } catch (error) {
        console.error('Failed to fetch notes', error);
      }
    };

    fetchNotes();
  }, []);

  const handleSave = async () => {
    const note = { title, description };

    try {
      if (editingNoteId) {
        const res = await axios.patch(`http://localhost:8081/api/notes/${editingNoteId}`, note);
        setFetchedNotes(
          fetchednotes.map((n) => (n.id === editingNoteId ? res.data : n))
        );
        setEditingNoteId(null);
      } else {
        const res = await axios.post('http://localhost:8081/api/notes', note);
        setFetchedNotes([...fetchednotes, res.data]);
      }

      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/notes/${id}`);
      setFetchedNotes(fetchednotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditingNoteId(note.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Note Taker</h1>

      <div className="space-y-4">
        {fetchednotes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-green-200"
          >
            <p className="text-lg font-semibold text-green-800">📌 {note.title}</p>
            <p className="text-green-700">{note.description}</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(note)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            {editingNoteId ? 'Edit Note' : 'Add New Note'}
          </h2>
          <div className="mb-4">
            <label className="block text-green-800 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-green-800 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter description"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            {editingNoteId ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      )}
    </div>
  );
}
