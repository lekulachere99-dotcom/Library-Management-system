import { useState } from 'react';
import FormField from './FormField.jsx';

const empty = { name: '', membershipId: '', role: 'member', password: '' };

export default function UserForm({ initial, existingUsers, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Name is required.';
    if (!values.membershipId.trim()) e.membershipId = 'Membership ID is required.';
    else if (existingUsers.some((u) => u.id !== initial?.id && u.membershipId.toLowerCase() === values.membershipId.trim().toLowerCase()))
      e.membershipId = 'This membership ID is already in use.';
    if (values.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({ ...values, name: values.name.trim(), membershipId: values.membershipId.trim() });
    if (!initial) setValues(empty);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
      <FormField label="Membership ID" name="membershipId" value={values.membershipId} onChange={handleChange} error={errors.membershipId} />
      <FormField label="Role">
        <select name="role" value={values.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </FormField>
      <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} />
      <div className="actions">
        <button className="btn" type="submit">{initial ? 'Save changes' : 'Add user'}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}