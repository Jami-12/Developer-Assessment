import { prisma } from "../../lib/prisma";

const getProfile = (userId: string) =>
  prisma.user.findFirst({
    where: { id: userId, isDeleted: false },
    include: { companyProfile: true },
  });
const updateProfile = async (
  userId: string,
  data: { companyName?: string; website?: string },
) => prisma.companyProfile.update({ where: { userId }, data });
export const UserServices = { getProfile, updateProfile };
