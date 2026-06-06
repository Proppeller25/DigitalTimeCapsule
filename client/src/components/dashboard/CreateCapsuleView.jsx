import { useState } from 'react'

const environment = import.meta.env.VITE_ENVIRONMENT || 'development'

const API_URL = environment === 'development' ? import.meta.env.VITE_LOCAL_SERVER_URL : import.meta.env.VITE_PRODUCTION_SERVER_URL

const privacyOptions = ['Private capsule', 'Shared with selected people', 'Public unlock']

const attachments = [
  'Text note',
  'Photo',
  'Voice memo',
  'Video',
]





export default function CreateCapsuleView() {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [arrivalDate, setArrivalDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createCapsule = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('file', file)
      formData.append('arrivalDate', arrivalDate)
      const res = await fetch(`${API_URL}/v1/capsules`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const data = await res.json()

      if(!res.ok) {
        console.error(data.message)
      }
    } catch (error) {
      console.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="dashboardView dashboardFormView">
      <section className="formGrid">
        <article className="formPanel">
          <div className="sectionHeaderRow">
            <h2>Create a new capsule</h2>
            <span className="helperBadge">Draft mode</span>
          </div>

          <form className="capsuleForm" onSubmit={createCapsule}>
            <label>
              Capsule title
              <input type="text" placeholder="Letters to future me" onChange={(e) => setName(e.target.value)}/>
            </label>

            <label>
              Message
              <textarea rows="6" placeholder="Write a message to your future self, family, or friends." />
            </label>

            <div className="formSplit">
              <label>
                Unlock date
                <input type="date" onChange={(e) => setArrivalDate(e.target.value)}/>
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
                <input type="file" name="capsuleFile" id="capsuleFile" onChange={(e) => setFile(e.target.files?.[0])} />
              </div>
            </fieldset>

            <div className="formActions">
              <button type="button" className="secondaryAction">
                Save draft
              </button>
              <button type="submit" className="primaryAction" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? 'Sealing capsule...' : 'Seal capsule'}
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
