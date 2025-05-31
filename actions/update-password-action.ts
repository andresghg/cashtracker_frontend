"use server"

import { UpdatePasswordSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import getToken from "@/src/auth/token"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function updatePassword(prevState: ActionStateType, formData: FormData) {
    
    const userPassword = UpdatePasswordSchema.safeParse({
        current_password: formData.get("current_password"),
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation")
    })

    if(!userPassword.success) {
        const errors = userPassword.error.errors.map(error => error.message)
        return {
            errors,
            success: ''
        }
    }

    const token = await getToken()
    const url = `${process.env.API_URL}/auth/update-password`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            current_password: userPassword.data.current_password,
            password: userPassword.data.password
        })
    })

    const json = await req.json()

    if(!req.ok) {
        const { error } = ErrorResponseSchema.parse(json)
        return {
            errors: [error],
            success: ''
        }
    }

    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}