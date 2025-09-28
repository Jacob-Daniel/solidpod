"use client";
import type { FC } from "react";
import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";

const LoginButton: FC = () => {
  const { session } = useSolidSession();
  const [isLoggedIn, setIsLoggedIn] = useState(session.info.isLoggedIn);

  const login = async () => {
    await session.login({
      redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL,
      oidcIssuer: process.env.NEXT_PUBLIC_CSS_URL,
      clientName: "NKSJA App",
    });
  };

  const logout = async () => {
    await session.logout();
    setIsLoggedIn(false);
  };

  return (
    <button
      className="py-2 px-2 md:py-1 text-white text-lg md:text-base cursor-pointer text-base font-bold rounded text-primary bg-background-solidpod"
      onClick={isLoggedIn ? logout : login}
    >
      {isLoggedIn ? "Logout" : "Login / Create Account"}
    </button>
  );
};

export default LoginButton;
