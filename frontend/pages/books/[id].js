import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function BookEditPage() {
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/books/${id}`);
      setBook(res.data.book);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:4000/api/books/${id}`, book, {
        headers: { 'x-auth-token': token }
      });
      setMessage(res.data.msg);
      router.push('/dashboard-owner');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.msg || 'Error updating');
    }
  };

  if (!book) return <div className="text-center mt-12">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow fade-in">
      <h2 className="text-xl font-bold mb-4">Edit Book</h2>
      <div className="space-y-3">
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={book.title}
          onChange={e => setBook({ ...book, title: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={book.author}
          onChange={e => setBook({ ...book, author: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={book.genre || ''}
          onChange={e => setBook({ ...book, genre: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={book.location || ''}
          onChange={e => setBook({ ...book, location: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={book.contactInfo || ''}
          onChange={e => setBook({ ...book, contactInfo: e.target.value })}
        />
        <select
          className="w-full p-2 border rounded"
          value={book.status}
          onChange={e => setBook({ ...book, status: e.target.value })}
        >
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
          <option value="Exchanged">Exchanged</option>
        </select>
        {/* If want to edit the cover image URL: */}
        <input
          type="text"
          placeholder="Cover Image URL"
          className="w-full p-2 border rounded"
          value={book.coverImageUrl || ''}
          onChange={e => setBook({ ...book, coverImageUrl: e.target.value })}
        />

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
        >
          Update
        </button>
      </div>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
