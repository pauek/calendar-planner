import React from "react"

type PageProps = {
  params: {
    year: string
    semester: string
  }
}
export default function Page({ params }: PageProps) {
  const { year: yearStr, semester: semStr } = params
  return <div>{yearStr} - {semStr}</div>
}
