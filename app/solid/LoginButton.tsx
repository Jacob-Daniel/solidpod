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
      className="cursor-pointer text-base font-bold dark:text-white border border-gray-300 rounded px-2"
      onClick={isLoggedIn ? logout : login}
    >
      {isLoggedIn ? "Logout" : "Login / Create Account"}
    </button>
  );
};

export default LoginButton;
