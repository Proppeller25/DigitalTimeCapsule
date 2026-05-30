const privacyOptions = ['Private capsule', 'Shared with selected people', 'Public unlock']

const attachments = [
  'Text note',
  'Photo',
  'Voice memo',
  'Video',
]

export default function CreateCapsuleView() {
  return (
    <div className="dashboardView dashboardFormView">
      <section className="formGrid">
        <article className="formPanel">
          <div className="sectionHeaderRow">
            <h2>Create a new capsule</h2>
            <span className="helperBadge">Draft mode</span>
          </div>

          <form className="capsuleForm" onSubmit={(event) => event.preventDefault()}>
            <label>
              Capsule title
              <input type="text" placeholder="Letters to future me" />
            </label>

            <label>
              Message
              <textarea rows="6" placeholder="Write a message to your future self, family, or friends." />
            </label>

            <div className="formSplit">
              <label>
                Unlock date
                <input type="date" />
              </label>
              <label>
                Unlock time
                <input type="time" />
              </label>
            </div>

            <label>
              Privacy
              <select defaultValue={privacyOptions[0]}>
                {privacyOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <fieldset className="attachmentFieldset">
              <legend>Attachments</legend>
              <div className="optionChips">
                {attachments.map((attachment) => (
                  <button type="button" className="chipButton" key={attachment}>
                    {attachment}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="formActions">
              <button type="button" className="secondaryAction">
                Save draft
              </button>
              <button type="submit" className="primaryAction">
                Seal capsule
              </button>
            </div>
          </form>
        </article>

        <aside className="previewPanel">
          <div className="previewIllustration">
            <img src="/capsule.png" alt="" />
          </div>
          <h3>Preview</h3>
          <p>See how your capsule will look before you lock it away.</p>

          <ul className="previewChecklist">
            <li>Choose who can open it</li>
            <li>Set the unlock date</li>
            <li>Add text, images, or voice notes</li>
          </ul>
        </aside>
      </section>
    </div>
  )
}
