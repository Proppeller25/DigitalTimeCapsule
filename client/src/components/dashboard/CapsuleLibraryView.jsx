const capsules = [
  {
    title: 'Birthday wishes',
    subtitle: 'Opens in 142 days',
    status: 'Scheduled',
    statusTone: 'amber',
    updated: '12 memories',
  },
  {
    title: 'Vacation recap',
    subtitle: 'Opens in 28 days',
    status: 'Ready',
    statusTone: 'green',
    updated: '8 memories',
  },
  {
    title: 'Graduation letter',
    subtitle: 'Opens in 2 years',
    status: 'Private',
    statusTone: 'rose',
    updated: '4 memories',
  },
]

export default function CapsuleLibraryView() {
  return (
    <div className="dashboardView">
      <section className="listPanel">
        <div className="sectionHeaderRow">
          <h2>All capsules</h2>
          <button type="button" className="textAction">
            Filter
          </button>
        </div>

        <div className="simpleList">
          {capsules.map((capsule) => (
            <article key={capsule.title} className="simpleListRow">
              <div className="capsuleThumb small">
                <img src="/background.jpg" alt="" />
              </div>
              <div className="capsuleCopy">
                <h3>{capsule.title}</h3>
                <p>{capsule.subtitle}</p>
              </div>
              <span className={`capsuleStatus ${capsule.statusTone}`}>{capsule.status}</span>
              <strong>{capsule.updated}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
