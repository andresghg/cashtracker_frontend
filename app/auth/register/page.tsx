import type { Metadata } from "next"
import RegisterForm from "@/components/auth/RegisterForm"
import Link from "next/link"

export const metadata: Metadata = {
  title: "CashTracker - Crear Cuenta",
  description: "CashTracker - Crear Cuenta"
}

export default function RegisterPage() {

  // const router = useRouter()
  return (
    <>
        <h1 className="font-black text-6xl text-purple-950">Crea una Cuenta</h1>
        <p className="text-3xl font-bold">y controla tus <span className="text-amber-500">finanzas</span></p>

        <RegisterForm />

        <nav className="mt-10 flex flex-col space-y-4">
          <Link href="/auth/login" className="text-center text-gray-500">¿Ya tienes una cuenta? Iniciar Sesion</Link>
          <Link href="/auth/forgot-password" className="text-center text-gray-500">¿Olvidaste tu contraseña? Reestablecer</Link>
        </nav>
    </>
  )
}
