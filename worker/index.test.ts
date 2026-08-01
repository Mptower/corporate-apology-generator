import { describe, expect, it, vi } from 'vitest'
import worker, { DailyAiQuota, type WorkerEnv } from './index'

const validApology = {
  title: 'A Machine-Written Reckoning',
  company: 'Northstar Synergy Labs',
  executive: 'Avery Sterling',
  role: 'Founder and Chief Vision Officer',
  archetype: 'solemn-address',
  paragraphs: [
    'I forgot to attach the file, and this entirely fictional institution has been shaken.',
    'The responsibility is mine alone, and I accept full accountability for my failure.',
    'Our employees, customers, and stakeholders deserved considerably better than this.',
    'I have reflected deeply and listened to colleagues who expected basic competence.',
    'We are creating an excessive review council with independent oversight and a long report.',
    'I will step down immediately so a new leader can restore trust to this fictional company.',
    'I am deeply sorry, and I know that only action can repair what my tiny mistake broke.',
  ],
  signoff: 'With automated remorse and human-level embarrassment,',
}

function createEnv(aiResult: unknown): WorkerEnv {
  return {
    AI: {
      run: vi.fn().mockResolvedValue(aiResult),
    },
    ASSETS: {
      fetch: vi.fn().mockResolvedValue(new Response('asset')),
    },
    AI_RATE_LIMITER: {
      limit: vi.fn().mockResolvedValue({ success: true }),
    },
    DAILY_AI_QUOTA: {
      idFromName: vi.fn().mockReturnValue({ name: 'daily' }),
      get: vi.fn().mockReturnValue({
        fetch: vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
      }),
    },
  }
}

describe('Cloudflare Worker', () => {
  it('hard-stops the global AI quota after 200 daily attempts', async () => {
    const values = new Map<string, unknown>()
    const quota = new DailyAiQuota({
      storage: {
        transaction: async (closure) =>
          closure({
            get: async <T>(key: string) => values.get(key) as T | undefined,
            put: async <T>(key: string, value: T) => {
              values.set(key, value)
            },
          }),
      },
    })

    for (let attempt = 0; attempt < 200; attempt += 1) {
      const response = await quota.fetch(
        new Request('https://quota.internal/check', { method: 'POST' }),
      )
      expect(response.status).toBe(204)
    }

    const blocked = await quota.fetch(
      new Request('https://quota.internal/check', { method: 'POST' }),
    )
    expect(blocked.status).toBe(429)
  })

  it('generates and validates an AI apology', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const env = createEnv({ response: JSON.stringify(validApology) })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: 'I forgot to attach the file' }),
      }),
      env,
    )

    expect(response.status).toBe(200)
    const body = (await response.json()) as { apology: typeof validApology }
    expect(body.apology).toMatchObject({
      ...validApology,
      paragraphs: expect.any(Array),
    })
    expect(body.apology.paragraphs[0]).toContain('I forgot to attach the file')
    expect(body.apology.paragraphs.slice(1)).toEqual(validApology.paragraphs.slice(1))
    expect(env.AI.run).toHaveBeenCalledOnce()
    random.mockRestore()
  })

  it('rejects invalid incident data before invoking AI', async () => {
    const env = createEnv({ response: JSON.stringify(validApology) })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: ' '.repeat(12) }),
      }),
      env,
    )

    expect(response.status).toBe(400)
    expect(env.AI.run).not.toHaveBeenCalled()
  })

  it('fails safely when model output violates the contract', async () => {
    const env = createEnv({ response: '{"title":"not enough"}' })
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: 'I replied all' }),
      }),
      env,
    )

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'AI generation is temporarily unavailable.',
    })
    errorLog.mockRestore()
  })

  it('accepts varied but equivalent corporate-apology language', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const varied = {
      ...validApology,
      paragraphs: [
        'The underlying incident will be supplied by the trusted local blueprint at runtime.',
        'I take full ownership of this failure and accept the blame without qualification.',
        'Every partner and stakeholder deserved more care than my actions demonstrated.',
        'After serious contemplation and soul-searching, I understand what leadership requires.',
        'An independent corrective council will review every control and publish its findings.',
        'I am departing this role immediately so a steadier leader can restore confidence.',
        'I offer my sincerest apology for this satirical crisis and the trust it disturbed.',
      ],
    }
    const env = createEnv({ response: varied })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: 'I forgot to attach the file' }),
      }),
      env,
    )

    expect(response.status).toBe(200)
    random.mockRestore()
  })

  it('injects any required narrative beats omitted by the model', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const sparse = {
      ...validApology,
      paragraphs: [
        'The trusted blueprint supplies the exact incident in this opening paragraph.',
        'The board met early this morning to discuss a path through recent events.',
        'Several internal processes will be revised after a careful operational review.',
        'The organization plans to publish a detailed report about lessons learned.',
        'Further updates will be shared when the communications team approves them.',
      ],
    }
    const env = createEnv({ response: sparse })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: 'I forgot to attach the file' }),
      }),
      env,
    )
    const body = (await response.json()) as { apology: typeof validApology }
    const text = body.apology.paragraphs.join(' ')

    expect(response.status).toBe(200)
    expect(text).toContain('The accountability is mine alone.')
    expect(text).toMatch(/stakeholder|employees|customers/i)
    expect(text).toContain('I have reflected deeply on this failure.')
    expect(text).toContain('I will step down from leadership immediately.')
    expect(text).toContain('I am sorry.')
    expect(text).toMatch(/fictional/i)
    random.mockRestore()
  })

  it('rate limits generation by client address', async () => {
    const env = createEnv({ response: JSON.stringify(validApology) })
    vi.mocked(env.AI_RATE_LIMITER.limit).mockResolvedValueOnce({ success: false })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'CF-Connecting-IP': '192.0.2.10',
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: 'I replied all' }),
      }),
      env,
    )

    expect(response.status).toBe(429)
    expect(response.headers.get('Retry-After')).toBe('60')
    expect(env.AI.run).not.toHaveBeenCalled()
  })

  it('stops before inference when the free daily quota is exhausted', async () => {
    const env = createEnv({ response: JSON.stringify(validApology) })
    vi.mocked(env.DAILY_AI_QUOTA.get).mockReturnValueOnce({
      fetch: vi.fn().mockResolvedValue(new Response(null, { status: 429 })),
    })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/api/generate', {
        method: 'POST',
        headers: {
          'CF-Connecting-IP': '192.0.2.11',
          'Content-Type': 'application/json',
          Origin: 'https://apology.polzinit.com',
        },
        body: JSON.stringify({ mistake: 'I replied all' }),
      }),
      env,
    )

    expect(response.status).toBe(429)
    expect(await response.json()).toEqual({
      error: 'The free daily AI quota has been reached.',
    })
    expect(env.AI.run).not.toHaveBeenCalled()
  })

  it('serves static assets outside the API route', async () => {
    const env = createEnv({ response: JSON.stringify(validApology) })
    const response = await worker.fetch(
      new Request('https://apology.polzinit.com/about'),
      env,
    )

    expect(await response.text()).toBe('asset')
    expect(env.ASSETS.fetch).toHaveBeenCalledOnce()
  })
})
