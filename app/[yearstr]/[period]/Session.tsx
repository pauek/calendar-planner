import * as dates from "@/lib/dates"
import { cn, makeArray } from "@/lib/utils"

type SessionProps = {
  session: dates.SessionInfo
  className?: string
}
export default function Session({ session, className }: SessionProps) {
  if (session === undefined) {
    return <div></div>
  } else {
    let shift = session.shift ? -session.shift : 0

    let bg = ""
    if (shift == 1) {
      bg = "bg-red-100"
    } else if (shift == 2) {
      bg = "bg-red-200"
    }

    return (
      <div
        className={cn(
          "text-center h-[1.8em] text-[0.8rem]",
          "flex flex-col justify-center relative",
          bg,
          className
        )}
      >
        {session.text}
        {false && (
          <div
            className={cn(
              "absolute left-0 bottom-0 right-0 h-[0.35rem]",
              "flex flex-row justify-center items-stretch gap-0.5"
            )}
          >
            {makeArray({ length: shift }).map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-red-500"></div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
