export default function FormField({ label, error, children, ...inputProps }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input {...inputProps} className={error ? 'invalid' : ''} />}
      {error && <small className="error">{error}</small>}
    </label>
  );
}