"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] cb-in">
      <div className="w-full max-w-[320px]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-blue flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
            NF
          </div>
          <h1 className="text-xl font-bold mb-1">Acceso privado</h1>
          <p className="text-fg-tertiary text-sm">Ingresa tu contrasena para continuar</p>
        </div>
        <form action={action} className="space-y-4">
          <input type="password" name="password" required placeholder="Contrasena" className="admin-input text-center" />
          {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
          <button type="submit" disabled={pending} className="btn-blue w-full py-2.5">
            {pending ? "Entrando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
