import { describe, it, expect } from 'vitest'
import { sanitizeEhrText } from './sanitizeEhrText'

describe('sanitizeEhrText', () => {
  it('should replace special characters with their text equivalents', () => {
    const input = 'Temperature: 98.6° with ↓O₂ at 2µg/m²'
    const result = sanitizeEhrText(input)

    expect(result.sanitizedText).toBe('Temperature: 98.6 degrees with Decreased O₂ at 2micro g/m squared')
    expect(result.original).toBe(input)
    expect(result.hasChanges).toBe(true)
    expect(result.explanationList).toHaveLength(4)
  })

  it('should return original text when no special characters are present', () => {
    const input = 'Normal text without special characters'
    const result = sanitizeEhrText(input)

    expect(result.sanitizedText).toBe(input)
    expect(result.original).toBe(input)
    expect(result.hasChanges).toBe(false)
    expect(result.explanationList).toHaveLength(0)
  })

  it('should handle multiple occurrences of the same special character', () => {
    const input = '37° in room 1, 38° in room 2'
    const result = sanitizeEhrText(input)

    expect(result.sanitizedText).toBe('37 degrees in room 1, 38 degrees in room 2')
    expect(result.explanationList).toHaveLength(2)
  })
})