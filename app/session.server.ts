import { createCookieSessionStorage } from '@remix-run/node'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      expires: new Date(Date.now() + 3_600_000), // In 1 hour
      maxAge: 3_600, // 1 Hour
    },
  })