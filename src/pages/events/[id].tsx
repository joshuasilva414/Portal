import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import EventHeader from "@/components/events/EventHeader";
import EventDescription from "@/components/events/EventDescription";
import { prisma } from "@/server/db/client";

interface eventPageParams {
	params: { id: string };
	locales: string[];
	locale: string;
	defaultLocale: string;
}

interface eventPageServerProps {
	found: boolean;
	name: string | null;
	description: string | null;
	organization: string | null;
	location: string | null;
	headerImage: string | null;
	startDate: string | null;
	endDate: string | null;
}

const EventView: NextPage<eventPageServerProps> = (serverProps) => {
	const router = useRouter();
	const { id } = router.query;
	if (serverProps.found) {
		const callink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${serverProps.name?.replaceAll(
			" ",
			"+"
		)}&details=Join+us+for+${serverProps.name?.replaceAll(" ", "+") + "!"}&dates=${new Date(
			serverProps.startDate || ""
		)
			.toISOString()
			.replaceAll(":", "")
			.replaceAll(".", "")
			.replaceAll("-", "")}/${new Date(serverProps.endDate || "")
			.toISOString()
			.replaceAll(":", "")
			.replaceAll(".", "")
			.replaceAll("-", "")}&location=${serverProps.location?.replaceAll(" ", "+")}`;
		return (
			<>
				<Head>
					<title>{serverProps.name + " | ACM"}</title>
					<meta property="og:title" content={serverProps.name + " | ACM"} />
					<meta property="og:type" content="website" />
					<meta
						property="og:url"
						content={`https://portal.acmutsa.org/events/${typeof id === "string" ? id : "error"}`}
					/>
					<meta
						property="og:description"
						content={`Come and join ${serverProps.organization} for ${serverProps.name}!`}
					/>
					<meta
						property="og:image"
						content={
							serverProps.headerImage || "https://portal.acmutsa.org/img/default-thumbnail.png"
						}
					/>
					<meta name="theme-color" content="#179BD5" />
					<meta name="twitter:card" content="summary_large_image" />
				</Head>
				<div className="page-view bg-darken pt-[20px]">
					<EventHeader
						title={serverProps.name || ""}
						imageURL={serverProps.headerImage || ""}
						eventHost={serverProps.organization || ""}
						startDate={new Date(serverProps.startDate || "")}
						endDate={new Date(serverProps.endDate || "")}
						location={serverProps.location || ""}
					/>
					<br />
					<EventDescription
						description={serverProps.description || `Come and join us for ${serverProps.name}!`}
						calanderLink={callink}
						eventID={typeof id === "string" ? id : "error"}
					/>
				</div>
			</>
		);
	} else {
		return <p>Not found</p>;
	}
};

export async function getStaticProps(urlParams: eventPageParams) {
	const params = urlParams.params;
	const revalTime = 2;

	const event = await prisma.event.findUnique({
		where: {
			pageID: params.id.toLowerCase(),
		},
	});

	if (event == null) {
		return {
			props: {
				found: false,
			},
			revalidate: revalTime,
		};
	}

	return {
		props: {
			found: true,
			name: event.name,
			description: event.description,
			organization: event.organization,
			headerImage: event.headerImage,
			location: event.location,
			startDate: event.eventStart.toString(),
			endDate: event.eventEnd.toString(),
		},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: revalTime, // In seconds
	};
}

export async function getStaticPaths() {
	// const res = await fetch('https://.../posts')
	// const posts = await res.json()

	// Get the paths we want to pre-render based on posts
	// const paths = posts.map((post) => ({
	//   params: { id: post.id },
	// }))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths: [], fallback: "blocking" };
}

export default EventView;
