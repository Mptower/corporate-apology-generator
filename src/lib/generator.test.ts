import { describe, expect, it } from 'vitest'
import {
  apologyToText,
  createSeededRandom,
  generateApology,
  MAX_MISTAKE_LENGTH,
  type RandomSource,
} from './generator'

function randomSequence(...values: number[]): RandomSource {
  let index = 0
  return () => values[index++] ?? values.at(-1) ?? 0
}

describe('generateApology', () => {
  it('preserves the incident and every core corporate-apology beat', () => {
    for (let seed = 0; seed < 40; seed += 1) {
      const apology = generateApology(
        '  I forgot to attach the quarterly report.  ',
        createSeededRandom(seed),
      )
      const text = apologyToText(apology)

      expect(text).toContain('I forgot to attach the quarterly report')
      expect(text).toMatch(
        /accountability|responsib|I own|obligation is mine|accept the consequences|carry the blame/i,
      )
      expect(text).toMatch(/stakeholder/i)
      expect(text).toMatch(/reflect/i)
      expect(text).toMatch(
        /step down|step aside|stepping away|resign|resignation|transition|leave my executive|interim leader/i,
      )
      expect(text).toMatch(/I am (deeply |profoundly )?sorry/i)
      expect(text).toMatch(/fictional/i)
      expect(text).not.toContain('I I forgot')
      expect(new Set(apology.paragraphs).size).toBe(apology.paragraphs.length)
    }
  })

  it('uses distinct archetypes with materially different structures and lengths', () => {
    const outputs = [0, 0.21, 0.41, 0.61, 0.81].map((firstValue) =>
      generateApology('I replied all', randomSequence(firstValue, 0.35)),
    )
    const paragraphCounts = new Set(outputs.map((apology) => apology.paragraphs.length))
    const titles = new Set(outputs.map((apology) => apology.title))
    const archetypes = new Set(outputs.map((apology) => apology.archetype))
    const lengths = outputs.map((apology) => apologyToText(apology).length)

    expect(archetypes.size).toBe(5)
    expect(titles.size).toBe(5)
    expect(paragraphCounts.size).toBeGreaterThanOrEqual(3)
    expect(Math.max(...lengths) - Math.min(...lengths)).toBeGreaterThan(450)
    expect(outputs.find((apology) => apology.archetype === 'founder-confession')?.role).toMatch(
      /Founder/,
    )
  })

  it('reliably selects a different archetype when regenerating', () => {
    const first = generateApology('I joined the call two minutes late', () => 0)
    const regenerated = generateApology('I joined the call two minutes late', () => 0, first)

    expect(regenerated.archetype).not.toBe(first.archetype)
    expect(regenerated.title).not.toBe(first.title)
    expect(apologyToText(regenerated)).not.toBe(apologyToText(first))
    expect(apologyToText(regenerated)).toContain('I joined the call two minutes late')
  })

  it('is deterministic with a seeded random source', () => {
    const first = generateApology('used the wrong slide template', createSeededRandom('board-7'))
    const second = generateApology('used the wrong slide template', createSeededRandom('board-7'))
    const different = generateApology(
      'used the wrong slide template',
      createSeededRandom('board-8'),
    )

    expect(first).toEqual(second)
    expect(apologyToText(different)).not.toEqual(apologyToText(first))
  })

  it('bounds generated structure and keeps paragraphs substantive', () => {
    for (let seed = 100; seed < 150; seed += 1) {
      const apology = generateApology('I left myself on mute', createSeededRandom(seed))

      expect(apology.paragraphs.length).toBeGreaterThanOrEqual(5)
      expect(apology.paragraphs.length).toBeLessThanOrEqual(9)
      expect(apology.paragraphs.every((paragraph) => paragraph.length >= 35)).toBe(true)
    }
  })

  it('rejects empty and overly long incident briefings', () => {
    expect(() => generateApology('   ')).toThrow('Enter a minor mistake')
    expect(() => generateApology('x'.repeat(MAX_MISTAKE_LENGTH + 1))).toThrow(
      `under ${MAX_MISTAKE_LENGTH} characters`,
    )
  })
})
