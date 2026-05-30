const sharedCapsules = [
  {
    title: 'Wedding capsule',
    members: 'Shared with 3 people',
    unlock: 'Unlocks on 21 Aug 2026',
    tone: 'green',
  },
  {
    title: 'Family time capsule',
    members: 'Shared with 5 people',
    unlock: 'Unlocks on 01 Jan 2027',
    tone: 'rose',
  },
]

export default function SharedCapsulesView() {
  return (
    <div className="dashboardView">
      <section className="sharedGrid">
        {sharedCapsules.map((capsule) => (
          <article key={capsule.title} className="sharedCard">
            <div className={`sharedBadge ${capsule.tone}`}>Shared</div>
            <h2>{capsule.title}</h2>
            <p>{capsule.members}</p>
            <span>{capsule.unlock}</span>
            <button type="button" className="secondaryAction">
              Manage access
            </button>
          </article>
        ))}
      </section>
    </div>
  )
}
