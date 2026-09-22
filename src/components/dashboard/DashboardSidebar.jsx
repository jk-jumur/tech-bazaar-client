
"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const DashboardSidebar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const role = user?.role || "seller";
  console.log(role);



  const navMenu = {
     seller: [{
           title: "Overview",
           href: "/dashboard/overview"
     },
     {
         title: "Products",
         href: "/dashboard/seller/products"
     },
     {
         title: "Orders",
         href: "/dashboard/seller/orders",
     },
     {
        title: "Analytics",
        href: "/dashboard/seller/analytics",
     }
          
     ],

     buyer: [
         {
            title:"Overview",
            href: "/dashboard/buyer/overview",
         },
         {
             title:"Orders",
             href: "/dashboard/buyer/orders",
         },
         {
            title:"Wishlist",
            href: "/dashboard/buyer/wishlist",
         },
         {
             title: "Reviews",
             href: "/dashboard/buyer/reviews",
         }
     ],

     admin: [
         {
            title:"Overview",
            href: "/dashboard/admin/overview",
         },
         {
            title:"Users",
            href: "/dashboard/admin/users",
         },
         {
            title:"Products",
            href: "/dashboard/admin/products",
         }
     ]
  };

  const menu = navMenu[role]

  return (
    <div>
      <nav className="p-4 space-y-2">
      {
         menu.map((item) => (
            <Link key={item.title}
            href={item.href}
            className= "block px-4 py-2 rounded hover:bg-gray-100"
              >
                 {item.title}
            </Link>
         ))
      }
      </nav>
    </div>
  );
};

export default DashboardSidebar;