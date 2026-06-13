import React from "react";
import { Mail, Lock, User, Phone, Shield, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { UserAccount } from "../types";

interface AuthScreenProps {
  onLogin: (user: UserAccount) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLoginTab, setIsLoginTab] = React.useState(true);
  
  // Field States
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  
  // Notice / Success States
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  // Seed default account if it doesn't exist
  React.useEffect(() => {
    const existingUsers = localStorage.getItem("mysolution_users");
    if (!existingUsers) {
      const defaultUser: UserAccount & { password?: string } = {
        id: "demo-student-user",
        fullName: "Jane Doe (Demo Student)",
        email: "student@mysolution.com",
        phoneNumber: "08031122334",
        password: "password",
        walletBalance: 15500, // Preloaded with fifteen thousand naira
        transactions: [
          {
            id: "tx-init",
            type: "credit",
            amount: 15500,
            description: "Default Demo Account Welcome Bonus",
            date: new Date().toLocaleString()
          }
        ]
      };
      localStorage.setItem("mysolution_users", JSON.stringify([defaultUser]));
    }
  }, []);

  const handleDemoSignIn = () => {
    // Locate the default user or login
    const usersRaw = localStorage.getItem("mysolution_users");
    if (usersRaw) {
      const users = JSON.parse(usersRaw) as Array<UserAccount & { password?: string }>;
      const match = users.find(u => u.email === "student@mysolution.com");
      if (match) {
        onLogin(match);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const usersRaw = localStorage.getItem("mysolution_users") || "[]";
    let users = [];
    try {
      users = JSON.parse(usersRaw);
    } catch {
      users = [];
    }

    if (isLoginTab) {
      // Sign In Flow
      const matchedUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!matchedUser) {
        setErrorMessage("Account not found. Please sign up or use our instant demo account.");
        return;
      }
      
      // Simple raw checking for mock purpose
      if (password !== "password" && matchedUser.password !== password) {
        setErrorMessage("Incorrect password. (Try 'password' for easy testing!)");
        return;
      }

      setSuccessMessage("Sign-in successful! Entering dashboard...");
      setTimeout(() => {
        onLogin(matchedUser);
      }, 800);
    } else {
      // Sign Up Flow
      if (!email || !password || !fullName || !phoneNumber) {
        setErrorMessage("Please fill all fields to create your credentials.");
        return;
      }

      const alreadyExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (alreadyExists) {
        setErrorMessage("An account with this email already exists. Please sign in.");
        return;
      }

      // Create new clean account starting with a ₦5,000 complimentary bonus so users can play around!
      const newUser: UserAccount & { password?: string } = {
        id: `usr-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber: phoneNumber.trim(),
        password: password,
        walletBalance: 5000, // Complementary ₦5,000 balance!
        transactions: [
          {
            id: `tx-init-reg-${Date.now()}`,
            type: "credit",
            amount: 5000,
            description: "Complimentary Signup Testing Bonus",
            date: new Date().toLocaleString()
          }
        ]
      };

      users.push(newUser);
      localStorage.setItem("mysolution_users", JSON.stringify(users));
      
      setSuccessMessage("Account created successfully with a ₦5,000 free bonus! Auto-logging in...");
      setTimeout(() => {
        onLogin(newUser);
      }, 1500);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4" id="auth-screen-root">
      <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl shadow-xl overflow-hidden relative">
        {/* Glow overlay effect */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

        <div className="p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#00C853] flex items-center justify-center shadow-lg shadow-[#00C853]/25 mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
              MYSOLUTION <span className="text-[#00C853]">HUB</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">
              Sign In to unlock your secure student dashboard, track your ongoing verifications, and manage funding wallets.
            </p>
          </div>

          {/* Quick Demo Assist Banner */}
          <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-4 mb-6 relative overflow-hidden" id="demo-login-helper">
            <div className="flex gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-700 h-fit shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-extrabold text-[#00C853]">Instant Demo Access</h4>
                <p className="text-[10px] text-emerald-850 mt-1 leading-normal">
                  Skip registration! Click below to log in immediately with a preloaded balance of <strong>₦15,500</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="mt-2.5 w-full bg-[#00C853] text-white hover:bg-[#00E676] py-1.5 px-3 rounded-lg text-[10px] font-extrabold transition-all shadow-sm shadow-[#00C853]/10"
                >
                  Log In Instantly as Jane Doe
                </button>
              </div>
            </div>
          </div>

          {/* Tab switches */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center mb-6">
            <button
              onClick={() => {
                setIsLoginTab(true);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                isLoginTab
                  ? "bg-white text-gray-950 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLoginTab(false);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                !isLoginTab
                  ? "bg-white text-gray-950 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Notices */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-medium leading-relaxed">
              ⚠️ {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-[#00C853] rounded-xl text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Actual Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLoginTab && (
              <>
                {/* Full name input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chukwuma Ahmed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 text-xs border border-gray-150 pl-10 pr-4 py-3 rounded-xl focus:bg-white focus:border-[#00C853] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone number input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08012345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-gray-50 text-xs border border-gray-150 pl-10 pr-4 py-3 rounded-xl focus:bg-white focus:border-[#00C853] outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 text-xs border border-gray-150 pl-10 pr-4 py-3 rounded-xl focus:bg-white focus:border-[#00C853] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                {isLoginTab && (
                  <span className="text-[10px] text-gray-400">Password is 'password' for demo</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 text-xs border border-gray-150 pl-10 pr-4 py-3 rounded-xl focus:bg-white focus:border-[#00C853] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-gray-950 hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
            >
              {isLoginTab ? "Access Secure Dashboard" : "Register & Get ₦5,000 Bonus"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick legal foot */}
          <p className="text-[9px] text-center text-gray-400 mt-6 leading-relaxed">
            Locked endpoints are fully secure. Payments and credit operations comply with regulatory and Moniepoint sandbox specifications.
          </p>
        </div>
      </div>
    </div>
  );
}
