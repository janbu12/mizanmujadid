/**
 * Common sorting logic for projects:
 * 1. Ongoing projects first (isOngoing: true)
 * 2. Newest end date first (endDate: -1)
 * 3. Newest start date first (startDate: -1)
 */
export const PROJECT_SORT = { 
  isOngoing: -1, 
  endDate: -1, 
  startDate: -1 
} as const;
