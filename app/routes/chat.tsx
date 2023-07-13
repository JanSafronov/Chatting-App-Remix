import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useTransition } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '~/chat'
import { getSessionUser, getUsers, sendMessage } from '~/chat.server'
import { destroySession, getSession } from '~/session.server'

const MAX_MESSAGE_LENGTH = 256

interface LoaderData {
  user: string
  users: string[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getSessionUser(request)
  return json<LoaderData>({ user, users: getUsers() })
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getSessionUser(request)
  const formData = await request.formData()
  const action = String(formData.get('_action'))

  if (action === 'logout') {
    const session = await getSession(request.headers.get('Cookie'))
    return redirect('/', {
      headers: { 'Set-Cookie': await destroySession(session) },
    })
  }

  if (action === 'send-message') {
    const message = String(formData.get('message')).slice(0, MAX_MESSAGE_LENGTH)
    if (message.length > 0) {
      sendMessage(user, message)
    }
  }

  return null
}