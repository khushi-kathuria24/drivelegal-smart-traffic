'use client'

import React, { useState } from 'react'
import { Send, Paperclip, Mic, Copy, ThumbsUp, ThumbsDown, BookOpen, ShieldCheck, FileSearch } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { trafficLaws } from '@/lib/mockData'

const initialMessages = [
  {
    id: 'msg_001',
    role: 'assistant' as const,
    content: 'Hello! I\'m your AI Legal Assistant. I can help you understand traffic laws, calculate fines, answer legal questions, and provide driving safety guidance. How can I assist you today?',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
]

export default function AssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<any>(null)
  const [selectedCitationDetails, setSelectedCitationDetails] = useState<any>(null)

  const getRelevantLaws = (query: string) => {
    const normalized = query.toLowerCase()

    if (normalized.includes('helmet')) {
      return trafficLaws.filter((law) => law.relatedSections.includes('129'))
    }

    if (normalized.includes('speed')) {
      return trafficLaws.filter((law) => law.relatedSections.includes('188'))
    }

    if (normalized.includes('parking')) {
      return trafficLaws.filter((law) => law.relatedSections.includes('173'))
    }

    return trafficLaws.slice(0, 2)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const relevantLaws = getRelevantLaws(input)
      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant' as const,
        content:
          'Thank you for your question. Based on the cited law sections, ' +
          (input.toLowerCase().includes('helmet')
            ? 'wearing a helmet is mandatory for motorcycle riders under the Motor Vehicles Act and related state rules. Non-compliance may attract a fine and enforcement action.'
            : input.toLowerCase().includes('speed')
            ? 'speeding penalties depend on road type and local enforcement rules. Always verify the posted limit before driving.'
            : 'I recommend checking the referenced sections of the Motor Vehicles Act and the applicable state amendment before acting on the advice.'),
        timestamp: new Date().toISOString(),
        citations: relevantLaws.map((law) => ({
          id: law.id,
          title: law.title,
          source: law.source,
          state: law.state,
          relevance: 0.9,
          sections: law.relatedSections,
          amendmentDate: law.amendmentDate || 'State amendment varies',
        })),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
    }, 1000)
  }

  const suggestedQuestions = [
    'What is the fine for speeding in Karnataka?',
    'How do I calculate my challan amount?',
    'What documents are required for vehicle registration?',
    'What are the helmet safety requirements?',
    'How do I appeal a traffic violation?',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">AI Legal Assistant</h1>
        <p className="mt-1 max-w-3xl text-dark-700 dark:text-dark-300">
          Ask questions about traffic laws, fines, and road safety regulations
        </p>
      </div>

      <Card className="border border-success-100 bg-white/95 dark:border-dark-700 dark:bg-dark-800">
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 text-success-600 dark:text-success-400" size={20} />
            <div>
              <p className="font-semibold text-dark-900 dark:text-white">Legal accuracy</p>
              <p className="text-sm text-dark-600 dark:text-dark-300">
                Responses are tied to actual Motor Vehicles Act sections and state amendments shown in the citations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileSearch className="mt-0.5 text-primary-600 dark:text-primary-300" size={20} />
            <div>
              <p className="font-semibold text-dark-900 dark:text-white">Traceable sources</p>
              <p className="text-sm text-dark-600 dark:text-dark-300">
                Every answer includes section references so users can verify the legal basis quickly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <Card className="flex h-[600px] flex-col">
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-bold">
                        AI
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-md rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-dark-50'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="mt-2 flex gap-2">
                        <button className="rounded p-1 hover:bg-dark-200 dark:hover:bg-dark-600">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="rounded p-1 hover:bg-dark-200 dark:hover:bg-dark-600">
                          <ThumbsDown size={14} />
                        </button>
                        <button className="rounded p-1 hover:bg-dark-200 dark:hover:bg-dark-600">
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                    {message.role === 'assistant' && message.citations && (
                      <div className="mt-3 space-y-2 border-t border-dark-200 pt-3 dark:border-dark-600">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-500 dark:text-dark-400">
                          Cited sections
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((citation: any) => (
                            <button
                              key={citation.id}
                              onClick={async () => {
                                setSelectedCitation(citation)
                                try {
                                  const res = await fetch(`/api/laws/${citation.id}`)
                                  const body = await res.json()
                                  setSelectedCitationDetails(body.law || null)
                                } catch (e) {
                                  console.warn('Fetch citation failed', e)
                                  setSelectedCitationDetails(null)
                                }
                              }}
                              className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[11px] font-medium text-primary-700 transition hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-900/30 dark:text-primary-200 dark:hover:bg-primary-900/50"
                            >
                              {citation.title} · Sec. {citation.sections?.join(', ') || 'N/A'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-dark-300 dark:bg-dark-600" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-bold">
                    AI
                  </div>
                  <div className="flex gap-1 rounded-lg bg-dark-100 px-4 py-3 dark:bg-dark-700">
                    <div className="h-2 w-2 rounded-full bg-dark-400 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="h-2 w-2 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t border-dark-200 p-4 dark:border-dark-700">
              <div className="flex gap-2">
                <button className="rounded-lg p-2 hover:bg-dark-100 dark:hover:bg-dark-700">
                  <Paperclip size={18} className="text-dark-600 dark:text-dark-400" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about traffic laws, fines, regulations..."
                  className="input flex-1"
                />
                <button className="rounded-lg p-2 hover:bg-dark-100 dark:hover:bg-dark-700">
                  <Mic size={18} className="text-dark-600 dark:text-dark-400" />
                </button>
                <Button onClick={handleSend} loading={loading} size="md">
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar - Citations & Suggestions */}
        <div className="space-y-4">
          {/* Quick Suggestions */}
          <Card>
            <CardHeader title="Quick Questions" />
            <CardContent>
              <div className="space-y-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="block w-full rounded-lg border border-dark-200 bg-white p-2 text-left text-xs font-medium transition-all hover:bg-primary-50 hover:border-primary-300 dark:border-dark-600 dark:bg-dark-800 dark:hover:bg-dark-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legal References */}
            {selectedCitationDetails ? (
              <Card>
                <CardHeader title="Citation Details" subtitle={selectedCitationDetails.source || 'Source'} />
                <CardContent>
                  <p className="font-semibold">{selectedCitationDetails.title}</p>
                  <p className="text-sm text-dark-600 dark:text-dark-400 mt-2">{selectedCitationDetails.description}</p>
                  <p className="text-xs text-dark-500 dark:text-dark-400 mt-3">State: {selectedCitationDetails.state}</p>
                  <p className="text-xs text-dark-500 dark:text-dark-400">Sections: {selectedCitationDetails.relatedSections?.join(', ')}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader title="Legal References" subtitle="Important Acts, sections, and state rules" />
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-dark-50 p-3 dark:bg-dark-700">
                      <div className="flex items-start gap-2">
                        <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                        <div>
                          <p className="text-sm font-medium">Motor Vehicles Act, 1988</p>
                          <p className="text-xs text-dark-600 dark:text-dark-400">Central Government · Sections 129, 173, 188, 336</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-dark-50 p-3 dark:bg-dark-700">
                      <div className="flex items-start gap-2">
                        <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                        <div>
                          <p className="text-sm font-medium">Karnataka Traffic Rules</p>
                          <p className="text-xs text-dark-600 dark:text-dark-400">Karnataka Government · State amendments included</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="secondary" className="w-full justify-center">
                      View All References
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* AI Features */}
          <Card>
            <CardHeader title="AI Capabilities" />
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-success-600" />
                  <span>Multi-language support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-success-600" />
                  <span>Document OCR</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-success-600" />
                  <span>Real-time citations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-success-600" />
                  <span>Voice input/output</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
