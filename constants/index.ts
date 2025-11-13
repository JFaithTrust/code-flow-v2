export const themes = [
  { value: 'light', label: 'Light', icon: '/icons/sun.svg' },
  { value: 'dark', label: 'Dark', icon: '/icons/moon.svg' },
  { value: 'system', label: 'System', icon: '/icons/computer.svg' },
];

export const sidebarLinks = [
  {
    imgUrl: '/icons/home.svg',
    label: 'Home',
    route: '/',
  },
  {
    imgUrl: '/icons/users.svg',
    label: 'Community',
    route: '/community',
  },
  {
    imgUrl: '/icons/star.svg',
    label: 'Collections',
    route: '/collection',
  },
  {
    imgUrl: '/icons/suitcase.svg',
    label: 'Jobs',
    route: '/jobs',
  },
  {
    imgUrl: '/icons/tag.svg',
    label: 'Tags',
    route: '/tags',
  },
  {
    imgUrl: '/icons/user.svg',
    label: 'Profile',
    route: '/profile',
  },
  {
    imgUrl: '/icons/question.svg',
    label: 'Ask a Question',
    route: '/ask-question',
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
