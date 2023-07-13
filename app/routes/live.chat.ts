import type { LoaderFunction } from '@remix-run/node'
import type { ChatMessage } from '~/chat'
import {
  addUser,
  chat,
  doesUserExist,
  getSessionUser,
  getUsers,
  removeUser,
} from '~/chat.server'

export const loader: LoaderFunction = async ({ request }) => {
  if (!request.signal) return new Response(null, { status: 500 })
  const user = await getSessionUser(request)

  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        const handleChatMessage = ({ user, message }: ChatMessage) => {
          console.log('message', { user, message })
          controller.enqueue(encoder.encode('event: message\n'))
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ user, message })}\n\n`)
          )
        }
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream' } }
  )
}
