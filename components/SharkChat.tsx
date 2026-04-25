'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function SharkChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const q = input.trim()
    if (!q || loading) return

    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setLoading(true)

    try {
      const res = await fetch('/api/shark-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer ?? 'No se pudo obtener respuesta.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error al conectar con el asistente.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 100) + 'px'
  }

  return (
    <>
      <button
        className="sc-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat' : 'Abrir asistente de tiburones'}
        aria-expanded={open}
      >
        {open ? (
          <span className="sc-x">✕</span>
        ) : (
          <Image
            src="/img3.webp"
            alt="Identificación de Tiburones"
            width={56}
            height={56}
            className="sc-avatar"
          />
        )}
      </button>

      {open && (
        <div className="sc-panel" role="dialog" aria-label="Chat de tiburones">
          <div className="sc-header">
            <Image src="/img3.webp" alt="Logo" width={32} height={32} className="sc-header-img" />
            <div>
              <div className="sc-header-title">Identificación de Tiburones</div>
              <div className="sc-header-sub">513 especies · Pregunta lo que quieras</div>
            </div>
          </div>

          <div className="sc-messages">
            {messages.length === 0 && (
              <div className="sc-welcome">
                <p>
                  Hola, soy el asistente del libro{' '}
                  <em>Identificación de Tiburones</em>. Puedo responder sobre
                  morfología, hábitat, dieta, reproducción y taxonomía de
                  las 513 especies recogidas en la obra.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`sc-msg sc-msg--${msg.role}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && (
              <div className="sc-msg sc-msg--assistant sc-dots">
                <span /><span /><span />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="sc-footer">
            <textarea
              ref={textareaRef}
              className="sc-input"
              placeholder="Pregunta sobre cualquier especie…"
              value={input}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className="sc-send"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Enviar"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  )
}
