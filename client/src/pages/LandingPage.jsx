import "./LandingPage.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Stories", href: "#stories" },
]

const footerLinks = [
  { label: "Privacy", href: "/" },
  { label: "Terms", href: "/" },
  { label: "About", href: "/" },
  { label: "Contact", href: "/" },
]

const featureList = [
  {
    title: "Private & secure",
    description: "Your memories are encrypted end-to-end. Only you can open them at the right time.",
    icon: "lock",
  },
  {
    title: "Any format",
    description: "Text, photos, videos, audio, or documents - save memories in any format.",
    icon: "document",
  },
  {
    title: "Future you",
    description: "Schedule capsules to unlock automatically when the time is right.",
    icon: "clock",
  },
  {
    title: "Beautifully simple",
    description: "A clean, calm space to write, reflect, and store what matters most.",
    icon: "star",
  },
  {
    title: "Share & connect",
    description: "Create capsules for friends, partners, or family. Share memories that last.",
    icon: "users",
  },
  {
    title: "Anywhere, anytime",
    description: "Access your capsules on any device, whenever the time is right.",
    icon: "globe",
  },
]

const storyList = [
  {
    quote:
      "I wrote a letter to myself before moving abroad. Reading it a year later felt like a hug from my past self.",
    initials: "NE",
    name: "Nisha",
    city: "New York",
  },
  {
    quote:
      "We created a capsule for our wedding day - to open on our 5th anniversary. It was the most emotional moment.",
    initials: "SP",
    name: "Sarah & Priyam",
    city: "Bangalore",
  },
  {
    quote:
      "Timecapsule helps me stay focused. I write down my goals and open them when I need motivation.",
    initials: "AR",
    name: "Arjun",
    city: "San Francisco",
  },
]

const capsuleItems = [
  { title: "Letters to future me", year: "2026", color: "blue" },
  { title: "Memories with friends", year: "2027", color: "pink" },
  { title: "Dreams & goals", year: "2028", color: "gray" },
]

function Icon({ type }) {
  const iconMap = {
    lock: "fa-solid fa-lock",
    document: "fa-solid fa-file-lines",
    clock: "fa-solid fa-clock",
    star: "fa-solid fa-star",
    users: "fa-solid fa-users",
    globe: "fa-solid fa-globe",
  }

  return <i className={iconMap[type] || "fa-solid fa-circle-info"} aria-hidden="true" />
}

function StepIcon({ type }) {
  const iconMap = {
    write: "fa-solid fa-pen",
    seal: "fa-solid fa-vault",
    open: "fa-solid fa-door-open",
  }

  return <i className={iconMap[type] || "fa-solid fa-arrow-right"} aria-hidden="true" />
}

export default function LandingPage() {
  return (
    <main className="landingPage">
      <section className="heroSection">
        <Navbar links={navLinks} ctaHref="/auth" ctaLabel="Get Started" />
        <div className="heroContent">
          <div className="heroLeft">
            <p className="sectionLabel">THE FUTURE IS YOURS</p>
            <h1 className="heroTitle">
              Your memories,
              <span> forever</span>
            </h1>
            <p className="heroText">
              Lock away your thoughts, photos, and messages in a Timecapsule, and unlock them in the
              future - for the moments that matter most.
            </p>
            <a className="primaryButton heroButton" href="/auth">
              Sign up
            </a>
          </div>

          <div className="heroRight">
            <div className="heroSteps">
              <div className="heroStep">
                <div className="stepIcon">
                  <StepIcon type="write" />
                </div>
                <div>
                  <h3>Write</h3>
                  <p>Capture your thoughts, photos, and files in a beautiful capsule.</p>
                </div>
              </div>

              <div className="heroStep">
                <div className="stepIcon">
                  <StepIcon type="seal" />
                </div>
                <div>
                  <h3>Seal</h3>
                  <p>Choose when it should be unlocked - days, months, or years.</p>
                </div>
              </div>

              <div className="heroStep">
                <div className="stepIcon">
                  <StepIcon type="open" />
                </div>
                <div>
                  <h3>Open</h3>
                  <p>Relive your memories at the perfect time in the future.</p>
                </div>
              </div>
            </div>

            <div className="capsulePreview">
              {capsuleItems.map((item) => (
                <div className="capsuleRow" key={item.title}>
                  <div className={`capsuleRowIcon ${item.color}`}>
                    <div className="capsuleRowDot" />
                  </div>
                  <p>{item.title}</p>
                  <span>{item.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="featuresSection" id="features">
        <div className="sectionHeading">
          <p className="sectionLabel">WHAT'S INSIDE</p>
          <h2>
            Built for memories
            <span> that deserve to last</span>
          </h2>
        </div>

        <div className="featureGrid">
          {featureList.map((feature) => (
            <article className="featureCard" key={feature.title}>
              <div className="featureIcon">
                <Icon type={feature.icon} />
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="storiesSection" id="stories">
        <div className="sectionHeading storiesHeading">
          <p className="sectionLabel">REAL STORIES</p>
          <h2>
            The moments people <span> sealed</span>
          </h2>
        </div>

        <div className="storyGrid">
          {storyList.map((story) => (
            <article className="storyCard" key={story.name}>
              <p className="storyQuote">"{story.quote}"</p>
              <div className="storyAuthor">
                <div className="storyAvatar">{story.initials}</div>
                <p>
                  {story.name} <span>- {story.city}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="storyControls" aria-hidden="true">
          <button type="button" aria-label="Previous story">
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>
          <div className="storyDots">
            <span className="active" />
            <span />
            <span />
            <span />
          </div>
          <button type="button" aria-label="Next story">
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="ctaSection" id="auth">
        <div className="ctaInner">
          <p className="sectionLabel">LOG IN OR SIGN UP</p>
          <h2>
            Your next memory
            <span> starts with an account</span>
          </h2>
          <p className="ctaText">
            Log in to open your capsules or sign up to start preserving moments today.
            <br />
            Your memories stay ready whenever you come back.
          </p>

          <div className="ctaForm authActions">
            <a className="secondaryButton" href="/auth">Log in</a>
            <a className="primaryButton" href="/auth">Sign up</a>
          </div>
        </div>
      </section>

      <Footer links={footerLinks} copyright="(c) 2025 Timecapsule. All rights reserved." />
    </main>
  )
}
