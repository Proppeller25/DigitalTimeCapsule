import { useAuth } from "../../context/AuthContext"

const settings = [
  'Change password',
  'Update email address',
  'Notification preferences',
  'Two factor authentication',
]

export default function AccountView() {
  const {user} = useAuth()
  return (
    <div className="dashboardView">
      <section className="accountPanel">
        <article className="profileCardLarge">
          <div className="profileAvatar large">
            <img src="/background.jpg" alt="Jane Doe" />
          </div>
          <div>
            <h2>{user?.username ||'Jane Doe'}</h2>
            <p>{user?.email || 'janedoe@gmail.com'}</p>
            <span>Member since 2025</span>
          </div>
        </article>

        <article className="settingsCard">
          <h3>Account settings</h3>
          <ul>
            {settings.map((setting) => (
              <li key={setting}>
                <span>{setting}</span>
                <button type="button">Open</button>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}
