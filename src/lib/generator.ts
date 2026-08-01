export const MAX_MISTAKE_LENGTH = 180

export type ArchetypeId =
  | 'solemn-address'
  | 'incident-disclosure'
  | 'founder-confession'
  | 'emergency-briefing'
  | 'institutional-lament'

export type Apology = {
  title: string
  company: string
  executive: string
  role: string
  archetype: ArchetypeId
  paragraphs: string[]
  signoff: string
}

export type RandomSource = () => number

type GenerationContext = {
  incident: string
  company: string
  executive: string
  role: string
  impact: string
  reflectionSetting: string
  initiative: string
  affectedGroup: string
  ordinaryObject: string
}

type ApologyParts = {
  accountability: string
  stakeholders: string
  reflection: string
  action: string
  transition: string
  closing: string
  rhetoric: string
  systemsLesson: string
}

type Archetype = {
  id: ArchetypeId
  titles: readonly string[]
  build: (context: GenerationContext, parts: ApologyParts, picker: Picker) => string[]
}

type Frame = (context: GenerationContext) => string

const companies = [
  'Northstar Synergy Labs',
  'Aperture & Finch Systems',
  'Meridian Cloud Holdings',
  'Common Thread Technologies',
  'Blue Oak Digital Group',
  'TomorrowWorks Global',
  'Lantern Peak Software',
  'Civic Orbit Ventures',
  'Evergreen Signal Works',
  'Atlas Thread Industries',
  'Quiet Harbor Platforms',
  'Brightwell Data Collective',
] as const

const executives = [
  ['Avery Sterling', 'Founder and Chief Vision Officer'],
  ['Morgan Vale', 'Co-Founder and Executive Chair'],
  ['Cameron Wren', 'Chief Executive Officer'],
  ['Jordan Ash', 'Founder and Interim Steward'],
  ['Riley Mercer', 'President and Chief Culture Architect'],
  ['Taylor Rowan', 'Chief Executive Officer'],
  ['Quinn Hollis', 'Founder and Executive Chair'],
  ['Casey Marlow', 'President and Chief Strategy Officer'],
  ['Drew Calder', 'Co-Founder and Chief Steward'],
  ['Sage Bellamy', 'Interim Chief Executive Officer'],
] as const

const founderExecutives = executives.filter(([, role]) => role.includes('Founder'))

const impactMetaphors = [
  'a hairline fracture in the foundation of trust',
  'a preventable rupture in the social contract',
  'an avoidable tremor through the institutions we hold dear',
  'a profound failure of preparation, judgment, and basic clicking',
  'a small act with consequences that felt anything but small',
  'a paper cut across the very fabric of responsible leadership',
  'a flashing red warning light on the dashboard of our culture',
  'a pebble that became an avalanche of entirely proportionate concern',
  'a breach in the thin membrane between intention and competence',
  'a moment that will occupy at least three slides in our corporate history',
] as const

const reflectionSettings = [
  'in long conversations with mentors, colleagues, and one extremely patient barista',
  'during several quiet mornings away from notifications',
  'while listening, learning, and rereading the relevant email thread',
  'through difficult conversations with my family and our outside communications counsel',
  'in the humbling silence that follows a calendar reminder',
  'during a solitary walk around the executive parking structure',
  'between sessions with the board and a printer that refused to connect',
  'while sitting with the discomfort of an unread badge count',
  'after clearing my calendar of everything except accountability',
  'in honest dialogue with people brave enough to explain the attachment icon',
] as const

const initiatives = [
  'a cross-functional attachment-readiness council',
  'a company-wide protocol for moments requiring basic competence',
  'an independent review of our send-button governance',
  'mandatory pre-flight checklists and quarterly humility training',
  'a permanent Office of Small but Entirely Avoidable Errors',
  'a twelve-point framework for restoring confidence in routine tasks',
  'an external audit of every assumption made before lunch',
  'a task force empowered to ask whether we checked twice',
  'a new standard for operational excellence at the smallest possible scale',
  'a listening tour across every department with access to a keyboard',
  'a board committee dedicated to prevention, preparedness, and punctuation',
  'an independently monitored Basic Follow-Through Initiative',
] as const

