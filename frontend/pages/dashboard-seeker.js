import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function SeekerDashboard() {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'seeker') {
      router.push('/login');
    } else {
      fetchBooks();
    }
  }, [router]);

  const fetchBooks = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/books?${queryParams}`;
      const res = await axios.get(url);
      setBooks(res.data.books);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    const filters = {};
    if (searchTitle) filters.title = searchTitle;
    if (searchGenre) filters.genre = searchGenre;
    if (searchLocation) filters.location = searchLocation;
    fetchBooks(filters);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seeker Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Search filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by Title"
          className="flex-1 p-2 border rounded"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Genre"
          className="flex-1 p-2 border rounded"
          value={searchGenre}
          onChange={e => setSearchGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Location"
          className="flex-1 p-2 border rounded"
          value={searchLocation}
          onChange={e => setSearchLocation(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Books List */}
      <div className="grid gap-4">
        {books.map(book => (
          <div key={book._id} className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-bold">{book.title}</h3>
            <p className="text-sm text-gray-700">Author: {book.author}</p>
            <p className="text-sm text-gray-700">Genre: {book.genre}</p>
            <p className="text-sm text-gray-700">Location: {book.location}</p>
            <p className="text-sm text-gray-700">Status: {book.status}</p>
            <p className="text-sm text-gray-700">Owner: {book.owner?.name}</p>
            <p className="text-sm text-gray-700">Contact: {book.contactInfo}</p>
            {book.coverImageUrl && (
              <img
                src={`http://localhost:4000${book.coverImageUrl}`}
                alt="Cover"
                className="mt-2 w-32 h-auto rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
