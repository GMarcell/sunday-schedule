"use client";
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <button
      className="m-4 rounded-md border border-white/15 px-3 py-2 text-sm text-white/70 hover:text-white"
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
    >
      Sign out
    </button>
  );
}
