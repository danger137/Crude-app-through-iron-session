"use client";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import TodoApp from "../todo/page";
import "./dashboard.css";

export default function Dashboard() {
  const router = useRouter();

  // ✅ Fetch user session with TanStack Query
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("/api/verify-session");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json().then((data) => data.user);
    },
    retry: false, // ❌ No retries if session check fails
  });

  // ✅ Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/logout", { method: "POST" });
      router.push("/Login");
    },
  });

  // ✅ If session check fails, logout user automatically
  if (isError) {
    logoutMutation.mutate();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
      <p className="text-gray-600 mt-2">Your email: {user.email}</p>

      <div className="mt-4">
        <TodoApp />
      </div>

      <button
        onClick={() => logoutMutation.mutate()}
        className="bg-red-500 text-white px-4 py-2 mt-4"
      >
        Logout
      </button>
    </div>
  );
}
