import React, { FunctionComponent } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { trpc } from "@/utils/trpc";
import type { Event } from "@prisma/client";

const columnHelper = createColumnHelper<Event>();

const formatDateCell = (value: Date) => {
	const hoverText = format(value, "EEEE, LLL do, yyyy");
	const shortText = format(value, "y/MM/dd h:mm:dda");
	return (
		<span className="whitespace-nowrap" title={hoverText}>
			{shortText}
		</span>
	);
};

const columns = [
	columnHelper.accessor("name", {
		header: "Name",
		size: 200,
	}),
	columnHelper.accessor("description", {
		header: "Description",
		minSize: 200,
		maxSize: 500,
		cell: (info) => (
			<div className="text-ellipsis overflow-hidden max-h-[5rem]">{info.getValue()}</div>
		),
	}),
	columnHelper.accessor("organization", {
		header: "Org.",
		minSize: 30,
		size: 30,
	}),
	columnHelper.accessor("eventStart", {
		header: "Start",
		cell: (info) => formatDateCell(info.getValue()),
	}),
	columnHelper.accessor("eventEnd", {
		header: "End",
		cell: (info) => formatDateCell(info.getValue()),
	}),
	columnHelper.accessor("formOpen", {
		header: "Form Open",
		cell: (info) => formatDateCell(info.getValue()),
	}),
	columnHelper.accessor("formClose", {
		header: "Form Close",
		cell: (info) => formatDateCell(info.getValue()),
	}),
];

const EventView: FunctionComponent = () => {
	const events = trpc.useQuery(["events.getAll"]);

	const table = useReactTable({
		data: events.isSuccess ? events.data : [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
	});

	return (
		<div className="w-full h-full">
			<div className="p-4 bg-white rounded">
				<div className="pb-2">
					{events.isSuccess ? (
						<span className="pl-1 tracking-wide text-zinc-800 font-bold font-inter">Events</span>
					) : (
						<div className="animate-pulse p-2 h-5 bg-gray-300 rounded-full dark:bg-gray-700 w-48" />
					)}
				</div>
				<table className="text-sm">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										{...{
											key: header.id,
											colSpan: header.colSpan,
											style: {
												width: header.getSize(),
											},
										}}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
										<div
											{...{
												onMouseDown: header.getResizeHandler(),
												onTouchStart: header.getResizeHandler(),
												className: `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`,
											}}
										/>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										{...{
											key: cell.id,
											style: {
												width: cell.column.getSize(),
											},
										}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default EventView;
