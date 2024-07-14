import React from "react";

const weekDays = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export default function Page() {
  return (
    <main className="p-6">
      <h1>Timetable</h1>
      <table className="border-collapse timetable mb-6">
        <tbody>
          <tr>
            <td className="hour">
              <div>{hours[0]}h</div>
            </td>
            {weekDays.map((wd) => (
              <th className="text-center font-bold" key={wd}>
                {wd}
              </th>
            ))}
          </tr>
          {hours.slice(1).map((h) => (
            <tr key={h}>
              <td className="hour">
                <div>{h}h</div>
              </td>
              {weekDays.map((_, i) => (
                <td key={i}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Groups</h1>

    </main>
  );
}
