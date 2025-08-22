import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabaseClient";

type ViewSetter = { setView: (view: "login" | "signup") => void };

function LoginPage({ setView }: ViewSetter) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    // Supabase login
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } else {
      setMessage("Logged in successfully!");
      setIsSuccess(true);
      setLoginEmail("");
      setLoginPassword("");
      // Optionally, redirect or reload
      // window.location.reload();
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Log in</h2>
      <h3 className="text-lg font-light text-center text-[#34699A] mb-8">
        Welcome to your community
      </h3>
      {message && (
        <div
          className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
            isSuccess
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34699A]"
            size={20}
          />
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full bg-[#34699A] text-white py-3 pl-12 pr-4 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-shadow border border-transparent focus:border-white"
            required
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34699A]"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full bg-[#34699A] text-white py-3 pl-12 pr-12 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-shadow border border-transparent focus:border-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button
          type="submit"
          className="flex-1 bg-white text-[#113F67] font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-200 transition-colors"
        >
          Confirm
        </button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("signup");
          }}
          className="text-[#34699A] text-sm font-semibold hover:underline px-4"
        >
          Sign up
        </a>
      </div>
    </form>
  );
}

function SignupPage({ setView }: ViewSetter) {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (signupPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSuccess(false);
      return;
    }
    // Supabase signup
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { username: signupUsername },
      },
    });
    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } else {
      setMessage(
        "Account created! Please check your email to confirm."
      );
      setIsSuccess(true);
      setSignupEmail("");
      setSignupUsername("");
      setSignupPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Sign up</h2>
      <h3 className="text-lg font-light text-center text-[#34699A] mb-8">
        Create your account
      </h3>
      {message && (
        <div
          className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
            isSuccess
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34699A]"
            size={20}
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="w-full bg-[#34699A] text-white py-3 pl-12 pr-4 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-shadow border border-transparent focus:border-white"
            required
          />
        </div>
        <div className="relative">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34699A]"
            size={20}
          />
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            className="w-full bg-[#34699A] text-white py-3 pl-12 pr-4 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-shadow border border-transparent focus:border-white"
            required
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34699A]"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="w-full bg-[#34699A] text-white py-3 pl-12 pr-12 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-shadow border border-transparent focus:border-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#34699A]"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#34699A] text-white py-3 pl-12 pr-12 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34699A] transition-shadow border border-transparent focus:border-white"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <button
          type="submit"
          className="flex-1 bg-white text-[#113F67] font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-200 transition-colors"
        >
          Confirm
        </button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("login");
          }}
          className="text-[#34699A] text-sm font-semibold hover:underline px-4"
        >
          Log in
        </a>
      </div>
    </form>
  );
}

export default function LandingPage() {
  const [view, setView] = useState<"login" | "signup">("login");
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4 font-sans">
      <div className="bg-[#113F67] text-white p-10 rounded-3xl shadow-2xl w-full max-w-sm border-t-4 border-[#34699A]">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white">GREX</h1>
        </div>
        {view === "login" ? (
          <LoginPage setView={setView} />
        ) : (
          <SignupPage setView={setView} />
        )}
      </div>
    </div>
  );
}
