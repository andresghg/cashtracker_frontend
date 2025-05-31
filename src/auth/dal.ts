import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { UserSchema } from "../schemas"
import getToken from "./token"

export const verifySession = cache(async () => {
  const token = await getToken()
  if(!token) {
    redirect('/auth/login')
  }

  const url = `${process.env.API_URL}/auth/user`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const json = await response.json()

  const result = UserSchema.safeParse(json)
  if(!result.success) {
    redirect('/auth/login')
  }

  return {
    user: result.data,
    isAuth: true
  }
})