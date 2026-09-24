import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const { status, customer_details, amount_total, currency } = session;
  const customerEmail = customer_details?.email || 'Valued Customer';
  
  // Format amount
  const formattedAmount = amount_total ? (amount_total / 100).toFixed(2) : '0.00';

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center transform transition-all">
          
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            We truly appreciate your business and trust in us. Your subscription is now active.
          </p>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left border border-slate-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Confirmation Email:</span>
              <span className="font-medium text-slate-800 truncate max-w-[180px]">{customerEmail}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Paid:</span>
              <span className="font-semibold text-emerald-600 uppercase">{formattedAmount} {currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Session ID:</span>
              <span className="font-mono text-xs text-slate-400 truncate max-w-[150px]">{session_id}</span>
            </div>
          </div>

          {/* Support Info */}
          <p className="text-xs text-slate-500 mb-6">
            A confirmation email has been dispatched. For any inquiries, reach out to us at{' '}
            <a href="mailto:support@example.com" className="text-indigo-600 font-medium hover:underline">
              support@example.com
            </a>
          </p>

          {/* Action Button */}
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-100 transition-all duration-200 group"
          >
            Return to Dashboard
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>
      </main>
    );
  }
}