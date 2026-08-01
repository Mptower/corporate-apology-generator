import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  apologyToText,
  generateApology,
  MAX_MISTAKE_LENGTH,
  type Apology,
} from './lib/generator'

const examples = [
  'I forgot to attach the file',
  'I was two minutes late to the call',
  'I replied all',
  'I used the wrong slide template',
]

type CopyState = 'idle' | 'copied' | 'error'

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-10A1.5 1.5 0 0 0 3 5.5v10A1.5 1.5 0 0 0 4.5 17H8" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 5v6h-6" />
    </svg>
  )
}

export default function App() {
  const [mistake, setMistake] = useState('')
  const [apology, setApology] = useState<Apology | null>(null)
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const outputHeadingRef = useRef<HTMLHeadingElement>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (apology) {
      outputHeadingRef.current?.focus()
    }
  }, [apology])

  const runGenerator = () => {
    setError('')
    setCopyState('idle')

    try {
      generateApology(mistake)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The crisis desk could not process that.')
      return
    }

    setIsGenerating(true)
    timerRef.current = window.setTimeout(() => {
      setApology(generateApology(mistake))
      setIsGenerating(false)
      timerRef.current = null
    }, 700)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    runGenerator()
  }

  const handleExample = (example: string) => {
    setMistake(example)
    setError('')
  }

  const handleCopy = async () => {
    if (!apology || !navigator.clipboard) {
      setCopyState('error')
      return
    }

    try {
      await navigator.clipboard.writeText(apologyToText(apology))
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <div className="site-shell">
      <header className="masthead">
        <a className="brand" href="/" aria-label="Corporate Apology Generator home">
          <span className="brand-mark">CAG</span>
          <span>Public Accountability Office</span>
        </a>
        <div className="masthead-meta">
          <span className="status-dot" aria-hidden="true" />
          Crisis desk online
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="eyebrow">
            <span>Statement generator</span>
            <span>Issue no. 001</span>
          </div>
          <h1 id="page-title">
            Your mistake was small.
            <em>Your apology should not be.</em>
          </h1>
          <p className="hero-copy">
            Transform a minor workplace misstep into a sweeping public reckoning fit for the
            fictional leader of a company in crisis.
          </p>
        </section>

        <section className="workspace" aria-label="Apology generator">
          <div className="briefing-card">
            <div className="section-label">
              <span>01</span>
              Incident briefing
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="mistake">What did you do?</label>
              <div className={`textarea-wrap${error ? ' has-error' : ''}`}>
                <textarea
                  id="mistake"
                  value={mistake}
                  onChange={(event) => {
                    setMistake(event.target.value)
                    setError('')
                  }}
                  placeholder="e.g. I forgot to attach the file"
                  maxLength={MAX_MISTAKE_LENGTH}
                  rows={5}
                  aria-describedby={error ? 'mistake-error character-count' : 'input-hint character-count'}
                  aria-invalid={Boolean(error)}
                />
                <span id="character-count" className="character-count">
                  {mistake.length}/{MAX_MISTAKE_LENGTH}
                </span>
              </div>
              <p id="input-hint" className="input-hint">
                Keep it trivial. We will handle the disproportionate remorse.
              </p>
              {error && (
                <p id="mistake-error" className="error-message" role="alert">
                  <span aria-hidden="true">!</span>
                  {error}
                </p>
              )}

              <fieldset className="examples">
                <legend>Need an example?</legend>
                <div className="example-list">
                  {examples.map((example) => (
                    <button
                      type="button"
                      className="example-chip"
                      onClick={() => handleExample(example)}
                      key={example}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </fieldset>

              <button className="generate-button" type="submit" disabled={isGenerating}>
                <span>{isGenerating ? 'Convening the board...' : 'Generate public statement'}</span>
                <span className="button-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </button>
            </form>

            <div className="confidential">
              <span>Confidential</span>
              Not legal advice. Not remotely proportional.
            </div>
          </div>

          <div className="output-card">
            <div className="output-header">
              <div className="section-label">
                <span>02</span>
                Public statement
              </div>
              {apology && !isGenerating && <span className="approved-stamp">Approved-ish</span>}
            </div>

            <div className="output-body" aria-live="polite" aria-busy={isGenerating}>
              {isGenerating ? (
                <div className="loading-state" role="status">
                  <div className="document-skeleton" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <p>Aligning stakeholders and locating accountability...</p>
                </div>
              ) : apology ? (
                <article className="statement">
                  <p className="statement-kicker">{apology.company} / Official communication</p>
                  <h2 ref={outputHeadingRef} tabIndex={-1}>
                    {apology.title}
                  </h2>
                  <div className="statement-rule" />
                  {apology.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <div className="signature">
                    <p>{apology.signoff}</p>
                    <strong>{apology.executive}</strong>
                    <span>{apology.role}</span>
                  </div>
                </article>
              ) : (
                <div className="empty-state">
                  <div className="empty-document" aria-hidden="true">
                    <span className="empty-seal">PENDING</span>
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <h2>Your statement awaits.</h2>
                  <p>
                    Enter an incident briefing and the crisis desk will prepare a suitably
                    overblown response.
                  </p>
                </div>
              )}
            </div>

            <div className="output-actions">
              <p className={`copy-feedback ${copyState}`} role="status">
                {copyState === 'copied'
                  ? 'Statement copied.'
                  : copyState === 'error'
                    ? 'Clipboard unavailable.'
                    : '\u00A0'}
              </p>
              <div>
                <button type="button" onClick={handleCopy} disabled={!apology || isGenerating}>
                  <CopyIcon />
                  Copy
                </button>
                <button type="button" onClick={runGenerator} disabled={!apology || isGenerating}>
                  <RefreshIcon />
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>
          <span>Satire, obviously.</span> Every company, executive, and crisis generated here is
          fictional.
        </p>
        <p>Built for tiny mistakes and enormous feelings.</p>
      </footer>
    </div>
  )
}
