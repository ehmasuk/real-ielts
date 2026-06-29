import { OAuth2Client } from "google-auth-library"
import env from "../../config/env.js"
import { User } from "../../models/user.model.js"
import { signAccessToken } from "../../utils/tokenHandlers.js"
import newError from "../../utils/newError.js"

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

async function findOrCreateUser(payload: {
  sub: string
  email?: string
  name?: string
  picture?: string
}) {
  let user = await User.findOne({ googleId: payload.sub })

  if (user) {
    user.name = payload.name ?? user.name
    user.picture = payload.picture ?? user.picture
    user.lastLoginAt = new Date()
    await user.save()
    return user
  }

  user = await User.create({
    googleId: payload.sub,
    email: payload.email ?? "",
    name: payload.name ?? "",
    picture: payload.picture ?? "",
    role: "student",
    status: "active",
    lastLoginAt: new Date(),
  })

  return user
}

const authServices = {
  sync: async (payload: { sub: string; email?: string; name?: string; picture?: string }) => {
    const user = await findOrCreateUser(payload)

    if (user.status !== "active") {
      throw newError({ message: "Account is disabled", statusCode: 403 })
    }

    const token = signAccessToken({ id: user.id, role: user.role })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    }
  },

  googleSignIn: async ({ idToken }: { idToken: string }) => {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    })

    const googlePayload = ticket.getPayload()
    if (!googlePayload) throw newError({ message: "Invalid Google token", statusCode: 401 })

    const user = await findOrCreateUser({
      sub: googlePayload.sub,
      ...(googlePayload.email ? { email: googlePayload.email } : {}),
      ...(googlePayload.name ? { name: googlePayload.name } : {}),
      ...(googlePayload.picture ? { picture: googlePayload.picture } : {}),
    })

    if (user.status !== "active") {
      throw newError({ message: "Account is disabled", statusCode: 403 })
    }

    const token = signAccessToken({ id: user.id, role: user.role })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    }
  },

  getMe: async (userId: string) => {
    const user = await User.findById(userId)
    if (!user) throw newError({ message: "User not found", statusCode: 404 })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    }
  },
}

export default authServices
