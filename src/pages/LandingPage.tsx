import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Users } from "lucide-react";
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
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } else {
      setMessage("Logged in successfully! Redirecting...");
      setIsSuccess(true);
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
      <p className="text-center text-gray-500">Sign in to continue to Grex.</p>
      {message && (
        <div
          className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 py-3 pl-12 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Log In
        </button>
        <p className="text-gray-600">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setView("signup"); }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
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
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { username: signupUsername } },
    });
    if (error) {
      setMessage(error.message);
      setIsSuccess(false);
    } else {
      setMessage("Account created! Please check your email to confirm.");
      setIsSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-gray-800">Create an Account</h2>
      <p className="text-center text-gray-500">Join our community!</p>
      {message && (
        <div
          className={`p-3 rounded-lg text-center font-medium transition-all duration-300 ${
            isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 py-3 pl-12 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue.500 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 py-3 pl-12 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Sign Up
        </button>
        <p className="text-gray-600">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setView("login"); }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </form>
  );
}

export default function LandingPage() {
  const [view, setView] = useState<"login" | "signup">("login");

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="md:w-1/2 lg:w-2/5 bg-blue-600 text-white p-12 flex flex-col justify-center items-center h-screen animate-slide-in-left">
        <div className="text-center">
          <Users size={64} className="mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold">GREX</h1>
          <p className="text-xl mt-4 text-blue-200">Connect, Collaborate, Create.</p>
        </div>
        <div className="mt-8 text-center text-blue-300">
            <p>Your hub for shared-interest communities.</p>
        </div>
      </div>
      <div className="md:w-1/2 lg:w-3/5 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          {view === "login" ? <LoginPage setView={setView} /> : <SignupPage setView={setView} />}
        </div>
      </div>
    </div>
  );
}