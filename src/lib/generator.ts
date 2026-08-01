export const MAX_MISTAKE_LENGTH = 180

export type Apology = {
  title: string
  company: string
  executive: string
  role: string
  paragraphs: string[]
  signoff: string
}

type RandomSource = () => number

const companies = [
  'Northstar Synergy Labs',
  'Aperture & Finch Systems',
  'Meridian Cloud Holdings',
  'Common Thread Technologies',
  'Blue Oak Digital Group',
  'TomorrowWorks Global',
]

const executives = [
  ['Avery Sterling', 'Founder and Chief Vision Officer'],
  ['Morgan Vale', 'Co-Founder and Executive Chair'],
  ['Cameron Wren', 'Chief Executive Officer'],
  ['Jordan Ash', 'Founder and Interim Steward'],
  ['Riley Mercer', 'President and Chief Culture Architect'],
] as const

const impactMetaphors = [
  'a hairline fracture in the foundation of trust',
  'a preventable rupture in the social contract',
  'an avoidable tremor through the institutions we hold dear',
  'a profound failure of preparation, judgment, and basic clicking',
  'a small act with consequences that felt anything but small',
]

const reflectionPlaces = [
  'in long conversations with mentors, colleagues, and one extremely patient barista',
  'during several quiet mornings away from notifications',
  'while listening, learning, and rereading the relevant email thread',
  'through difficult reflection with my family and our outside communications counsel',
  'in the humbling silence that follows a calendar reminder',
]

const commitments = [
  'a cross-functional attachment-readiness council',
  'a company-wide protocol for moments requiring basic competence',
  'an independent review of our send-button governance',
  'mandatory pre-flight checklists and quarterly humility training',
  'a permanent Office of Small but Entirely Avoidable Errors',
]

const transitions = [
  'Effective immediately, I will step down and transition into an unpaid advisory role with no access to email.',
  'I have asked the board to begin an orderly leadership transition while I focus on becoming worthy of the paper clip icon.',
  'Today, I am resigning from day-to-day leadership and surrendering my company laptop to the appropriate stakeholders.',
  'The board has accepted my decision to step aside, allowing steadier hands to guide this fictional institution forward.',
]

const closings = [
  'Trust is earned in drops and lost in one poorly considered click. The work of earning it back begins now.',
  'I cannot undo what happened. I can only meet this moment with honesty, humility, and a more disciplined relationship with technology.',
  'May this be remembered not as the moment we failed, but as the moment we finally learned to double-check.',
  'Words alone are insufficient. Only time, action, and meticulous attention to the compose window can repair what was broken.',
]

function pick<T>(items: readonly T[], random: RandomSource): T {
  const value = Math.min(Math.max(random(), 0), 0.999999999)
  return items[Math.floor(value * items.length)]
}

function normalizeMistake(value: string): string {
  const mistake = value.trim().replace(/\s+/g, ' ')

  if (!mistake) {
    throw new Error('Enter a minor mistake before convening the crisis team.')
  }

  if (mistake.length > MAX_MISTAKE_LENGTH) {
    throw new Error(`Keep the incident briefing under ${MAX_MISTAKE_LENGTH} characters.`)
  }

  return mistake.replace(/[.!?]+$/, '')
}

export function apologyToText(apology: Apology): string {
  return [
    apology.title,
    '',
    ...apology.paragraphs.flatMap((paragraph) => [paragraph, '']),
    apology.signoff,
    `${apology.executive}, ${apology.role}`,
    apology.company,
  ].join('\n')
}

export function generateApology(input: string, random: RandomSource = Math.random): Apology {
  const mistake = normalizeMistake(input)
  const incident = /^I\b/i.test(mistake) ? mistake : `I ${mistake}`
  const company = pick(companies, random)
  const [executive, role] = pick(executives, random)
  const impact = pick(impactMetaphors, random)
  const reflection = pick(reflectionPlaces, random)
  const commitment = pick(commitments, random)
  const transition = pick(transitions, random)
  const closing = pick(closings, random)

  return {
    title: 'A Statement on Recent Events',
    company,
    executive,
    role,
    paragraphs: [
      `To our employees, customers, partners, shareholders, neighbors, and the broader fictional technology community: I am writing to address an incident that has shaken the very premise of our work. ${incident}. Though the facts are simple, their weight is not.`,
      `Let me be unequivocal: this happened on my watch. I take full accountability. There are no excuses, no mitigating circumstances, and no strategic framework capable of transforming this into anything other than ${impact}.`,
      `I understand that many stakeholders are hurt, confused, and asking whether the values printed in our lobby still mean anything. You deserved vigilance. You deserved follow-through. Above all, you deserved better from the person entrusted with leading ${company}.`,
      `Over the past several minutes, I have reflected deeply ${reflection}. Reflection without action is merely reputation management, so we are establishing ${commitment}. Its findings will be shared in a forthcoming 84-page transparency report.`,
      transition,
      `${closing} I am sorry - not for the attention this has received, but for the wholly fictional harm my very minor mistake has caused.`,
    ],
    signoff: 'With profound remorse and a renewed commitment to doing the bare minimum correctly,',
  }
}
