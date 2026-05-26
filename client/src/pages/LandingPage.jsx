import {useState, useEffect} from "react"
import { Link } from "react-router-dom"

const LandingPage = () => {
  return (
    <>
      <main>
        {/* navigation links */}
        <nav>
          <div> <Link to="/">Capsule</Link> </div>

          <div>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/features">Features</Link>
            <Link to="/Features">Features</Link>
          </div>

          <div>
            <button>Get Started</button>
          </div>
        </nav>

        {/* hero section */}
        <section>
          <h3>Welcome to Capsule</h3>
          <h1>Seal the moment. Open the memory.</h1>
          <p>Record messages, upload images, or drop a link — then seal it in time. Capsule keeps your memories locked until the moment you choose to rediscover them.</p>

          <div>
            <button>Create your first capsule</button>
            <button>See how it works</button>
          </div>

          <div>
            <div>{/*shield image */}End to end encrypted</div>
            <div>{/*clock image */}Open on your chosen date</div>
            <div>{/*dollar sign image */}Start for free</div>
          </div>
          
        </section>
      </main>
    </>
  )
}

export default LandingPage