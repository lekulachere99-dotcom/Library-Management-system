import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import FormField from '../components/FormField.jsx';

export default function TransactionsPage() {
  const { books, transactions, recordTransaction } = useLibrary();
  const [values, setValues] = useState({ bookId: '', type: 'borrow', amount: 1 });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(values.amount);
    if (!values.bookId) return setMessage({ ok: false, text: 'Select a book.' });
    if (!Number.isInteger(amount) || amount < 1) return setMessage({ ok: false, text: 'Quantity must be a whole number of 1 or more.' });

    const result = recordTransaction(values.bookId, values.type, amount);
    setMessage({ ok: result.ok, text: result.ok ? 'Transaction recorded.' : result.message });
  };

  return (
    <section>
      <h1>Transactions</h1>

      <form className="card form-grid" onSubmit={handleSubmit} noValidate>
        <FormField label="Book">
          <select name="bookId" value={values.bookId} onChange={handleChange}>
            <option value="">Select a book</option>
            {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>)}
          </select>
        </FormField>
        <FormField label="Action">
          <select name="type" value={values.type} onChange={handleChange}>
            <option value="borrow">Borrow (deduct stock)</option>
            <option value="add">New arrival (add stock)</option>
          </select>
        </FormField>
        <FormField label="Quantity" name="amount" type="number" min="1" value={values.amount} onChange={handleChange} />
        <div className="actions"><button className="btn" type="submit">Record transaction</button></div>
        {message && <p className={message.ok ? 'success' : 'error'}>{message.text}</p>}
      </form>

      <h2>History</h2>
      {transactions.length === 0 ? (
        <p className="empty">No transactions yet. Record a borrow or a stock arrival above.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Book</th><th>Action</th><th>Qty</th><th>Recorded by</th></tr></thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleString()}</td>
                  <td>{t.bookTitle}</td>
                  <td>{t.type === 'add' ? 'Stock added' : 'Borrowed'}</td>
                  <td>{t.type === 'add' ? '+' : '−'}{t.amount}</td>
                  <td>{t.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}