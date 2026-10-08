import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import BookForm from '../components/BookForm.jsx';

export default function BooksPage() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [editing, setEditing] = useState(null);

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"? This cannot be undone.`)) deleteBook(book.id);
  };

  return (
    <section>
      <h1>Books</h1>

      <h2>Add a book</h2>
      <BookForm onSubmit={addBook} />

      {editing && (
        <>
          <h2>Edit "{editing.title}"</h2>
          <BookForm
            key={editing.id}
            initial={editing}
            onSubmit={(changes) => { updateBook(editing.id, changes); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </>
      )}

      <h2>All books</h2>
      {books.length === 0 ? (
        <p className="empty">No books yet. Use the form above to add the first one.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th></th></tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.isbn}</td><td>{b.quantity}</td>
                  <td className="row-actions">
                    <button className="btn btn-small" onClick={() => { setEditing(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Update</button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(b)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}