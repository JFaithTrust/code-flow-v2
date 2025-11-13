export { auth as proxy } from '@/auth';

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/|.*\\.(?:png|jpg|jpeg|svg|ico|webp|gif)$).*)', '/'],
};