const affectedGroups = [
  'employees who showed up believing the day would be ordinary',
  'customers who placed their faith in our stated ability to handle simple tasks',
  'partners who expected steadiness rather than spectacle',
  'shareholders who never modeled this scenario in their forecasts',
  'families whose dinner conversations now include our preventable error',
  'communities that asked only that we meet the lowest reasonable standard',
  'colleagues forced to type "just circling back" one additional time',
  'future interns who will study this incident during orientation',
] as const

const ordinaryObjects = [
  'paper clip icon',
  'calendar notification',
  'reply-all button',
  'muted microphone',
  'shared document',
  'conference-room dongle',
  'unread badge',
  'office printer',
] as const

const accountabilityFrames: readonly Frame[] = [
  (c) =>
    `Responsibility does not belong to a process, a policy, or an unnamed member of the team. It belongs to me. I accept full accountability for ${c.impact}.`,
  (c) =>
    `Let me remove all ambiguity: this happened on my watch and because of my judgment. No workflow, market condition, or retroactive footnote can carry the responsibility that is mine.`,
  (c) =>
    `I failed the most basic test of leadership: doing the small thing correctly when no one expected it to become a public statement. I own that failure completely.`,
  (c) =>
    `There will be no deflection here. I made the decision, I created the conditions, and I bear the consequences. Accountability begins with saying that plainly.`,
  (c) =>
    `Leadership is not a title reserved for triumphant announcements. It is the obligation to stand alone when something becomes ${c.impact}. Today, that obligation is mine.`,
  (c) =>
    `Some have asked whether this was a systems failure. Systems matter, but the system did not make this choice. I did, and I am responsible for what followed.`,
  (c) =>
    `The instinct to explain is powerful; the duty to take accountability is stronger. I will not confuse context with an excuse or embarrassment with atonement.`,
  (c) =>
    `I was entrusted with judgment, follow-through, and access to the relevant controls. I fell short on all three. The accountability is total and it is personal.`,
] as const

const stakeholderFrames: readonly Frame[] = [
  (c) =>
    `To our stakeholders - especially ${c.affectedGroup} - your disappointment is justified. You deserved care, competence, and considerably less drama.`,
  (c) =>
    `Our stakeholders did not consent to become supporting characters in this crisis. They expected quiet reliability from ${c.company}; instead, they received a teachable moment with a press strategy.`,
  (c) =>
    `I have heard from stakeholders who feel confused, exhausted, and newly suspicious of the ${c.ordinaryObject}. Their trust was not ours to spend so casually.`,
  (c) =>
    `Employees, customers, partners, and the wider fictional technology community deserved better. Stakeholders should never have to wonder whether our values survive contact with an ordinary Tuesday.`,
  (c) =>
    `The impact reaches beyond my own embarrassment. It reaches ${c.affectedGroup}, and every stakeholder who believed our lobby signage represented an operating principle.`,
  (c) =>
    `For every stakeholder now asking "How could this happen?", I understand that a polished answer cannot restore what an unpolished action put at risk.`,
  (c) =>
    `We asked our stakeholders for patience, belief, and occasionally their email address. In return, they had every right to expect basic follow-through.`,
  (c) =>
    `I recognize the burden this placed on ${c.affectedGroup}. These stakeholders' time and confidence are real, even if every company and executive in this statement is fictional.`,
] as const

