"use server"

import getToken from "@/src/auth/token"
import { Budget, Expense, ErrorResponseSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"

type BudgetAndExpenseIdType = {
    budgetId: Budget['id']
    expenseId: Expense['id']
}

type ActionStateType = {
    errors: string[]
    success: string
}

export default async function deleteExpense({budgetId, expenseId}: BudgetAndExpenseIdType, prevState: ActionStateType) {
    const token = await getToken()
    const url = `${process.env.API_URL}/budgets/${budgetId}/expenses/${expenseId}`
    const req = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()
    if(!req.ok) {
        const { error } = ErrorResponseSchema.parse(json.error)
        return {
            errors: [error],
            success: ''
        }
    }

    revalidatePath(`/admin/budgets/${budgetId}`)
    const success = SuccessSchema.parse(json)
    
    return {
        errors: [],
        success
    }
}