"use client";
import { useSolidSession } from "@/lib/sessionContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { session, logout } = useSolidSession();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xl md:text-base cursor-pointer font-bold text-primary border border-border rounded px-2"
    >
      Logout
    </button>
  );
}