const reflectionFrames: readonly Frame[] = [
  (c) =>
    `I have reflected ${c.reflectionSetting}. The lesson is uncomfortable but clear: good intentions are not a substitute for one final check.`,
  (c) =>
    `My reflection has not been quick, though the incident itself took seconds. ${capitalizeFirst(c.reflectionSetting)}, I confronted the distance between the leader I described in all-hands meetings and the person who actually clicked.`,
  (c) =>
    `In the hours since, I have listened more than I have spoken. I have reflected ${c.reflectionSetting}, and begun the slower work of separating remorse from reputation management.`,
  (c) =>
    `Reflection is easy when it produces a quote; it is harder when it requires change. ${capitalizeFirst(c.reflectionSetting)}, I learned that humility begins where the draft statement ends.`,
  (c) =>
    `My reflection unfolded ${c.reflectionSetting}. What emerged was not an excuse, but a simple truth: attention is a form of respect, and mine was absent when it mattered.`,
  (c) =>
    `The quiet after a mistake can be instructive. In reflection, I found perspective ${c.reflectionSetting}, and saw how casually I had treated a responsibility others took seriously.`,
  (c) =>
    `In reflection, I have asked difficult questions of myself ${c.reflectionSetting}. Chief among them: when did "probably fine" become an acceptable leadership standard?`,
  (c) =>
    `This reflection has required a more honest inventory than any annual review. ${capitalizeFirst(c.reflectionSetting)}, I found no strategic complexity - only a need to do better.`,
] as const

const actionFrames: readonly Frame[] = [
  (c) =>
    `Reflection without action is merely branding. We are therefore establishing ${c.initiative}, with public findings and a budget that is almost certainly excessive.`,
  (c) =>
    `${c.company} will now launch ${c.initiative}. Its mandate is simple: ensure that no minor oversight again requires this much stationery.`,
  (c) =>
    `We are converting remorse into governance through ${c.initiative}. An independent chair will publish recommendations, appendices, and at least one sobering diagram.`,
  (c) =>
    `Effective today, ${c.initiative} will examine the cultural, procedural, and surprisingly emotional dimensions of what occurred.`,
  (c) =>
    `Our corrective plan begins with ${c.initiative}. Progress will be measured not in promises, but in completed checklists and a measurable decline in avoidable follow-up messages.`,
  (c) =>
    `I have directed the board to fund ${c.initiative}, because accountability without a committee would be inconsistent with everything we stand for.`,
  (c) =>
    `The company will pair immediate retraining with ${c.initiative}. Every recommendation will be shared in a transparency report no shorter than the incident was small.`,
  (c) =>
    `We cannot template our way back to trust, but we can start with ${c.initiative}, independent oversight, and a stricter relationship with the ${c.ordinaryObject}.`,
] as const

const transitionFrames: readonly Frame[] = [
  () =>
    `Effective immediately, I will step down and transition into an unpaid advisory role with no access to email.`,
  () =>
    `I have asked the board to begin an orderly leadership transition while I focus on becoming worthy of the paper clip icon.`,
  () =>
    `Today, I am resigning from day-to-day leadership and surrendering my company laptop to the appropriate authorities.`,
  () =>
    `The board has accepted my decision to step aside, allowing steadier hands to guide this fictional institution forward.`,
  (c) =>
    `At the close of business, I will step down as ${c.role}. Leadership must have consequences, even when the original event barely did.`,
  () =>
    `I will leave my executive duties immediately and enter a period of listening, learning, and not being invited to recurring meetings.`,
  (c) =>
    `I have tendered my resignation to the board of ${c.company}. The transition will be orderly; the symbolism will be enormous.`,
  () =>
    `For the good of the organization, I am stepping away from daily operations and all decisions involving a send button.`,
  () =>
    `A new interim leader will assume my responsibilities while I undertake the difficult work of updating my notification settings.`,
  () =>
    `I will transition out of leadership over the coming hours, ensuring continuity without pretending continuity is the same as accountability.`,
] as const

