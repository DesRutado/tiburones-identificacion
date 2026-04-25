import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { searchSharks, sharkToContext } from '@/lib/search-sharks'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const question: string = body?.question?.trim() ?? ''

  if (!question) {
    return NextResponse.json({ error: 'Falta el campo question' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })
  }

  const matches = searchSharks(question, 5)
  const context = matches.length
    ? matches.map(sharkToContext).join('\n\n---\n\n')
    : ''

  const systemPrompt = `Eres un experto en identificación de tiburones del libro "Identificación de Tiburones" de Guillermo Carranza Hidalgo, que cubre 518 especies.
Responde en español, de forma clara y concisa.
Si la pregunta es sobre una especie concreta, usa la ficha proporcionada.
Si no hay información relevante en las fichas, di honestamente que no tienes datos sobre ese tema.
No inventes datos que no estén en las fichas.`

  const userMessage = context
    ? `Fichas relevantes del libro:\n\n${context}\n\n---\n\nPregunta: ${question}`
    : `Pregunta: ${question}\n\n(No se encontraron fichas específicas en la base de datos. Responde basándote en tu conocimiento general sobre tiburones si puedes, o indica que no tienes esa información.)`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
  })

  const text =
    message.content[0]?.type === 'text' ? message.content[0].text : ''

  return NextResponse.json({ answer: text, sources: matches.map((s) => s.nombre_cientifico) })
}
