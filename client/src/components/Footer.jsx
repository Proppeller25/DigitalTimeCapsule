import { Link } from "react-router-dom"

const defaultLinks = [
  { label: "Privacy", href: "/" },
  { label: "Terms", href: "/" },
  { label: "About", href: "/" },
  { label: "Contact", href: "/" },
]

export default function Footer({
  links = defaultLinks,
  copyright = "(c) 2025 Timecapsule. All rights reserved.",
}) {
  return (
    <footer className="pageFooter">
      <div className="brand">
        <Link to="/">
          <img src="/capsule.png" className="brandIcon" alt="Timecapsule" />
        </Link>
      </div>

      <ul className="footerLinks">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <p className="footerText">{copyright}</p>
    </footer>
  )
}
