import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext.jsx';
import UserForm from '../components/UserForm.jsx';

export default function UsersPage() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useLibrary();
  const [editing, setEditing] = useState(null);

  const handleDelete = (user) => {
    if (user.id === currentUser.id) return alert('You cannot delete the account you are logged in with.');
    if (window.confirm(`Delete ${user.name}?`)) deleteUser(user.id);
  };

  return (
    <section>
      <h1>User management</h1>

      <h2>Add a user</h2>
      <UserForm existingUsers={users} onSubmit={addUser} />

      {editing && (
        <>
          <h2>Edit {editing.name}</h2>
          <UserForm
            key={editing.id}
            initial={editing}
            existingUsers={users}
            onSubmit={(changes) => { updateUser(editing.id, changes); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </>
      )}

      <h2>All users</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.membershipId}</td><td>{u.role}</td>
                <td className="row-actions">
                  <button className="btn btn-small" onClick={() => { setEditing(u); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Update</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(u)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}