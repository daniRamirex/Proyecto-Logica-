import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "The Sonic Ledger - Music Rights Management",
  description: "Platform for managing music copyrights with role-based access control",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-white">{children}</body>
    </html>
  )
}
