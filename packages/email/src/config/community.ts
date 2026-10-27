import MemberInvite from "../templates/cp/community/members-invite";
import PoolSlotStatus from "../templates/cp/community/pool-slot-status";

export const communityEmailConfig = {
  MembersInvite: {
    subject: "Invitation",
    component: MemberInvite,
  },
  PoolSlotStatus: {
    subject: "Pool slot status update",
    component: PoolSlotStatus,
  },
};
