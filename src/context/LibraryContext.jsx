import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const LibraryContext = createContext(null);
export const useLibrary = () => useContext(LibraryContext);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const seedBooks = [
  { id: 'b1', title: 'Things Fall Apart', author: 'Chinua Achebe', genre: 'Fiction', isbn: '9780385474542', quantity: 5 },
  { id: 'b2', title: 'Long Walk to Freedom', author: 'Nelson Mandela', genre: 'Biography', isbn: '9780316548182', quantity: 1 },
];
const seedUsers = [
  { id: 'u1', name: 'Admin Librarian', membershipId: 'ADMIN01', role: 'admin', password: 'admin123' },
];

export function LibraryProvider({ children }) {
  const [books, setBooks] = useLocalStorage('lib_books', seedBooks);
  const [users, setUsers] = useLocalStorage('lib_users', seedUsers);
  const [transactions, setTransactions] = useLocalStorage('lib_transactions', []);
  const [currentUser, setCurrentUser] = useLocalStorage('lib_current_user', null);

  // ---- Auth ----
  const login = (membershipId, password) => {
    const found = users.find(
      (u) => u.membershipId.toLowerCase() === membershipId.trim().toLowerCase() && u.password === password
    );
    if (found) setCurrentUser(found);
    return found || null;
  };
  const logout = () => setCurrentUser(null);

  // ---- Books ----
  const addBook = (book) => setBooks((prev) => [...prev, { ...book, id: uid() }]);
  const updateBook = (id, changes) => setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...changes } : b)));
  const deleteBook = (id) => setBooks((prev) => prev.filter((b) => b.id !== id));

  // ---- Transactions (type: 'add' | 'borrow') ----
  const recordTransaction = (bookId, type, amount) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return { ok: false, message: 'Select a book first.' };
    if (type === 'borrow' && amount > book.quantity)
      return { ok: false, message: `Only ${book.quantity} cop${book.quantity === 1 ? 'y' : 'ies'} in stock.` };

    updateBook(bookId, { quantity: book.quantity + (type === 'add' ? amount : -amount) });
    setTransactions((prev) => [
      { id: uid(), bookId, bookTitle: book.title, type, amount, by: currentUser?.name || 'Unknown', date: new Date().toISOString() },
      ...prev,
    ]);
    return { ok: true };
  };

  // ---- Users ----
  const addUser = (user) => setUsers((prev) => [...prev, { ...user, id: uid() }]);
  const updateUser = (id, changes) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...changes } : u)));
  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const value = {
    books, users, transactions, currentUser,
    login, logout,
    addBook, updateBook, deleteBook,
    recordTransaction,
    addUser, updateUser, deleteUser,
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}