const closingFrames: readonly Frame[] = [
  () =>
    `Trust is earned in drops and lost in one poorly considered click. I am sorry, and the work of earning it back in this wholly fictional crisis begins now.`,
  () =>
    `I cannot undo what happened. I can only meet it with honesty, humility, and a more disciplined relationship with technology. I am profoundly sorry for this fictional harm.`,
  () =>
    `May this be remembered not as the moment we failed, but as the moment we finally learned to double-check. To everyone affected by this fictional crisis: I am sorry.`,
  () =>
    `Words alone are insufficient. Only time, action, and meticulous attention to the compose window can repair this fictional breach. I am sorry.`,
  () =>
    `The statement ends here; accountability cannot. I am sorry for the wholly fictional damage caused by my extremely real failure to pay attention.`,
  () =>
    `History may judge this moment harshly, if history has truly run out of other material. Even so, I am sorry, and I will carry this fictional lesson forward.`,
  () =>
    `No closing line can make this fictional crisis right. Still, to those who expected the bare minimum and received a leadership transition instead: I am deeply sorry.`,
  () =>
    `We will move forward, but we will not move on. I am sorry for this entirely fictional breach of trust and for every dramatic sentence it required.`,
  () =>
    `This is not the end of the work; it is merely the end of page one. I am sorry, without qualification, for this fictional and magnificently overexamined failure.`,
  () =>
    `I offer no request for forgiveness - only a promise to become marginally better at routine tasks. I am sorry for this fictional crisis.`,
] as const

const rhetoricalFrames: readonly Frame[] = [
  (c) =>
    `We missed the moment. We missed the standard. We nearly missed the irony of convening a board meeting about a ${c.ordinaryObject}.`,
  () =>
    `What is leadership if not attention? What is accountability if not consequence? And what is a consequence if it does not include a carefully typeset statement?`,
  () =>
    `This was not merely an error. It was a mirror - small, unforgiving, and positioned directly in front of our corporate values.`,
  () =>
    `We can minimize the incident, or we can maximize the lesson. We have, with characteristic confidence, chosen the second option.`,
  (c) =>
    `A company is not its campus, its valuation, or its collection of branded mugs. It is the promise that someone will remember the ${c.ordinaryObject}.`,
  () =>
    `First came the mistake. Then came the silence. Then came a 6:00 a.m. invitation titled "Path Forward."`,
  () =>
    `Not because the task was difficult. Not because the stakes were unknowable. Because, for one consequential moment, care was absent.`,
  () =>
    `The facts fit in a sentence. The consequences require paragraphs. The learning journey, regrettably, will require a microsite.`,
] as const

const systemsLessonFrames: readonly Frame[] = [
  () =>
    `A review has already found no single point of failure, largely because every point was capable of preventing this.`,
  () =>
    `The controls existed. The training existed. The reminder existed. What did not exist, at the decisive moment, was follow-through.`,
  () =>
    `Our systems were designed for scale, resilience, and global complexity. They were less prepared for one person overlooking one obvious thing.`,
  () =>
    `This incident exposed a culture too comfortable with "someone probably handled it" and not comfortable enough with checking.`,
  () =>
    `Process did not fail in some abstract cloud. It failed here, in daylight, with the relevant button fully visible.`,
  () =>
    `We optimized for speed and forgot the radical operational value of pausing for four additional seconds.`,
] as const

const signoffs = [
  'With profound remorse and a renewed commitment to doing the bare minimum correctly,',
  'With humility, resolve, and all notifications now enabled,',
  'In accountability and extremely public reflection,',
  'With solemn regret and a newly updated checklist,',
  'In service of trust, transparency, and basic follow-through,',
  'With no excuses and several new approval gates,',
  'Respectfully, regretfully, and effective immediately,',
  'With contrition disproportionate to the original event,',
] as const

const solemnOpenings: readonly Frame[] = [
  (c) =>
    `To our employees, customers, partners, shareholders, neighbors, and the broader fictional technology community: I write today with a heavy heart. ${c.incident}. The facts are simple; their weight is not.`,
  (c) =>
    `There are moments when a leader must speak without varnish or delay. This is such a moment. ${c.incident}, and the trust placed in ${c.company} has been shaken.`,
  (c) =>
    `Today I must address an event that has traveled from a minor oversight to the center of our entirely fictional institution. ${c.incident}. I know that sentence changes everything, mostly because this statement insists that it does.`,
] as const

const disclosureOpenings: readonly Frame[] = [
  (c) =>
    `This statement provides a full account of the incident now affecting ${c.company}. At approximately the worst possible moment, ${c.incident}.`,
  (c) =>
    `In the interest of radical transparency, I am disclosing the complete sequence of recent events: ${c.incident}. No material fact has been omitted, although many adjectives have been added.`,
  (c) =>
    `Our preliminary review is complete. Its central finding can be stated plainly: ${c.incident}. What follows is the timeline, impact, and leadership response.`,
] as const

