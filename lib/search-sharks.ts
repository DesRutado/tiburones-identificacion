import fs from 'fs'
import path from 'path'

export interface Shark {
  nombre_comun: string
  nombre_cientifico: string
  orden: string
  familia: string
  genero: string
  tamano: string
  habitat: string
  dieta: string
  reproduccion: string
  descripcion: string
}

let _cache: Shark[] | null = null

function loadSharks(): Shark[] {
  if (_cache) return _cache
  const file = path.join(process.cwd(), 'lib', 'sharks.json')
  _cache = JSON.parse(fs.readFileSync(file, 'utf-8')) as Shark[]
  return _cache
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(s: string): string[] {
  return normalize(s).split(' ').filter((t) => t.length > 2)
}

const STOP_TOKENS = new Set([
  'que', 'de', 'en', 'la', 'el', 'los', 'las', 'una', 'uno',
  'con', 'por', 'para', 'del', 'al', 'se', 'es', 'son',
  'sus', 'su', 'les', 'lo', 'le', 'nos', 'me', 'te',
  'hay', 'como', 'pero', 'mas', 'muy', 'sin', 'has',
  'the', 'and', 'are', 'for', 'its', 'can',
])

function meaningful(tokens: string[]): string[] {
  return tokens.filter((t) => !STOP_TOKENS.has(t))
}

// Keys are normalized (no accents). Values use terms the book actually uses.
// Habitat vocabulary in the book: pacifico, atlantico, indico, tropical,
// subtropical, arrecife, coral, plataforma, talud, australia, indonesia, filipinas, japon
const GEO_SYNONYMS: Record<string, string[]> = {
  // Caribbean / Atlantic Americas
  belice:      ['atlantico', 'tropical', 'arrecife', 'coral', 'plataforma'],
  caribe:      ['atlantico', 'tropical', 'arrecife', 'coral'],
  cuba:        ['atlantico', 'tropical', 'arrecife'],
  bahamas:     ['atlantico', 'tropical', 'arrecife'],
  jamaica:     ['atlantico', 'tropical', 'arrecife'],
  haiti:       ['atlantico', 'tropical'],
  trinidad:    ['atlantico', 'tropical'],
  barbados:    ['atlantico', 'tropical'],
  honduras:    ['atlantico', 'tropical', 'arrecife'],
  nicaragua:   ['atlantico', 'pacifico', 'tropical'],
  costarica:   ['pacifico', 'atlantico', 'tropical'],
  panama:      ['pacifico', 'atlantico', 'tropical'],
  // North / Central America
  mexico:      ['pacifico', 'atlantico', 'tropical', 'subtropical'],
  california:  ['pacifico', 'subtropical'],
  florida:     ['atlantico', 'tropical', 'subtropical'],
  eeuu:        ['atlantico', 'pacifico', 'subtropical'],
  usa:         ['atlantico', 'pacifico', 'subtropical'],
  // South America
  colombia:    ['pacifico', 'atlantico', 'tropical'],
  venezuela:   ['atlantico', 'tropical'],
  brasil:      ['atlantico', 'tropical'],
  ecuador:     ['pacifico', 'tropical'],
  peru:        ['pacifico', 'subtropical'],
  chile:       ['pacifico', 'subtropical'],
  argentina:   ['atlantico', 'subtropical'],
  // Atlantic Africa
  senegal:     ['atlantico', 'tropical'],
  ghana:       ['atlantico', 'tropical'],
  nigeria:     ['atlantico', 'tropical'],
  angola:      ['atlantico', 'tropical'],
  namibia:     ['atlantico', 'subtropical'],
  marruecos:   ['atlantico', 'occidental', 'subtropical'],
  canarias:    ['atlantico', 'subtropical'],
  // Mediterranean
  mediterraneo: ['atlantico', 'occidental'],
  espana:      ['atlantico', 'occidental', 'subtropical'],
  italia:      ['atlantico', 'occidental'],
  grecia:      ['atlantico', 'oriental'],
  turquia:     ['atlantico', 'oriental'],
  tunez:       ['atlantico', 'occidental'],
  libia:       ['atlantico', 'oriental'],
  croacia:     ['atlantico', 'oriental'],
  // Indo-Pacific
  indo:        ['indico', 'pacifico', 'tropical'],
  indopacific: ['indico', 'pacifico', 'tropical'],
  // Southeast Asia / Pacific
  indonesia:   ['pacifico', 'indico', 'tropical', 'arrecife', 'coral'],
  filipinas:   ['pacifico', 'tropical', 'arrecife', 'coral'],
  malasia:     ['pacifico', 'indico', 'tropical'],
  tailandia:   ['indico', 'tropical'],
  vietnam:     ['pacifico', 'tropical'],
  birmania:    ['indico', 'tropical'],
  camboya:     ['pacifico', 'tropical'],
  singapur:    ['pacifico', 'indico', 'tropical'],
  papua:       ['pacifico', 'tropical', 'coral'],
  // Australia & Oceania
  australia:   ['australia', 'pacifico', 'indico', 'tropical', 'coral'],
  oceania:     ['pacifico', 'tropical'],
  zelanda:     ['pacifico', 'subtropical'],
  hawaii:      ['pacifico', 'tropical'],
  // East Asia
  japon:       ['pacifico', 'noroccidental'],
  china:       ['pacifico', 'tropical'],
  corea:       ['pacifico'],
  taiwan:      ['pacifico', 'tropical'],
  // Indian Ocean
  india:       ['indico', 'tropical'],
  maldivas:    ['indico', 'tropical', 'arrecife'],
  srilanka:    ['indico', 'tropical'],
  madagascar:  ['indico', 'tropical'],
  mozambique:  ['indico', 'tropical'],
  sudafrica:   ['indico', 'atlantico', 'subtropical'],
  kenia:       ['indico', 'tropical'],
  tanzania:    ['indico', 'tropical'],
  somalia:     ['indico', 'tropical'],
  oman:        ['indico', 'tropical'],
  yemen:       ['indico', 'tropical'],
  pakistan:    ['indico', 'tropical'],
  // Red Sea / Arabian
  egipto:      ['indico', 'tropical'],
  arabia:      ['indico', 'tropical'],
  // Ocean basins typed directly
  pacifico:    ['pacifico'],
  atlantico:   ['atlantico'],
  indico:      ['indico'],
}

// Minimum results to return when geographic expansion is applied
const GEO_LIMIT = 15

function scoreShark(shark: Shark, queryTokens: string[]): number {
  if (!queryTokens.length) return 0

  const fields: Array<[string, number]> = [
    [shark.nombre_comun, 10],
    [shark.nombre_cientifico, 10],
    [shark.orden, 5],
    [shark.familia, 5],
    [shark.genero, 5],
    [shark.descripcion, 3],
    [shark.habitat, 2],
    [shark.dieta, 2],
    [shark.reproduccion, 2],
    [shark.tamano, 1],
  ]

  let score = 0
  for (const [field, weight] of fields) {
    const norm = normalize(field)
    for (const token of queryTokens) {
      if (norm.includes(token)) score += weight
    }
  }
  return score
}

export function searchSharks(query: string, limit = 5): Shark[] {
  const sharks = loadSharks()
  const rawTokens = meaningful(tokenize(query))

  // Expand geographic synonyms
  let geoExpanded = false
  const extraTokens: string[] = []
  for (const token of rawTokens) {
    const syns = GEO_SYNONYMS[token]
    if (syns) {
      extraTokens.push(...syns)
      geoExpanded = true
    }
  }

  const tokens = geoExpanded
    ? [...new Set([...rawTokens, ...extraTokens])]
    : rawTokens

  if (!tokens.length) return []

  const effectiveLimit = geoExpanded ? Math.max(limit, GEO_LIMIT) : limit

  const scored = sharks
    .map((s) => ({ shark: s, score: scoreShark(s, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, effectiveLimit)

  return scored.map(({ shark }) => shark)
}

export function sharkToContext(shark: Shark): string {
  const parts = [
    `**${shark.nombre_comun}** (${shark.nombre_cientifico})`,
    `Orden: ${shark.orden} | Familia: ${shark.familia}`,
    `Tamaño: ${shark.tamano}`,
  ]
  if (shark.descripcion) parts.push(`Morfología: ${shark.descripcion}`)
  if (shark.habitat) parts.push(`Hábitat: ${shark.habitat}`)
  if (shark.dieta) parts.push(`Dieta: ${shark.dieta}`)
  if (shark.reproduccion) parts.push(`Reproducción: ${shark.reproduccion}`)
  return parts.join('\n')
}
