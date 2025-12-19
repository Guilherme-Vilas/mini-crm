"use client"

import { UserProfile } from "./user-profile"

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-slate-900">Leads</h2>
      <UserProfile />
    </header>
  )
}

