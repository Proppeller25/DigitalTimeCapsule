import { useState, useRef, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import './Dashboard.css'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import CreateCapsuleView from '../components/dashboard/CreateCapsuleView'
import CapsuleLibraryView from '../components/dashboard/CapsuleLibraryView'
import SharedCapsulesView from '../components/dashboard/SharedCapsulesView'
import AccountView from '../components/dashboard/AccountView'

import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const environment = import.meta.env.VITE_ENVIRONMENT || 'development'

const API_URL = environment === 'development' ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_PRODUCTION_SERVER_URL


const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'create', label: 'Create Capsule', icon: 'create' },
  { key: 'capsules', label: 'My Capsules', icon: 'capsules' },
  { key: 'shared', label: 'Shared Capsules', icon: 'shared' },
  { key: 'account', label: 'Account', icon: 'account' },
]



function SidebarIcon({ type }) {
  if (type === 'create') {
    return <i className="fa-solid fa-plus" aria-hidden="true" />
  }

  if (type === 'capsules') {
    return <i className="fa-solid fa-layer-group" aria-hidden="true" />
  }

  if (type === 'shared') {
    return <i className="fa-solid fa-share-nodes" aria-hidden="true" />
  }

  if (type === 'account') {
    return <i className="fa-solid fa-user" aria-hidden="true" />
  }

  return <i className="fa-solid fa-house" aria-hidden="true" />
}

function MobileNav({ activeView, onChangeView }) {
  return (
    <nav className="dashboardBottomNav" aria-label="Dashboard navigation">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`dashboardBottomNavButton ${activeView === item.key ? 'active' : ''}`}
          onClick={() => onChangeView(item.key)}
          aria-label={item.label}
        >
          <SidebarIcon type={item.icon} />
        </button>
      ))}
    </nav>
  )
}





function DashboardShell({ activeView, onChangeView, onAddNew }) {
  const {user} = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [userCapsules, setUserCapsules] = useState([])

  const handleLogout = async (e) => {
    e.preventDefault()
    if (logoutLoading) return
    setLogoutLoading(true)

    try {
      const res = await fetch(`${API_URL}/v1/auth/logout`,{
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      
      if(!res.ok) {
        showToast({
          type: 'error',
          title: 'Logout failed',
          message: data.message || 'We could not log you out right now.',
        })
        return
      }

      showToast({
        type: 'success',
        title: 'Logged out',
        message: 'You have been signed out safely.',
      })
      navigate('/auth')
      // logout()

    } catch (error) {
      showToast({
        type: 'error',
        title: 'Network error',
        message: error.message || 'Please check your connection and try again.',
      })
    } finally {
      setLogoutLoading(false)
    }
  }
  const viewTitles = {
    dashboard: {
      title: 'Capsule Dashboard',
      subtitle: `Welcome back, ${user?.username || 'Jane'}!`,
    },
    create: {
      title: 'Create Capsule',
      subtitle: 'Write something now and unlock it later.',
    },
    capsules: {
      title: 'My Capsules',
      subtitle: 'Everything you have sealed in one place.',
    },
    shared: {
      title: 'Shared Capsules',
      subtitle: 'Capsules you created with friends or family.',
    },
    account: {
      title: 'Account Settings',
      subtitle: 'Manage your profile, access, and preferences.',
    },
  }
  const title = viewTitles[activeView] ?? viewTitles.dashboard

  const primaryButtonRef = useRef(null)

  useEffect(() => {
    if(activeView === 'create') primaryButtonRef.current.style.display = 'none'
    else primaryButtonRef.current.style.display = 'block' 
  }, [activeView])

  useEffect(() => {
    const getCapsules = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/capsules`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await res.json()

        if (!data.success || !res.ok) {
          showToast({
            type: 'error',
            title: 'Capsules not loaded',
            message: data.message || 'We could not load your capsules.',
          })
          return
        }
        setUserCapsules(data?.data?.capsules || [])
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Capsule error',
          message: error.message || 'Something went wrong while loading capsules.',
        })
      }
    }

    getCapsules()
  }, [showToast])
  

  return (
    <main className="dashboardMain">
      <section className="dashboardShell">
        <aside className="dashboardSidebar">
          <div className="brandMark">
            <img src="/capsule.png" alt="Digital Time Capsule" />
            <span>DIGITAL TIME CAPSULE</span>
          </div>

          <nav className="sidebarNav" aria-label="Dashboard views">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sidebarButton ${activeView === item.key ? 'active' : ''}`}
                onClick={() => onChangeView(item.key)}
              >
                <span className="sidebarIcon">
                  <SidebarIcon type={item.icon} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebarProfile">
            <div className="profileAvatar">
              <img src="/background.jpg" alt="Jane Doe" />
            </div>

            <div className="profileCopy">
              <strong>{user?.username || 'Jane Doe'}</strong>
              <span>{user?.email || 'Jandoe@gmail.com'}</span>
            </div>

            <div className="profileActions">
              <button type="button" aria-label="Open settings" onClick={() => onChangeView('account')}>
                <i className="fa-solid fa-gear" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Log out" onClick={handleLogout} disabled={logoutLoading} aria-busy={logoutLoading}>
                {logoutLoading ? <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /> : <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </aside>

        <section className="dashboardSurface">
          <header className="dashboardHeader">
            <div className="headerCopy">
              <h1>{title.title}</h1>
              <p>{title.subtitle}</p>
            </div>

            <div className="headerActions">
              <button type="button" className="iconButton" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              </button>
              <button type="button" className="iconButton" aria-label="Notifications">
                <i className="fa-solid fa-bell" aria-hidden="true" />
                <span className="notificationDot" />
              </button>
              <button type="button" className="primaryAction" onClick={onAddNew} ref={primaryButtonRef}>
                + Add New
              </button>
            </div>
          </header>

          {activeView === 'dashboard' ? (
            <DashboardOverview
              onCreateCapsule={onAddNew}
              userCapsules={userCapsules}
            />
          ) : null}
          {activeView === 'create' ? <CreateCapsuleView /> : null}
          {activeView === 'capsules' ? <CapsuleLibraryView /> : null}
          {activeView === 'shared' ? <SharedCapsulesView /> : null}
          {activeView === 'account' ? <AccountView /> : null}
        </section>
      </section>
      <MobileNav activeView={activeView} onChangeView={onChangeView} />
    </main>
  )
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <DashboardShell
      activeView={activeView}
      onChangeView={setActiveView}
      onAddNew={() => setActiveView('create')}
    />
  )
}
