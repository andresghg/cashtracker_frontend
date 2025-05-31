"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorResponseSchema, LoginSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[]
}

export async function authenticate(prevState: ActionStateType, formData: FormData) {
    const loginCredentials = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

    const auth = LoginSchema.safeParse(loginCredentials)
    if (!auth.success) {
        const errors = auth.error.errors.map(error => error.message)
        return { errors }
    }

    const url = `${process.env.API_URL}/auth/login`

    try {
        const req = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: auth.data.email,
                password: auth.data.password
            })
        })

        const contentType = req.headers.get("content-type") || ""

        if (!req.ok) {
            if (!contentType.includes("application/json")) {
                const text = await req.text()
                console.error("Respuesta no JSON:", text)
                return { errors: ["Error inesperado del servidor."] }
            }

            const json = await req.json()
            const { error } = ErrorResponseSchema.parse(json)
            return { errors: [error] }
        }

        const json = await req.json()

        if (!json.token || typeof json.token !== "string") {
            return { errors: ["Token inválido en la respuesta."] }
        }

        // Setear Cookies
        (await cookies()).set({
            name: 'CASHTRACKER_TOKEN',
            value: json.token,
            httpOnly: true,
            path: '/',
        })

        redirect('/admin')

    } catch (err) {
        console.error("Error de conexión:", err)
        return { errors: ["No se pudo conectar con el servidor."] }
    }
}
