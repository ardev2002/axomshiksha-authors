import Image from "next/image";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";
import { LogIn, LogOut, Menu } from "lucide-react";
import { Suspense } from "react";
import ThemeSwitchButton from "./ThemeSwitchButton";
import { Session } from "@supabase/supabase-js";
import { signIn, signOut } from "@/utils/auth/action";
import { Skeleton } from "../ui/skeleton";
import { getSession } from "@/utils/helpers/getSession";

export default async function Header() {
 const sessionPromise = getSession();
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="AxomShiksha"
              width={36}
              height={36}
              className="rounded-md"
            />
          </Link>

          {/* Desktop Navigation Links - Left side with logo */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/faq"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Search and Theme Switch for desktop */}
        <div className="hidden md:flex items-center gap-2">
          <form>
            <Suspense fallback={<Skeleton className="h-4 w-4" />}>
                <AuthButton sessionPromise={sessionPromise} />
              </Suspense>
          </form>
          <ThemeSwitchButton />
        </div>

        {/* Mobile sidebar for mobile devices */}
        <Suspense fallback={<MobileSidebarSkeleton />}>
          <MobileSidebar sessionPromise={sessionPromise} />
        </Suspense>
      </div>
    </nav>
  );
}

async function AuthButton({ sessionPromise }: { sessionPromise: Promise<Session | null> }) {
   const session = await sessionPromise;
  return (
    <button
      formAction={session ? signOut : signIn}
      title={session ? "Sign out" : "Sign in"}
      type="submit"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:cursor-pointer transition"
    >
      {session ? (
        <LogOut className="h-4 w-4" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
    </button>
  )
}


function MobileSidebarSkeleton() {
  return (
    <div className="md:hidden flex items-center gap-2">
      <button
        type="button"
        disabled
        className="p-2 rounded-md hover:bg-accent transition"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
      <button
        type="button"
        disabled
        className="p-2 rounded-md hover:bg-accent transition"
        aria-label="Toggle theme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-sun"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </button>
      <button
        type="button"
        disabled
        className="p-2 rounded-md hover:bg-accent transition"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>
    </div>
  );
}