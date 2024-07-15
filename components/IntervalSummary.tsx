import { Interval, slotsToIntervals } from "@/lib/dates";

type SlotSummaryProps = {
  intervals: Interval[];
};
export default function SlotSummary({ intervals }: SlotSummaryProps) {
  return (
    <div className="min-h-[10em] flex-1 flex flex-col items-start">
      <table>
        <tbody>
          {intervals.map((ival, i) => (
            <tr key={i}>
              <td className="w-[5em] pr-2">{ival.weekDay}</td>
              <td className="text-right pr-1">{ival.startHour}h</td>
              <td className="text-gray-500">&ndash;</td>
              <td className="text-right">{ival.endHour}h</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
