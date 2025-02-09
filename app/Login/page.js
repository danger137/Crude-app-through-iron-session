"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();

  // ✅ Login mutation with TanStack Query
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      return data;
    },
    onSuccess: (data) => {
      sessionStorage.setItem("token", data.token); // ✅ Store token securely
      toast.success("Login Successful! 🎉");
      router.push("/dashboard");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 rounded-md w-full hover:bg-blue-600 transition duration-200"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/Signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
