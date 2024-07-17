import React from "react"

type PageProps = {
  params: {
    year: string
  }
}
export default function Page({ params }: PageProps) {
  const { year: yearStr } = params
  return <div>{yearStr}</div>
}
