"use client";
import { PharmasphereLogoText } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUser } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUserState] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    setUserState(getUser());
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <PharmasphereLogoText />
          <div className="flex gap-3">
            {user ? (
              <Avatar className="cursor-pointer" onClick={() => router.push('/client/personal')}>
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <>
                <Button variant="outline" className="hover:bg-blue-50" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button className="btn-primary" onClick={() => router.push('/signup')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 