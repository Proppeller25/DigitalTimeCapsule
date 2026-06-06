import './AuthPage.css'
import { useState, useRef, useEffect } from 'react'
import {useAuth} from '../context/AuthContext.jsx'
const environment = import.meta.env.VITE_ENVIRONMENT || 'development'
const API_URL = environment === 'development' ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_PRODUCTION_SERVER_URL

import {useNavigate} from 'react-router-dom'

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [usernameOrEmail, setUsernameOrEmail] = useState(null)
  const [email, setEmail] = useState(null)
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)
  const {login} = useAuth()
  const navigate = useNavigate()
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!confirmRef.current) return

    if (!confirmPassword) {
      confirmRef.current.setCustomValidity("")
      return
    }

    if (password !== confirmPassword) {
      confirmRef.current.setCustomValidity("Passwords do not match")
    } else {
      confirmRef.current.setCustomValidity("")
    }
  }, [password, confirmPassword])

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (confirmRef.current) {
      if (password !== value) {
        confirmRef.current.setCustomValidity("Passwords do not match")
      } else {
        confirmRef.current.setCustomValidity("")
      }
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed')
      }

      await login()

      navigate('/dashboard')
    } catch (error) {
      console.error(error.message)
    }
  }


  const handleSignUp = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      if (confirmRef.current) {
        confirmRef.current.setCustomValidity("Passwords do not match")
        confirmRef.current.reportValidity()
      }
      return
    }

    try {
      const res = await fetch(`${API_URL}/v1/auth/signup`,{
         method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password, email})
      })

      const data = await res.json()
      console.log(data)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <main className="authPage">
      <section className="authShell">
        <aside className="authHero">
          <img src="/stories-bg.jpg" alt="Timecapsule" className="authHeroImage" />
          <div className="authHeroOverlay" />
          <div className={`authHeroContent ${isSignUp ? 'isSignUp' : 'isLogin'}`}>
            <span className="eyebrow">Digital Time Capsule</span>
            <h2>{isSignUp ? 'Create your memory vault' : 'Welcome back to your timeline'}</h2>
            <p>
              {isSignUp
                ? 'Set up a secure account in moments, then start preserving stories, milestones, and future messages.'
                : 'Sign in to revisit the moments you have already preserved and continue building your archive.'}
            </p>

            <div className="heroMetrics" aria-label="Platform highlights">
              <div className="metricCard">
                <strong>Private</strong>
                <span>Built for personal memories</span>
              </div>
              <div className="metricCard">
                <strong>Fast</strong>
                <span>Simple access from any device</span>
              </div>
              <div className="metricCard">
                <strong>Thoughtful</strong>
                <span>Designed for long-term value</span>
              </div>
            </div>

            <ul className="featureList">
              <li>Keep stories, photos, and notes in one place</li>
              <li>Use a calm, focused interface that is easy to trust</li>
            </ul>
          </div>
        </aside>

        <form
          className={`authCard ${isSignUp ? 'isSignUp' : 'isLogin'}`}
          onSubmit={isSignUp ? handleSignUp : handleLogin}
        >
          <div className="authBrand">
            <div className="logoContainer">
              <img src="/capsule.png" className="brandIcon" alt="Timecapsule" />
            </div>
            <div className='brandAndInfo'>
              <span className="brandKicker">Secure access</span>
              <h1>{isSignUp ? 'Create your account' : 'Sign in to continue'}</h1>
              <p>
                {isSignUp
                  ? 'Create a profile and start preserving the moments that matter most.'
                  : 'Use your existing details to return to your saved memories.'}
              </p>
            </div>
          </div>

          <div className="modeSwitch" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={`modeButton ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              Login
            </button>
            <button
              type="button"
              className={`modeButton ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign up
            </button>
          </div>

          <div className="sectionCopy">
            <p className="title">{isSignUp ? 'Create your account' : 'Login to your account'}</p>
            <span className="subtitle">
              {isSignUp
                ? 'Set up your details once, then keep every memory ready for the future.'
                : 'Enter your details below to continue where you left off.'}
            </span>
          </div>

          {isSignUp && (
            <div className="input_container">
              <label className="input_label" htmlFor="name_field">Username</label>
              <div className="fieldShell">
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#141B34" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                </svg>
                <input placeholder="Username" autoComple  te="name" name="name" type="text" className="input_field" required id="name_field" onChange={(e) => setUsername(e.target.value)}/>
              </div>
            </div>
          )}

          <div className="input_container">
            <label className="input_label" htmlFor="email_field">Email address{!isSignUp ? `/Username` : ''}</label>
            <div className="fieldShell">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
              >
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#141B34" d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"></path>
                <path strokeLinejoin="round" strokeWidth="1.5" stroke="#141B34" d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"></path>
              </svg>
              <input placeholder="name@mail.com" autoComplete="email" name="email" required type="text" className="input_field" id="email_field" onChange={(e) => {
                isSignUp ? setEmail(e.target.value)
                : setUsernameOrEmail(e.target.value)
              }}/>
            </div>
          </div>

          <div className="input_container">
            <label className="input_label" htmlFor="password_field">Password</label>
            <div className="fieldShell">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
              >
                <path strokeLinecap="round" strokeWidth="1.5" stroke="#141B34" d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#141B34" d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"></path>
                <path fill="#141B34" d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"></path>
              </svg>
              <input placeholder="Password" autoComplete={isSignUp ? 'new-password' : 'current-password'} name="password" required type="password" className="input_field" id="password_field" onChange={(e) => setPassword(e.target.value)}/>
            </div>
          </div>

          {isSignUp && (
            <div className="input_container">
              <label className="input_label" htmlFor="confirm_password_field">Confirm password</label>
              <div className="fieldShell">
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#141B34" d="M7 10V7a5 5 0 1 1 10 0v3M5 10h14l1 10H4L5 10Z" />
                </svg>
                <input placeholder="Confirm password" autoComplete="new-password" name="confirmPassword" type="password" className="input_field" required id="confirm_password_field" ref={confirmRef} onChange={handleConfirmChange}/>
              </div>
            </div>
          )}

          <button title={isSignUp ? 'Create Account' : 'Sign In'} type="submit" className="sign-in_btn">
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
          </button>

          <div className="separator">
            <hr className="line" />
            <span>Or</span>
            <hr className="line" />
          </div>

          <button title={isSignUp ? 'Sign Up with Google' : 'Sign In with Google'} type="button" className="sign-in_ggl">
            <svg height="18" width="18" viewBox="0 0 32 32" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" id="A"></path>
              </defs>
              <clipPath id="B" />
              <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                <path fill="#fbbc05" clipPath="url(#B)" d="M0 37V11l17 13z"></path>
                <path fill="#ea4335" clipPath="url(#B)" d="M0 11l17 13 7-6.1L48 14V0H0z"></path>
                <path fill="#34a853" clipPath="url(#B)" d="M0 37l30-23 7.9 1L48 0v48H0z"></path>
                <path fill="#4285f4" clipPath="url(#B)" d="M48 48L17 24l-4-3 35-10z"></path>
              </g>
            </svg>
            <span>{isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}</span>
          </button>

          <p className="note">By continuing, you agree to the Terms of Use and Privacy Policy.</p>

          <button type="button" className="ghostLink" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPage
