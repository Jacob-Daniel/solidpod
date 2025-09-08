import type { FC } from "react";
import { useState } from "react";
import { useSolidSession } from "@/lib/sessionContext";

const LoginButton: FC = () => {
  const { session } = useSolidSession();
  const [isLoggedIn, setIsLoggedIn] = useState(session.info.isLoggedIn);

  const login = async () => {
    await session.login({
      redirectUrl: "http://localhost:3019/dashboard",
      oidcIssuer: "http://localhost:3000", // can be changed to any Solid IdP
      clientName: "NKSJA App",
    });
  };

  const logout = async () => {
    await session.logout();
    setIsLoggedIn(false);
  };

  return (
    <button
      className="cursor-pointer text-base font-bold dark:text-white"
      onClick={isLoggedIn ? logout : login}
    >
      {isLoggedIn ? "Logout" : "Login"}
    </button>
  );
};

export default LoginButton;
