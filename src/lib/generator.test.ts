import { describe, expect, it } from 'vitest'
import { apologyToText, generateApology, MAX_MISTAKE_LENGTH } from './generator'

describe('generateApology', () => {
  it('creates a complete multi-paragraph apology from a minor mistake', () => {
    const apology = generateApology('  I forgot to attach the file.  ', () => 0)
    const text = apologyToText(apology)

    expect(apology.paragraphs).toHaveLength(6)
    expect(text).toContain('I forgot to attach the file.')
    expect(text).toContain('I take full accountability')
    expect(text).toContain('stakeholders')
    expect(text).toContain('step down')
    expect(text).toContain('fictional')
    expect(text).not.toContain('I I forgot')
  })

  it('produces varied versions when the random source changes', () => {
    const first = apologyToText(generateApology('used reply all', () => 0))
    const second = apologyToText(generateApology('used reply all', () => 0.8))

    expect(first).not.toEqual(second)
  })

  it('rejects empty and overly long incident briefings', () => {
    expect(() => generateApology('   ')).toThrow('Enter a minor mistake')
    expect(() => generateApology('x'.repeat(MAX_MISTAKE_LENGTH + 1))).toThrow(
      `under ${MAX_MISTAKE_LENGTH} characters`,
    )
  })
})
