import type { Apology, ArchetypeId } from './generator'

type GenerateResponse = {
  apology: Apology
}

const archetypes: readonly ArchetypeId[] = [
  'solemn-address',
  'incident-disclosure',
  'founder-confession',
  'emergency-briefing',
  'institutional-lament',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isApology(value: unknown): value is Apology {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.company === 'string' &&
    typeof value.executive === 'string' &&
    typeof value.role === 'string' &&
    typeof value.archetype === 'string' &&
    archetypes.includes(value.archetype as ArchetypeId) &&
    Array.isArray(value.paragraphs) &&
    value.paragraphs.length >= 5 &&
    value.paragraphs.every((paragraph) => typeof paragraph === 'string') &&
    typeof value.signoff === 'string'
  )
}

export async function generateRemoteApology(
  mistake: string,
  previous?: Apology,
  fetcher: typeof fetch = fetch,
): Promise<Apology> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetcher('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mistake,
        previousArchetype: previous?.archetype,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`AI generation failed with status ${response.status}.`)
    }

    const data: unknown = await response.json()
    if (!isRecord(data) || !isApology(data.apology)) {
      throw new Error('AI generation returned an invalid response.')
    }

    return (data as GenerateResponse).apology
  } finally {
    window.clearTimeout(timeout)
  }
}
