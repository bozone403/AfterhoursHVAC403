import { type User } from "@shared/schema";

const ADMIN_EMAILS = [
  'jordan@afterhourshvac.ca',
  'derek@afterhourshvac.ca'
];

const ADMIN_USERNAMES = [
  'JordanBoz',
  'jordan',
  'derek'
];

export function isUserAdmin(user: User): boolean {
  if (user.isAdmin) return true;
  
  const emailLower = user.email?.toLowerCase();
  if (emailLower && ADMIN_EMAILS.some(email => email.toLowerCase() === emailLower)) {
    return true;
  }
  
  const usernameLower = user.username?.toLowerCase();
  if (usernameLower && ADMIN_USERNAMES.some(username => username.toLowerCase() === usernameLower)) {
    return true;
  }
  
  return false;
}

export function checkAdminAccess(user: any): boolean {
  if (!user) return false;
  
  return isUserAdmin(user as User);
}

export { ADMIN_EMAILS, ADMIN_USERNAMES };
