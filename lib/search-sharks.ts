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
  const tokens = meaningful(tokenize(query))

  if (!tokens.length) return []

  const scored = sharks
    .map((s) => ({ shark: s, score: scoreShark(s, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

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
