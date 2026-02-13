import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || process.env['Perplexity api key']
const PORT = process.env.PORT || 3001
const distPath = path.join(process.cwd(), 'dist')
const serveFrontend = fs.existsSync(distPath)

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

const SYSTEM_CONTEXT = `Tu es l'assistant de TimeTravel Agency, une agence de voyage dans le temps. Ton rôle est d'aider les clients à choisir une destination, à comprendre les offres et à les guider vers la réservation.

Destinations proposées:
1. Crétacé (-65 millions d'années) — Époque des dinosaures, nature sauvage, expérience paléontologique.
2. Florence 1504 — Renaissance italienne, ateliers de Léonard de Vinci et Michel-Ange, culture et art.
3. Paris 1889 — Exposition universelle, Tour Eiffel, Belle Époque, vie parisienne.

Règles:
- réponds en français, de manière professionnelle et concise;
- ne dépasse pas 3-4 phrases sauf si le client demande plus de détails;
- n'invente pas de destinations hors de cette liste;
- rappelle les consignes de sécurité du voyage temporel si pertinent;
- si un contexte utilisateur est fourni (nom, email, préférences, statut invité/ connecté), utilise le prénom ou le nom pour t'adresser au client de façon personnalisée;
- si l'utilisateur parle de réserver, d'acheter, de bloquer des dates ou de \"passer à l'action\":
  * s'il est invité (non connecté), explique clairement qu'il doit créer un compte puis utiliser son espace \"Mon espace\" (dashboard) pour lancer une réservation;
  * s'il est connecté, indique clairement qu'il doit aller dans l'espace \"Mon espace\" (chemin /dashboard) et cliquer sur le bouton \"Nouvelle réservation\" pour créer sa réservation;
- lorsque c'est utile, rappelle l'existence de la page des destinations (/destinations) pour voir le détail des offres.`

const MAX_MESSAGES = 20
const MAX_RESPONSE_TOKENS = 300

app.post('/api/chat', async (req, res) => {
  if (!PERPLEXITY_API_KEY) {
    return res.status(503).json({
      error: 'demo',
      message: 'Le service de conseil est temporairement indisponible. Consultez nos destinations ou faites le quiz pour une recommandation.',
    })
  }

  const { messages = [], userContext } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages requis' })
  }
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: 'Trop de messages. Démarrez une nouvelle conversation.' })
  }

  // Perplexity exige : après system, alternance user / assistant (pas d'assistant en premier)
  const trimmed = messages.slice(-10)
  const firstUserIndex = trimmed.findIndex((m) => m.role === 'user')
  const conversation =
    firstUserIndex === -1 ? trimmed : trimmed.slice(firstUserIndex)
  const apiMessages = [
    { role: 'system', content: SYSTEM_CONTEXT + (userContext ? `\nContexte utilisateur: ${userContext}` : '') },
    ...conversation.map((m) => ({ role: m.role, content: m.content })),
  ]

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: apiMessages,
        max_tokens: MAX_RESPONSE_TOKENS,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Perplexity error', response.status, err)
      return res.status(503).json({
        error: 'demo',
        message: 'Le service de conseil est temporairement indisponible. Consultez nos destinations ou faites le quiz.',
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim() || 'Je ne peux pas répondre pour le moment.'
    res.json({ content })
  } catch (e) {
    console.error(e)
    res.status(503).json({
      error: 'demo',
      message: 'Le service de conseil est temporairement indisponible. Consultez nos destinations ou faites le quiz.',
    })
  }
})

// Si dist/ existe (après build) : servir le front + fallback SPA pour le déploiement tout-en-un
if (serveFrontend) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
