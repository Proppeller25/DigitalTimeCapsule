import { useState, useEffect } from "react"

const environment = import.meta.env.VITE_ENVIRONMENT || 'development'

const API_URL = environment === 'development' ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_PRODUCTION_SERVER_URL

const statusCards = [
  {
    label: 'Capsules stored',
    value: '128',
    accent: 'amber',
    trend: '+18%',
    bars: [28, 46, 35, 62, 41, 58, 33],
    note: 'New memories added this month',
  },
  {
    label: 'Waiting to unlock',
    value: '24',
    accent: 'rose',
    trend: '+7%',
    bars: [40, 31, 28, 44, 52, 39, 63],
    note: 'Scheduled releases coming soon',
  },
  {
    label: 'Next unlock',
    value: 'Oct 20',
    accent: 'mint',
    trend: '3 days',
    bars: [],
    note: 'The next capsule is ready to open soon.',
  },
]

const capsuleRows = [
  {
    title: 'Birthday capsule',
    meta: 'Unlocks on 12 Nov 2026',
    status: 'For later',
    statusTone: 'rose',
    memories: '3 items',
    size: '420 MB',
    value: 'Private',
  },
  {
    title: 'Family trip capsule',
    meta: 'Unlocks on 01 Jan 2027',
    status: 'For sharing',
    statusTone: 'green',
    memories: '7 items',
    size: '1.2 GB',
    value: 'Shared',
  },
]

function MiniBars({ bars }) {
  return (
    <div className="miniBars" aria-hidden="true">
      {bars.map((height, index) => (
        <span key={`${height}-${index}`} style={{ height: `${height}%` }} />
      ))}
    </div>
  )
}



export default function DashboardOverview({ onCreateCapsule }) {
  const [capsulesLoading, setCapsulesLoading] = useState(false)
  const [userCapsules, setUserCapsules] = useState([])
  const [sharedCapsules, setSharedCapsules] = useState([])

  useEffect(() => {
    const getCapsules = async () => {
      setCapsulesLoading(true)
      try {
        const res = await fetch(`${API_URL}/v1/capsules`, {
          method: 'GET',
          credentials: 'include'
        })
        const data = await res.json()

        if (!data.success || !res.ok) return console.error(data.message)
        setUserCapsules(data?.data?.capsules || [])
        setSharedCapsules(data?.data?.sharedCapsules || [])
      } catch (error) {
        console.error(error.message)
      } finally {
        setCapsulesLoading(false)
      }
    }

    getCapsules()
  }, [])

  
  return (
    <div className="dashboardView dashboardOverview">
      <section className="summaryGrid">
        
          <article className={`summaryCard amber`}>
            <p>Capsules Stored</p>
            <div className="summaryRow">
              <strong>{userCapsules.length}</strong>
              <span className="summaryPill"></span>
            </div>

            {/* {<MiniBars bars={card.bars} />}
            <small>{card.note}</small> */}
          </article>

          <article className={`summaryCard rose`}>
            <p>Waiting to unlock</p>
            <div className="summaryRow">
              <strong>{userCapsules.length}</strong>
              <span className="summaryPill"></span>
            </div>

            {/* {<MiniBars bars={card.bars} />}
            <small>{card.note}</small> */}
          </article>

          <article className={`summaryCard mint`}>
            <p>Next unlock</p>
            <div className="summaryRow">
              <strong>{userCapsules.length}</strong>
              <span className="summaryPill"></span>
            </div>

            {/* {<MiniBars bars={card.bars} />}
            <small>{card.note}</small> */}
          </article>
      </section>

      <section className="timelineSection">
        <div className="sectionHeaderRow">
          <h2>Upcoming unlocks</h2>
          <button type="button" className="textAction">
            View calendar
          </button>
        </div>

        <div className="timelineGrid">
          <article className="timelineHero">
            <div className="timelineHeroIcon">
              <i className="fa-solid fa-clock" aria-hidden="true" />
            </div>
            <div>
              <p>Next release</p>
              <h3>3 days left</h3>
              <span>Letters to future me opens on 2 June 2026.</span>
            </div>
          </article>

          <article className="timelineList">
            <div className="timelineItem">
              <span className="timelineDate">Jun 02</span>
              <div>
                <strong>Personal letter</strong>
                <p>1 note, 3 photos, 1 audio clip</p>
              </div>
            </div>
            <div className="timelineItem">
              <span className="timelineDate">Aug 21</span>
              <div>
                <strong>Family capsule</strong>
                <p>Shared with 5 people</p>
              </div>
            </div>
            <div className="timelineItem">
              <span className="timelineDate">Oct 20</span>
              <div>
                <strong>Yearly reflection</strong>
                <p>Scheduled as a private time lock</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="capsuleListPanel">
        <div className="sectionHeaderRow capsuleHeader">
          <h2>Recent capsules</h2>
          <button type="button" className="textAction" onClick={onCreateCapsule}>
            + New capsule
          </button>
        </div>

        <div className="capsuleRows">
          {capsuleRows.map((capsule) => (
            <article className="capsuleRow" key={capsule.title}>
              <div className="capsuleThumb">
                <img src="/background.jpg" alt="" />
              </div>
              <div className="capsuleCopy">
                <h3>{capsule.title}</h3>
                <p>{capsule.meta}</p>
              </div>
              <span className={`capsuleStatus ${capsule.statusTone}`}>{capsule.status}</span>
              <div className="capsuleStats">
                <span>{capsule.memories}</span>
                <span>{capsule.size}</span>
              </div>
              <strong>{capsule.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
