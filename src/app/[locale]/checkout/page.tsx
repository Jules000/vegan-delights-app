import { getSession } from '@/app/actions/auth';
import CheckoutClient from './CheckoutClient';
import { Suspense } from 'react';

export default async function CheckoutPage() {
  const session = await getSession();
  
  // We no longer strictly redirect if !session
  // CheckoutClient will display the cart and prompt for login if needed
  
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading checkout...</div>}>
      <CheckoutClient session={session} />
    </Suspense>
  );
}
