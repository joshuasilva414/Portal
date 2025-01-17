import { Checkin, prisma } from "@/server/db/client";

import { isCheckinOpen, sum } from "@/utils/helpers";
import { SimpleCheckin } from "@/components/member/StatusView";

export { isCheckinOpen };

/**
 * Determines the membership status of a member, given a list of Checkin objects.
 * @param checkins {Checkin[]} The checkins to use to determine membership.
 * @return {boolean} If true, the user is considered a member.
 */
export function getMembershipStatus(checkins: Checkin[] | SimpleCheckin[]): boolean {
	// Rudimentary logic for now.
	if (checkins.length === 0) {
		return false;
	}
	return checkins.map((checkin) => 1).reduce(sum) > 15.0;
}

/**
 * Check if a checkin exists for a given member and event.
 * @param memberId
 * @param eventId
 * @return boolean If true, the user can create a new checkin for this event. If false, a checkin
 * likely already exists.
 */
export async function getCheckin(memberId: string, eventId: string): Promise<Checkin | null> {
	return await prisma.checkin.findUnique({
		where: {
			eventID_memberID: {
				eventID: eventId,
				memberID: memberId,
			},
		},
	});
}

/**
 * Get all checkins from a specific user.
 * @param memberId
 */
export async function getMemberCheckins(memberId: string): Promise<Checkin[]> {
	return await prisma.checkin.findMany({
		where: {
			memberID: memberId,
		},
	});
}

/**
 * Get all checkins associated with a specific event.
 * @param eventId
 */
export async function getEventCheckins(eventId: string): Promise<Checkin[]> {
	return await prisma.checkin.findMany({
		where: {
			eventID: eventId,
		},
	});
}

/**
 * Create a new checkin for a given member & event.
 * @param memberId
 * @param eventId
 * @param inPerson
 */
export async function createCheckin(
	memberId: string,
	eventId: string,
	inPerson: boolean
): Promise<Checkin | null> {
	if ((await getCheckin(memberId, eventId)) == null) {
		return await prisma.checkin.create({
			data: {
				eventID: eventId,
				memberID: memberId,
				isInPerson: inPerson,
			},
		});
	}

	return null;
}

/**
 * Delete a checkin for a given member & event.
 * @param memberId
 * @param eventId
 * @throws RecordNotFound
 */
export async function deleteCheckin(memberId: string, eventId: string): Promise<Checkin> {
	return await prisma.checkin.delete({
		where: {
			eventID_memberID: {
				eventID: eventId,
				memberID: memberId,
			},
		},
	});
}
