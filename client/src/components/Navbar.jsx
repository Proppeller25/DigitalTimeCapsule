import { useState } from "react"
import { Link } from "react-router-dom"

const defaultLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Stories", href: "#stories" },
]

export default function Navbar({
  links = defaultLinks,
  ctaHref = "/auth",
  ctaLabel = "Sign up",
  showLanguageSelect = true,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/">
          <img src="/capsule.png" className="brandIcon" alt="Timecapsule" />
        </Link>
      </div>

      <div className={`navActions ${mobileMenuOpen ? "active" : ""}`}>
        {showLanguageSelect ? (
          <select name="languages" id="languages">
            <option value="en">English</option>
            <option value="es">Espanol</option>
            <option value="fr">Francais</option>
          </select>
        ) : null}

        <nav className="navLinks">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </nav>

        <Link className="primaryButton navCtaButton" to={ctaHref} onClick={closeMenu}>
          {ctaLabel}
        </Link>
      </div>

      <button
        type="button"
        className="mobileMenuToggle"
        onClick={() => setMobileMenuOpen((open) => !open)}
        aria-label="Toggle mobile menu"
        aria-expanded={mobileMenuOpen}
      >
        <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true" />
      </button>
    </header>
  )
}
