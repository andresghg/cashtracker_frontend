"use server"

import { ProfileFormSchema, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import getToken from "@/src/auth/token"
import { revalidatePath } from "next/cache"

type ActionStateType = {
    errors: string[]
    success: string
}

export async function updateProfile(prevState: ActionStateType, formData: FormData) {
    const profileData = ProfileFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email")
    })

    if(!profileData.success) {
        return {
            errors: profileData.error.errors.map(error => error.message),
            success: ''
        }
    }

    const token = await getToken()
    const url = `${process.env.API_URL}/auth/user`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: profileData.data.name,
            email: profileData.data.email
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

    revalidatePath('/admin/profile/settings')
    const success = SuccessSchema.parse(json)

    return {
        errors: [],
        success
    }
}