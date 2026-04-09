import { NextResponse } from 'next/server';
import { verifyTransactionStatus } from '@/app/actions/payment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txRef = searchParams.get('txRef');
  const locale = searchParams.get('locale') || 'fr';

  if (!txRef) {
    return NextResponse.redirect(new URL(`/${locale}/checkout?canceled=true`, request.url));
  }

  const isSuccessful = await verifyTransactionStatus(txRef);

  if (isSuccessful) {
    return NextResponse.redirect(new URL(`/${locale}/checkout/success?txRef=${txRef}`, request.url));
  } else {
    return NextResponse.redirect(new URL(`/${locale}/checkout?canceled=true`, request.url));
  }
}
