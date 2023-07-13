import { redirect } from '@remix-run/node'
import LRUCache from 'lru-cache'
import { EventEmitter } from 'node:events'
import { getSession } from './session.server'

declare global {
  var users: LRUCache<string, undefined>
  var chatEvents: EventEmitter
}

global.users =
  global.users ||
  new LRUCache({
    max: 100,
    ttl: 3_600_000,
  })
global.chatEvents = global.chatEvents || new EventEmitter()

export const chat = chatEvents