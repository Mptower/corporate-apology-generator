import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { generateRemoteApology } from './lib/ai'
import { generateApology } from './lib/generator'
import App from './App'

vi.mock('./lib/ai', () => ({
  generateRemoteApology: vi.fn(),
}))

async function finishGeneration() {
  await act(async () => {
    await vi.runAllTimersAsync()
  })
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(generateRemoteApology).mockRejectedValue(new Error('Worker unavailable'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows a helpful error when the briefing is empty', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /generate public statement/i }))

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a minor mistake')
    expect(screen.getByLabelText(/what did you do/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('uses an example and generates a complete statement', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'I replied all' }))
    fireEvent.click(screen.getByRole('button', { name: /generate public statement/i }))

    expect(screen.getByText(/Aligning stakeholders/i)).toBeInTheDocument()

    await finishGeneration()

    const statement = within(screen.getByRole('article'))
    expect(statement.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(statement.getByText(/I replied all/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy/i })).toBeEnabled()
  })

  it('regenerates with a perceptibly different structure', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/what did you do/i), {
      target: { value: 'I forgot the meeting agenda' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate public statement/i }))
    await finishGeneration()
    const firstTitle = within(screen.getByRole('article')).getByRole('heading', {
      level: 2,
    }).textContent

    fireEvent.click(screen.getByRole('button', { name: /regenerate/i }))
    await finishGeneration()
    const nextTitle = within(screen.getByRole('article')).getByRole('heading', {
      level: 2,
    }).textContent

    expect(nextTitle).not.toBe(firstTitle)
    expect(within(screen.getByRole('article')).getByText(/I forgot the meeting agenda/)).toBeInTheDocument()
  })

  it('copies the generated statement', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    render(<App />)

    fireEvent.change(screen.getByLabelText(/what did you do/i), {
      target: { value: 'I muted the wrong person' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate public statement/i }))
    await finishGeneration()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /copy/i }))
    })

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('I muted the wrong person'))
    expect(screen.getByRole('status')).toHaveTextContent('Statement copied')
  })

  it('renders a validated AI response when the Worker succeeds', async () => {
    const aiApology = generateApology('I misplaced the agenda', () => 0)
    vi.mocked(generateRemoteApology).mockResolvedValueOnce(aiApology)
    render(<App />)

    fireEvent.change(screen.getByLabelText(/what did you do/i), {
      target: { value: 'I misplaced the agenda' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate public statement/i }))
    await finishGeneration()

    expect(within(screen.getByRole('article')).getByText(/I misplaced the agenda/)).toBeInTheDocument()
    expect(screen.getByText(/AI drafted/i)).toBeInTheDocument()
  })

  it('locks the incident briefing while AI generation is pending', () => {
    vi.mocked(generateRemoteApology).mockReturnValueOnce(new Promise(() => undefined))
    render(<App />)

    fireEvent.change(screen.getByLabelText(/what did you do/i), {
      target: { value: 'I sent the draft too early' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate public statement/i }))

    expect(screen.getByLabelText(/what did you do/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: 'I replied all' })).toBeDisabled()
  })
})