const confessionOpenings: readonly Frame[] = [
  (c) =>
    `I built ${c.company} around a simple belief: technology should make ordinary life easier. That belief makes what I must share especially painful. ${c.incident}.`,
  (c) =>
    `Before there was a company, there was an idea scribbled in a notebook. Before this statement, there was a much smaller sentence: ${c.incident}. I have spent the time since confronting what separates those two moments.`,
  (c) =>
    `I have always told our team that culture is revealed in the smallest choices. I did not expect to demonstrate the point personally, yet here we are: ${c.incident}.`,
] as const

const briefingOpenings: readonly Frame[] = [
  (c) => `Here is what happened: ${c.incident}.`,
  (c) => `The rumors are true. ${c.incident}.`,
  (c) => `No euphemisms. No preamble. ${c.incident}.`,
] as const

const briefingAccountability: readonly Frame[] = [
  () => `No excuses. This was my responsibility. I own it.`,
  () => `The failure was mine, and the accountability is mine too.`,
  () => `I made the mistake. I accept the consequences. Nothing else needs to carry the blame.`,
] as const

const briefingStakeholders: readonly Frame[] = [
  (c) => `Our stakeholders - especially ${c.affectedGroup} - deserved better.`,
  () => `Employees, customers, and every stakeholder who trusted us have every right to be disappointed.`,
  (c) =>
    `Stakeholders expected competence from ${c.company}. They received a crisis briefing instead.`,
] as const

const briefingReflections: readonly Frame[] = [
  (c) => `I have reflected ${c.reflectionSetting}. The lesson is simple: check again.`,
  () => `My reflection produced no grand explanation. I failed to give a small task sufficient care.`,
  (c) =>
    `I listened, I reflected, and I developed a newly respectful relationship with the ${c.ordinaryObject}.`,
] as const

const briefingActions: readonly Frame[] = [
  (c) => `Next: ${c.initiative}, independent oversight, and fewer assumptions.`,
  (c) => `${c.company} is establishing ${c.initiative}. Results will be public.`,
  (c) => `We will begin with ${c.initiative}. The work starts today.`,
] as const

const lamentOpenings: readonly Frame[] = [
  (c) =>
    `How does an institution lose its way? Rarely all at once. Sometimes it begins with a moment as ordinary as this: ${c.incident}.`,
  (c) =>
    `Every organization eventually meets the distance between its stated values and its actual behavior. For ${c.company}, that meeting came in an ordinary moment. ${c.incident}.`,
  (c) =>
    `We believed our principles were durable. We believed our processes were sound. Then it happened: ${c.incident}. Belief met the unforgiving calendar of events.`,
] as const

class Picker {
  private readonly random: RandomSource

  constructor(random: RandomSource) {
    this.random = random
  }

  pick<T>(items: readonly T[]): T {
    const value = Math.min(Math.max(this.random(), 0), 0.999999999)
    return items[Math.floor(value * items.length)]
  }

  chance(probability: number): boolean {
    return this.random() < probability
  }
}

