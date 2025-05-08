import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  
  const navLinks = [
    { name: "Work Showcase", path: "/" },
    { name: "Talent Profiles", path: "/talents" },
    { name: "Project Tracker", path: "/projects" },
    { name: "My Profile", path: "/profile" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 font-accent">Profile1</span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`${
                    location === link.path
                      ? "border-primary-500 text-gray-900 dark:text-white border-b-2"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 border-b-2"
                  } px-1 pt-1 text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
            <div className="ml-3 relative">
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open notifications</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="ml-3 relative">
              <div>
                <Avatar>
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80" 
                    alt="User profile picture" 
                  />
                  <AvatarFallback>JT</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                    variant="ghost"
                  >
                    <span className="sr-only">Open main menu</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="pt-10">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          location === link.path
                            ? "bg-primary-50 dark:bg-gray-700 border-primary-500 text-primary-700 dark:text-white border-l-4"
                            : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 border-l-4"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
