import { useState } from 'react';
import FormField from './FormField.jsx';

const empty = { title: '', author: '', genre: '', isbn: '', quantity: '' };

export default function BookForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = 'Title is required.';
    if (!values.author.trim()) e.author = 'Author is required.';
    if (!values.genre.trim()) e.genre = 'Genre is required.';
    if (!/^\d{10}(\d{3})?$/.test(String(values.isbn).replace(/-/g, '')))
      e.isbn = 'ISBN must be 10 or 13 digits.';
    if (values.quantity === '' || Number(values.quantity) < 0 || !Number.isInteger(Number(values.quantity)))
      e.quantity = 'Enter a whole number, 0 or more.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...values, quantity: Number(values.quantity) });
    if (!initial) setValues(empty);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <FormField label="Title" name="title" value={values.title} onChange={handleChange} error={errors.title} />
      <FormField label="Author" name="author" value={values.author} onChange={handleChange} error={errors.author} />
      <FormField label="Genre" name="genre" value={values.genre} onChange={handleChange} error={errors.genre} />
      <FormField label="ISBN" name="isbn" value={values.isbn} onChange={handleChange} error={errors.isbn} />
      <FormField label={initial ? 'Quantity in stock' : 'Initial quantity'} name="quantity" type="number" min="0"
        value={values.quantity} onChange={handleChange} error={errors.quantity} />
      <div className="actions">
        <button className="btn" type="submit">{initial ? 'Save changes' : 'Add book'}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}