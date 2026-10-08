import { Navigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser } = useLibrary();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}