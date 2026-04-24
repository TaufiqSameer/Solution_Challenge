import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { onAuthChange } from "../services/auth"
import type { User } from "firebase/auth"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u))
    return () => unsub()
  }, [])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="text-slate-500 text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}