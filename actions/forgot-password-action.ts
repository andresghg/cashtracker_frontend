"use server"

import { ForgotPasswordSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas/index"


type ActionStateType = {
    errors: string[]
    success: string
}

export async function forgotPassword(prevState: ActionStateType, formData: FormData) {
    
    const forgotPassword = ForgotPasswordSchema.safeParse({
        email: formData.get("email")
    })

    if(!forgotPassword.success) {
        const errors = forgotPassword.error.errors.map(error => error.message)
        return {
            errors,
            success: ''
        }
    }

    const url = `${process.env.API_URL}/auth/forgot-password`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: forgotPassword.data.email
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
