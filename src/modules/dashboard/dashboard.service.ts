import { membersRepository } from '../members/members.repository';
import { paymentsRepository } from '../payments/payments.repository';

const getToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const dashboardService = {
  async getDashboard(gymId: string) {
    const today = getToday();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [totalMembers, activeMembers, expiredMembers, expiringSoon, monthlyRevenue, recentPayments] = await Promise.all([
      membersRepository.countByGym(gymId),
      membersRepository.countActive(gymId, today),
      membersRepository.countExpired(gymId, today),
      membersRepository.findExpiring(gymId, today, sevenDaysLater),
      paymentsRepository.getMonthlyRevenue(gymId),
      paymentsRepository.getRecent(gymId, 5),
    ]);

    return {
      totalMembers,
      activeMembers,
      expiredMembers,
      expiringSoon,
      monthlyRevenue,
      recentPayments,
    };
  },
};
