import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import ToastContainer from '../components/ToastContainer'

const ToastContext = createContext(null)

const toastPresets = {
  success: {
    title: 'Success',
    message: 'Your changes were saved.',
    duration: 3500,
  },
  error: {
    title: 'Error',
    message: 'Something went wrong.',
    duration: 4500,
  },
  info: {
    title: 'Info',
    message: 'Here is a quick update.',
    duration: 3500,
  },
  warning: {
    title: 'Warning',
    message: 'Please review this before continuing.',
    duration: 4500,
  },
}

const createToastId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const removeToast = useCallback((id) => {
    const timerId = timersRef.current.get(id)

    if (timerId) {
      clearTimeout(timerId)
      timersRef.current.delete(id)
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    for (const timerId of timersRef.current.values()) {
      clearTimeout(timerId)
    }

    timersRef.current.clear()
    setToasts([])
  }, [])

  const showToast = useCallback(({
    type = 'info',
    title,
    message,
    duration,
  } = {}) => {
    const preset = toastPresets[type] ?? toastPresets.info
    const id = createToastId()
    const nextToast = {
      id,
      type,
      title: title ?? preset.title,
      message: message ?? preset.message,
      duration: duration ?? preset.duration,
    }

    setToasts((currentToasts) => [...currentToasts, nextToast])

    if (nextToast.duration !== 0) {
      const timerId = window.setTimeout(() => removeToast(id), nextToast.duration)
      timersRef.current.set(id, timerId)
    }

    return id
  }, [removeToast])

  useEffect(() => {
    return clearToasts
  }, [clearToasts])

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }

  return context
}
