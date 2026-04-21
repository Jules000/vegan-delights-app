import { redirect } from 'next/navigation';

export default function AdminRootRedirect() {
  // Always redirect the bare /admin to the localized /fr/admin
  // The middleware will handle the roles/mfa check first.
  redirect('/fr/admin');
}
