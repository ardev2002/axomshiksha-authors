"use client";
import { use, useContext, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LogIn,
  LogOut,
  Menu,
  Settings,
  User as UserIcon,
  X,
  Home,
  Info,
  Mail,
  FileText,
  Shield,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitchButton from "./ThemeSwitchButton";
import { UserContext } from "./UserProvider";
import { signIn, signOut } from "@/utils/auth/action";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const sessionPromise = useContext(UserContext);
  const session = use(sessionPromise);
  return (
    <>
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeSwitchButton />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="p-2 hover:cursor-pointer rounded-md hover:bg-accent transition"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-80 h-full border-l border-border/50
                         bg-background/95 backdrop-blur-xl
                         text-foreground flex flex-col justify-between
                         shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] [&>button]:hidden"
          >
            {/* HEADER */}
            <div className="border-b border-border/40 bg-background/95 px-6 py-4 flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold tracking-tight">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="rounded-md"
                />
              </SheetTitle>

              <SheetClose asChild>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="rounded-md p-2 hover:cursor-pointer hover:bg-accent transition"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </SheetClose>
            </div>

            {/* MAIN NAVIGATION LINKS */}
            <div className="px-5 py-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                onClick={() => setOpen(false)}
              >
                <Home className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Home</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                onClick={() => setOpen(false)}
              >
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">About</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                onClick={() => setOpen(false)}
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Contact</span>
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                onClick={() => setOpen(false)}
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">FAQ</span>
              </Link>
              <Link
                href="/terms-conditions"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                onClick={() => setOpen(false)}
              >
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Terms & Conditions</span>
              </Link>
              <Link
                href="/privacy"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                onClick={() => setOpen(false)}
              >
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Privacy Policy</span>
              </Link>
            </div>

            {/* Spacer to push footer to bottom */}
            <div className="grow"></div>

            {/* FOOTER */}
            <div className="border-t border-border/50 bg-background/90 px-5 py-4 space-y-3">
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                    onClick={() => setOpen(false)}
                  >
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/40 transition"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </>
              )}
              <form>
                <button
                  formAction={session ? signOut : signIn}
                  type="submit"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/40 hover:cursor-pointer transition w-full"
                >
                  {session ? (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}