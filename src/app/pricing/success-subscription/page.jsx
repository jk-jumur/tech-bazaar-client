import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Mail, ShoppingBag, Home, Receipt } from "lucide-react";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { subscription } from "@/lib/actions/payment";



export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;
   const session = await auth.api.getSession({
            headers: await headers(),
   });



  const user = session?.user;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    customer_details: { email: customerEmail },
    amount_total,
    currency,
    line_items,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items.data.price.product", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    console.log("Current User:", user);
    const result = await subscription({ user, session_id })

    console.log(result);

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency?.toUpperCase() || "USD",
      }).format(amount / 100);
    };

    // Get order number from session ID (or generate one)
    const orderNumber = session_id.slice(-8).toUpperCase();

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-100 text-lg">
                Thank you for your purchase
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-6">
              {/* Order Confirmation */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Order Number</span>
                </div>
                <span className="font-mono font-semibold text-gray-900">
                  #{orderNumber}
                </span>
              </div>

              {/* Email Confirmation */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    A confirmation email has been sent to{" "}
                    <span className="font-semibold text-gray-900">
                      {customerEmail}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please check your spam folder if you don&apos;t see it
                    within 5 minutes
                  </p>
                </div>
              </div>

              {/* Order Summary (if line items available) */}
              {line_items?.data && line_items.data.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    {line_items.data.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {item.description ||
                              item.price?.product?.name ||
                              "Item"}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-gray-400">
                              ×{item.quantity}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.amount_total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              {amount_total && (
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                  <span className="text-base font-semibold text-gray-700">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(amount_total)}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
                <Link
                  href="/orders"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View Orders
                </Link>
              </div>

              {/* Support Message */}
              <p className="text-center text-xs text-gray-500 pt-2">
                Need help? Contact us at{" "}
                <a
                  href="mailto:orders@example.com"
                  className="text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  orders@example.com
                </a>
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">Payment confirmed</span>
            </div>
            <p className="text-xs text-gray-400">
              Secured by Stripe • Transaction ID: {session_id.slice(0, 16)}...
            </p>
          </div>
        </div>
      </div>
    );
  }
}