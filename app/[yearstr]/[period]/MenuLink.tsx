"use client"

import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

type MenuLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}
export default function MenuLink({ href, className, children }: MenuLinkProps) {
  const path = usePathname()

  return (
    <Link href={href} className="font-semibold text-xl">
      <div className={cn("py-1", path === href ? "bg-primary text-background" : "", className)}>{children}</div>
    </Link>
  )
}
