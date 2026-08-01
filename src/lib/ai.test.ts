import { describe, expect, it, vi } from 'vitest'
import { generateApology } from './generator'
import { generateRemoteApology } from './ai'

describe('generateRemoteApology', () => {
  it('returns a validated apology from the Worker', async () => {
    const apology = generateApology('I replied all', () => 0)
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({ apology }),
    ) as unknown as typeof fetch

    await expect(generateRemoteApology('I replied all', undefined, fetcher)).resolves.toEqual(
      apology,
    )
    expect(fetcher).toHaveBeenCalledWith(
      '/api/generate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mistake: 'I replied all' }),
      }),
    )
  })

  it('surfaces unavailable or invalid Worker responses', async () => {
    const unavailable = vi.fn().mockResolvedValue(
      Response.json({ error: 'unavailable' }, { status: 502 }),
    ) as unknown as typeof fetch
    const invalid = vi.fn().mockResolvedValue(
      Response.json({ apology: { title: 'incomplete' } }),
    ) as unknown as typeof fetch

    await expect(generateRemoteApology('I replied all', undefined, unavailable)).rejects.toThrow(
      'status 502',
    )
    await expect(generateRemoteApology('I replied all', undefined, invalid)).rejects.toThrow(
      'invalid response',
    )
  })
})
