function formatICSDate(date: string, time: string) {
  // Returns e.g. 20261110T133000 — floating local time with an
  // Asia/Kolkata TZID reference, which Google/Apple/Outlook all resolve
  // correctly without needing a full embedded VTIMEZONE block.
  return `${date}T${time}`;
}

function escapeICS(text: string) {
  return text.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

interface EventDef {
  summary: string;
  description: string;
  location: string;
  startDate: string; // YYYYMMDD
  startTime: string; // HHMMSS
  endTime: string; // HHMMSS
}

const EVENTS: EventDef[] = [
  {
    summary: "Taukir & Sara's Nikah",
    description:
      "Nikah ceremony after Zuhr prayer. Join us in celebrating Taukir and Sara's Nikah.",
    location: "Jumma Masjid, Junadeesa",
    startDate: "20261110",
    startTime: "133000",
    endTime: "153000",
  },
  {
    summary: "Taukir & Sara's Walima",
    description: "Walima reception. Join us in celebrating Taukir and Sara.",
    location: "Junadeesa",
    startDate: "20261111",
    startTime: "120000",
    endTime: "150000",
  },
];

export function downloadNikahCalendar() {
  const now = new Date();
  const dtstamp =
    now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = EVENTS.map(
    (e, i) => `BEGIN:VEVENT
UID:taukir-sara-nikah-${i}@invitation
DTSTAMP:${dtstamp}
DTSTART;TZID=Asia/Kolkata:${formatICSDate(e.startDate, e.startTime)}
DTEND;TZID=Asia/Kolkata:${formatICSDate(e.startDate, e.endTime)}
SUMMARY:${escapeICS(e.summary)}
DESCRIPTION:${escapeICS(e.description)}
LOCATION:${escapeICS(e.location)}
END:VEVENT`
  ).join("\r\n");

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Taukir & Sara Nikah//Invitation//EN
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Taukir-Sara-Nikah.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
