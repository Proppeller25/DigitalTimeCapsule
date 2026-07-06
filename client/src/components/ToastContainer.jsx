import './Toast.css'

function ToastIcon({ type }) {
  if (type === 'success') {
    return <i className="fa-solid fa-circle-check" aria-hidden="true" />
  }

  if (type === 'error') {
    return <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
  }

  if (type === 'warning') {
    return <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
  }

  return <i className="fa-solid fa-circle-info" aria-hidden="true" />
}

export default function ToastContainer({ toasts, onClose }) {
  return (
    <div className="toastViewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toastCard toastCard--${toast.type}`}>
          <div className="toastIcon">
            <ToastIcon type={toast.type} />
          </div>

          <div className="toastCopy">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>

          <button
            type="button"
            className="toastCloseButton"
            onClick={() => onClose(toast.id)}
            aria-label={`Dismiss ${toast.type} notification`}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </article>
      ))}
    </div>
  )
}
