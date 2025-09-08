"use client";
import { useSolidSession } from "@/lib/sessionContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { session, logout } = useSolidSession();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      console.log(session.info.isLoggedIn, "isLoggedIn");
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer text-base font-bold dark:text-white"
    >
      Logout
    </button>
  );
}
