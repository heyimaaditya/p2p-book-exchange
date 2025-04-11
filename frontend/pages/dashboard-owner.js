import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function OwnerDashboard() {
  const [books, setBooks] = useState([]);
  const [coverFile, setCoverFile] = useState(null); 
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    location: '',
    contactInfo: '',
    coverImageUrl: '' 
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'owner') {
      router.push('/login');
    } else {
      fetchBooks();
    }
  }, [router]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/books');
      setBooks(res.data.books);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle the file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);  
    }
  };

  // 1) Upload the image file to get a coverImageUrl
  const handleCoverUpload = async (e) => {
    e.preventDefault();
    if (!coverFile) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('coverImage', coverFile);

      const res = await axios.post(
        'http://localhost:4000/api/books/uploadCover',
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      
      const { coverImageUrl } = res.data;
      // Update newBook state so that we can pass this URL when creating the book
      setNewBook(prev => ({ ...prev, coverImageUrl }));
      alert('Cover image uploaded successfully!');
    } catch (error) {
      console.error(error.response?.data?.msg || error.message);
    }
  };

  // 2) Create the book using the coverImageUrl
  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/books', newBook, {
        headers: { 'x-auth-token': token }
      });
      
      setNewBook({
        title: '',
        author: '',
        genre: '',
        location: '',
        contactInfo: '',
        coverImageUrl: ''
      });
      setCoverFile(null);
      fetchBooks();
      alert('Book created successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/books/${bookId}`, {
        headers: { 'x-auth-token': token }
      });
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 bg-gray-50 p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
        <form onSubmit={handleCreateBook} className="space-y-3">
          {/* Title, Author, etc. */}
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            value={newBook.title}
            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            className="w-full p-2 border rounded"
            value={newBook.author}
            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            className="w-full p-2 border rounded"
            value={newBook.genre}
            onChange={e => setNewBook({ ...newBook, genre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border rounded"
            value={newBook.location}
            onChange={e => setNewBook({ ...newBook, location: e.target.value })}
          />
          <input
            type="text"
            placeholder="Contact Info"
            className="w-full p-2 border rounded"
            value={newBook.contactInfo}
            onChange={e => setNewBook({ ...newBook, contactInfo: e.target.value })}
          />

          {/* Cover Image Upload: Step 1) select file, step 2) upload -> sets coverImageUrl */}
          <div className="flex items-center space-x-3">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            <button
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              onClick={handleCoverUpload}
            >
              Upload Cover
            </button>
          </div>

          {/* Hidden or read-only field to show the stored coverImageUrl */}
          {newBook.coverImageUrl && (
            <div className="text-sm text-green-700">
              Cover uploaded: {newBook.coverImageUrl}
            </div>
          )}

          {/* Create Book after we optionally have a coverImageUrl */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add Book
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Books</h2>
      <div className="grid gap-4">
        {books
          .filter(b => b.owner && b.owner._id === localStorage.getItem('userId'))
          .map(book => (
            <div key={book._id} className="p-4 border rounded bg-gray-50">
              <h3 className="text-lg font-bold">{book.title}</h3>
              <p className="text-sm text-gray-700">Author: {book.author}</p>
              <p className="text-sm text-gray-700">Genre: {book.genre}</p>
              <p className="text-sm text-gray-700">Location: {book.location}</p>
              <p className="text-sm text-gray-700">Status: {book.status}</p>
              <p className="text-sm text-gray-700">Owner: {book.owner?.name}</p>

              {/* Display cover image if we have one */}
              {book.coverImageUrl && (
                <img
                  src={`http://localhost:4000${book.coverImageUrl}`}
                  alt="Cover"
                  className="mt-2 w-32 h-auto rounded"
                />
              )}

              <div className="mt-2 space-x-2">
                <button
                  onClick={() => router.push(`/books/${book._id}`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
