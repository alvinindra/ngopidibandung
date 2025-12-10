"use client"

import { useTheme } from "next-themes"
import { Toaster as SonnerToaster, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <SonnerToaster
      theme={theme}
      closeButton
      richColors
      position="top-center"
      toastOptions={{ duration: 4000 }}
      {...props}
    />
  )
}
