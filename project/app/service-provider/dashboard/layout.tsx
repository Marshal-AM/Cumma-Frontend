"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  Building2, 
  HelpCircle,
  UserCircle,
  LogOut 
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch service provider profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/service-provider/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.logoUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/service-provider/auth/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="FacilitiEase Logo"
            width={150}
            height={40}
            priority
          />
          {profileImage && (
            <Image
              src={profileImage}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)] fixed">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                MAIN
              </p>
              
              <Link href="/service-provider/dashboard" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>

              <Link href="/service-provider/bookings" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <Calendar className="mr-3 h-5 w-5" />
                Bookings
              </Link>

              <Link href="/service-provider/facilities/new" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <PlusCircle className="mr-3 h-5 w-5" />
                Add New Facilities
              </Link>

              <Link href="/service-provider/facilities" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <Building2 className="mr-3 h-5 w-5" />
                My Services & Facilities
              </Link>

              <Link href="/service-provider/support" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <HelpCircle className="mr-3 h-5 w-5" />
                Support Center
              </Link>
            </div>

            <div className="mt-8">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                MANAGE ACCOUNT
              </p>
              
              <Link href="/service-provider/profile" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <UserCircle className="mr-3 h-5 w-5" />
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 