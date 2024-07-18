import { Interval } from "@/lib/dates"
import { groupsOf } from "@/lib/utils"

type SlotSummaryProps = {
  intervals: Interval[]
}
export default function SlotSummary({ intervals }: SlotSummaryProps) {
  const grouped = groupsOf(2, intervals)
  return (
    <div className="min-h-[6em] flex-1 flex flex-col items-start">
      <table>
        <tbody>
          <tr>
            {grouped.map(([ival1, ival2], i) => (
              <tr key={i}>
                <td className="w-[5em] pr-2">{ival1.weekDay}</td>
                <td className="text-right pr-1">{ival1.startHour}h</td>
                <td className="text-gray-500">&ndash;</td>
                <td className="text-right">{ival1.endHour}h</td>
                <td>
                  <div className="w-4"></div>
                </td>
                {ival2 && (
                  <>
                    <td className="w-[5em] pr-2">{ival2.weekDay}</td>
                    <td className="text-right pr-1">{ival2.startHour}h</td>
                    <td className="text-gray-500">&ndash;</td>
                    <td className="text-right">{ival2.endHour}h</td>
                  </>
                )}
              </tr>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
