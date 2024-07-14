import { selectedHoursToIntervals } from "@/lib/dates";

type SlotSummaryProps = {
  slots: Set<string>;
};
export default function SlotSummary({ slots }: SlotSummaryProps) {
  return (
    <div className="min-h-[10em] flex flex-col items-start">
      <table>
        <tbody>
          {selectedHoursToIntervals(slots).map((ival, i) => (
            <tr key={i}>
              <td className="pr-2">{ival.weekDay}</td>
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
