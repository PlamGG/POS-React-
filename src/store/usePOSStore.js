import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePOSStore = create(
  persist(
    (set) => ({
      dailyOrderCount: 0,
      dailyCashBalance: 0,
      lastUpdatedDate: new Date().toDateString(),
      
      // Initialize or reset daily stats if a new day starts
      checkAndResetDailyStats: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastUpdatedDate !== today) {
          return {
            dailyOrderCount: 0,
            lastUpdatedDate: today
            // Note: Cash balance typically carries over or is manually reset at end of day,
            // so we don't automatically reset it to 0.
          };
        }
        return {}; // No change
      }),

      incrementOrderCount: () => set((state) => {
        const today = new Date().toDateString();
        return {
          dailyOrderCount: state.lastUpdatedDate === today ? state.dailyOrderCount + 1 : 1,
          lastUpdatedDate: today
        };
      }),

      updateCashBalance: (amount) => set((state) => ({
        dailyCashBalance: state.dailyCashBalance + amount
      })),
      
      setCashBalance: (amount) => set({ dailyCashBalance: amount })
    }),
    {
      name: 'pos-daily-stats',
    }
  )
);
