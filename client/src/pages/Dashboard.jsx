import { useState } from 'react'
import './Dashboard.css'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import CreateCapsuleView from '../components/dashboard/CreateCapsuleView'
import CapsuleLibraryView from '../components/dashboard/CapsuleLibraryView'
import SharedCapsulesView from '../components/dashboard/SharedCapsulesView'
import AccountView from '../components/dashboard/AccountView'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'create', label: 'Create Capsule', icon: 'create' },
  { key: 'capsules', label: 'My Capsules', icon: 'capsules' },
  { key: 'shared', label: 'Shared Capsules', icon: 'shared' },
  { key: 'account', label: 'Account', icon: 'account' },
]

const viewTitles = {
  dashboard: {
    title: 'Capsule Dashboard',
    subtitle: 'Welcome back, Jane',
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

function DashboardShell({ activeView, onChangeView, onAddNew }) {
  const title = viewTitles[activeView] ?? viewTitles.dashboard

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
              <strong>Jane Doe</strong>
              <span>jane.doe@gmail.com</span>
            </div>

            <div className="profileActions">
              <button type="button" aria-label="Open settings" onClick={() => onChangeView('account')}>
                <i className="fa-solid fa-gear" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Log out">
                <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
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
              <button type="button" className="primaryAction" onClick={onAddNew}>
                + Add New
              </button>
            </div>
          </header>

          {activeView === 'dashboard' ? (
            <DashboardOverview onCreateCapsule={onAddNew} />
          ) : null}
          {activeView === 'create' ? <CreateCapsuleView /> : null}
          {activeView === 'capsules' ? <CapsuleLibraryView /> : null}
          {activeView === 'shared' ? <SharedCapsulesView /> : null}
          {activeView === 'account' ? <AccountView /> : null}
        </section>
      </section>
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
