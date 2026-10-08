import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext.jsx';
import FormField from '../components/FormField.jsx';

export default function LoginPage() {
  const { login, currentUser } = useLibrary();
  const navigate = useNavigate();
  const [values, setValues] = useState({ membershipId: '', password: '' });
  const [error, setError] = useState('');

  if (currentUser) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.membershipId.trim() || !values.password) {
      setError('Enter your membership ID and password.');
      return;
    }
    if (login(values.membershipId, values.password)) navigate('/');
    else setError('Membership ID or password is incorrect.');
  };

  return (
    <section className="login">
      <h1>Log in</h1>
      <form className="card" onSubmit={handleSubmit} noValidate>
        <FormField label="Membership ID" value={values.membershipId}
          onChange={(e) => setValues({ ...values, membershipId: e.target.value })} />
        <FormField label="Password" type="password" value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">Log in</button>
        <p className="hint">First time? Use ADMIN01 / admin123, then add users from the Users page.</p>
      </form>
    </section>
  );
}