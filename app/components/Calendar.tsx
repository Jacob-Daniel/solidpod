"use client";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/lib/types";

interface ICalendar {
	start: string;
	allDay: boolean;
	// end: any;
	// title: string;
	// url: string;
}

type EventMap = Record<number, string>;

export default function Calendar({ events }: { events: Event[] }) {
	const router = useRouter();
	const calendarRef = useRef(null);
	let calendarEvents: ICalendar[] = [];
	events &&
		events instanceof Array &&
		events.map((row, i: number) => {
			const startDate = new Date(row.start_date); // This will be a Date object
			const sdTimestamp = startDate.getTime();
			calendarEvents[i] = {
				start: new Date(sdTimestamp)
					.toLocaleString("sv-SE", {
						timeZone: "Europe/London",
					})
					.substring(0, 10),
				allDay: true,
			};
		});

	const [isLoading, setIsLoading] = useState(true);

	const handleLoading = (isLoading: boolean) => {
		setIsLoading(isLoading);
	};
	const reset = () => {
		router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/events`);
	};
	return (
		<div id="calendar" className={`col-span-12 sticky top-[20px]`}>
			{isLoading && (
				<div className="text-center h-[400px] w-full bg-gray-100 p-5">
					Loading calendar...
				</div>
			)}
			<FullCalendar
				plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
				initialView={"dayGridMonth"}
				loading={handleLoading}
				ref={calendarRef}
				timeZone={"Europe/London"}
				allDaySlot={false}
				firstDay={1}
				height={"auto"}
				selectable={true}
				displayEventTime={false}
				headerToolbar={{
					end: "prev, next",
					center: "",
					start: "title",
				}}
				events={calendarEvents}
				dateClick={(info) => {
					const eventDates = calendarEvents.map((event) => event.start);
					if (eventDates.includes(info.dateStr)) {
						console.log(info.dateStr, "dataClick");
						router.push(
							`${process.env.NEXT_PUBLIC_BASE_URL}/events/?date=${info.dateStr}#events-list`,
						);
					}
				}}
				dayCellClassNames={(dayCell) => {
					const eventDates = calendarEvents.map((event) =>
						event.start.substring(0, 10),
					);
					const dateStr = dayCell.date.toISOString().split("T")[0];
					if (eventDates.includes(dateStr)) {
						return "event-day";
					}
					return "";
				}}
			/>
			{!isLoading && (
				<button
					className="border border-gray-300 px-1 cursor-pointer w-full mt-2"
					onClick={() => reset()}
				>
					Reset
				</button>
			)}
		</div>
	);
}