const archetypes: readonly Archetype[] = [
  {
    id: 'solemn-address',
    titles: [
      'A Statement on Recent Events',
      'An Open Letter to Everyone We Let Down',
      'On Accountability and the Road Ahead',
    ],
    build: (context, parts, picker) => [
      picker.pick(solemnOpenings)(context),
      parts.accountability,
      parts.stakeholders,
      parts.reflection,
      ...(picker.chance(0.55) ? [parts.rhetoric] : []),
      parts.action,
      parts.transition,
      parts.closing,
    ],
  },
  {
    id: 'incident-disclosure',
    titles: [
      'Incident Disclosure and Leadership Update',
      'Preliminary Findings Regarding Recent Events',
      'A Full Accounting of What Occurred',
    ],
    build: (context, parts, picker) => [
      picker.pick(disclosureOpenings)(context),
      picker.pick([
        `The incident lasted seconds. The response mobilized eleven departments, two outside firms, and a shared document called FINAL_v7.`,
        `The timeline is brief: the warning signs appeared, the relevant control was available, and the necessary action did not occur.`,
        `Within minutes, our response protocol was activated. Within hours, the phrase "existential inflection point" had entered the meeting notes.`,
      ]),
      parts.systemsLesson,
      parts.accountability,
      parts.stakeholders,
      parts.action,
      parts.reflection,
      parts.transition,
      parts.closing,
    ],
  },
  {
    id: 'founder-confession',
    titles: [
      'A Personal Letter from Our Founder',
      'The Hardest Note I Have Had to Write Today',
      'What I Got Wrong',
    ],
    build: (context, parts, picker) => [
      picker.pick(confessionOpenings)(context),
      `${parts.accountability} ${parts.stakeholders}`,
      `${parts.reflection} ${parts.rhetoric}`,
      `${parts.action} ${parts.transition}`,
      parts.closing,
    ],
  },
  {
    id: 'emergency-briefing',
    titles: [
      'An Immediate Leadership Statement',
      'What Happened. What Changes Now.',
      'A Direct Update from the Executive Office',
    ],
    build: (context, parts, picker) => [
      picker.pick(briefingOpenings)(context),
      picker.pick(briefingAccountability)(context),
      picker.pick(briefingStakeholders)(context),
      picker.pick(briefingReflections)(context),
      picker.pick(briefingActions)(context),
      parts.transition,
      parts.closing,
    ],
  },
  {
    id: 'institutional-lament',
    titles: [
      'When Our Values Fell Short',
      'A Reckoning at a Fictional Institution',
      'The Standard We Failed to Meet',
    ],
    build: (context, parts, picker) => [
      picker.pick(lamentOpenings)(context),
      parts.rhetoric,
      parts.accountability,
      parts.stakeholders,
      ...(picker.chance(0.6) ? [parts.systemsLesson] : []),
      `${parts.reflection} ${parts.action}`,
      parts.transition,
      parts.closing,
    ],
  },
] as const

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

function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function toIncident(mistake: string): string {
  if (/^i\b/i.test(mistake)) {
    return mistake.replace(/^i\b/i, 'I')
  }

  return `I ${mistake}`
}

function hashSeed(seed: string | number): number {
  const value = String(seed)
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

export function createSeededRandom(seed: string | number): RandomSource {
  let state = hashSeed(seed)

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
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

export function generateApology(
  input: string,
  random: RandomSource = Math.random,
  previous?: Pick<Apology, 'archetype'>,
): Apology {
  const mistake = normalizeMistake(input)
  const picker = new Picker(random)
  const availableArchetypes = previous
    ? archetypes.filter((archetype) => archetype.id !== previous.archetype)
    : archetypes
  const archetype = picker.pick(availableArchetypes)
  const executivePool = archetype.id === 'founder-confession' ? founderExecutives : executives
  const [executive, role] = picker.pick(executivePool)
  const context: GenerationContext = {
    incident: toIncident(mistake),
    company: picker.pick(companies),
    executive,
    role,
    impact: picker.pick(impactMetaphors),
    reflectionSetting: picker.pick(reflectionSettings),
    initiative: picker.pick(initiatives),
    affectedGroup: picker.pick(affectedGroups),
    ordinaryObject: picker.pick(ordinaryObjects),
  }
  const parts: ApologyParts = {
    accountability: picker.pick(accountabilityFrames)(context),
    stakeholders: picker.pick(stakeholderFrames)(context),
    reflection: picker.pick(reflectionFrames)(context),
    action: picker.pick(actionFrames)(context),
    transition: picker.pick(transitionFrames)(context),
    closing: picker.pick(closingFrames)(context),
    rhetoric: picker.pick(rhetoricalFrames)(context),
    systemsLesson: picker.pick(systemsLessonFrames)(context),
  }

  return {
    title: picker.pick(archetype.titles),
    company: context.company,
    executive: context.executive,
    role: context.role,
    archetype: archetype.id,
    paragraphs: archetype.build(context, parts, picker),
    signoff: picker.pick(signoffs),
  }
}
