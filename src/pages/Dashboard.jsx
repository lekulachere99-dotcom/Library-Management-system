import { useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';

const LOW_STOCK = 2;

export default function Dashboard() {
  const { books } = useLibrary();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => books.filter((b) => `${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(search.toLowerCase())),
    [books, search]
  );
  const lowCount = books.filter((b) => b.quantity < LOW_STOCK).length;

  return (
    <section>
      <h1>Dashboard</h1>
      <p className="summary">
        {books.length} titles in the catalogue.{' '}
        {lowCount > 0 ? <strong className="warn-text">{lowCount} running low on stock.</strong> : 'All titles are well stocked.'}
      </p>
      <input className="search" placeholder="Search by title, author or genre"
        value={search} onChange={(e) => setSearch(e.target.value)} />

      {filtered.length === 0 ? (
        <p className="empty">No books match your search. Add books on the Books page.</p>
      ) : (
        <div className="card-grid">
          {filtered.map((b) => {
            const low = b.quantity < LOW_STOCK;
            return (
              <article key={b.id} className={`book-card ${low ? 'low' : ''}`}>
                <h3>{b.title}</h3>
                <p>{b.author}</p>
                <p className="muted">{b.genre} · ISBN {b.isbn}</p>
                <p className="qty">
                  {b.quantity} in stock {low && <span className="badge">Low stock</span>}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}