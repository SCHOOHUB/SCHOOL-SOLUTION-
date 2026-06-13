import React from "react";
import { 
  FileText, ArrowLeft, Upload, FileCheck, CheckCircle2, ShieldCheck, 
  Trash2, MessageSquare, Plus, Clock, Landmark, AlertTriangle, 
  Sparkles, Layers, ListFilter, PlayCircle, ClipboardCheck,
  Wallet, LogOut, ArrowDownLeft, ArrowUpRight, CreditCard, User, Info, DollarSign, History
} from "lucide-react";
import { CATEGORIES, SERVICES } from "../data";
import { Service, VerificationOrder, FormField, UserAccount, WalletTransaction } from "../types";
import IconMapper from "./IconMapper";
import AuthScreen from "./AuthScreen";

interface DashboardProps {
  initialServiceId: string | null;
  onClose: () => void;
}

export default function Dashboard({ initialServiceId, onClose }: DashboardProps) {
  // Navigation & Category states
  const [selectedCatId, setSelectedCatId] = React.useState<string>("educational_services");
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  
  // Form submission state
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = React.useState<{ name: string; size: string; type: string; dataUrl?: string }[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  
  // OCR Scan simulator state
  const [scanning, setScanning] = React.useState(false);
  const [scanTarget, setScanTarget] = React.useState<"none" | "nin" | "waec">("none");
  const [scanMessage, setScanMessage] = React.useState("");

  // Orders stored locally
  const [orders, setOrders] = React.useState<VerificationOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<VerificationOrder | null>(null);
  
  // Active UI Tabs inside dashboard: "apply", "track" or "wallet"
  const [dashboardTab, setDashboardTab] = React.useState<"apply" | "track" | "wallet">("apply");

  // User auth & Wallet states
  const [currentUser, setCurrentUser] = React.useState<UserAccount | null>(null);
  const [fundingModalOpen, setFundingModalOpen] = React.useState(false);
  const [fundAmount, setFundAmount] = React.useState<string>("10000");
  const [customFundAmount, setCustomFundAmount] = React.useState<string>("");
  const [fundingType, setFundingType] = React.useState<"transfer" | "card">("transfer");
  const [isFundingProcessing, setIsFundingProcessing] = React.useState(false);
  const [fundingMessage, setFundingMessage] = React.useState("");

  // Card input states
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  // Keep user profile matching/reactiveness
  React.useEffect(() => {
    const savedUser = localStorage.getItem("mysolution_current_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed loading saved user session", e);
      }
    }
  }, []);

  const updateUserProfileState = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("mysolution_current_user", JSON.stringify(updatedUser));

    // Also update in registered list so that users can log in again with new balance
    const allUsersRaw = localStorage.getItem("mysolution_users");
    if (allUsersRaw) {
      try {
        const users = JSON.parse(allUsersRaw) as UserAccount[];
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        localStorage.setItem("mysolution_users", JSON.stringify(updatedUsers));
      } catch (e) {
        console.error("Failed syncing users list", e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mysolution_current_user");
    setCurrentUser(null);
    setDashboardTab("apply");
  };

  const getNumericCost = (estimate: string): number => {
    // Extract base price digit
    const cleaned = estimate.replace(/₦/g, "").replace(/,/g, "");
    const match = cleaned.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    return 1000;
  };

  // Load orders on load
  React.useEffect(() => {
    const savedOrders = localStorage.getItem("mysolution_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          if (parsed.length > 0) {
            setSelectedOrder(parsed[0]);
          }
        }
      } catch (e) {
        console.error("Failed loading saved orders", e);
      }
    } else {
      // Seed an initial demo order so they have something to track right away!
      const demoOrder: VerificationOrder = {
        id: "MSH-DE-9283",
        serviceId: "cac-business",
        serviceName: "CAC Business Name Registration",
        category: "business",
        submittedAt: new Date(Date.now() - 3600000 * 4).toLocaleString(),
        formData: {
          ownerName: "Alhaji Chinedu Benson",
          proposedName1: "AFROLEGACY VENTURES",
          proposedName2: "AFROLEGACY HOLDINGS LTD",
          businessNature: "Wholesale imports and logistical distribution across southwest Nigeria."
        },
        files: [{ name: "nin_card_front.png", size: "342 KB", type: "image/png" }],
        status: "Pending Verification",
        trackingId: "MSH-2026-X83A"
      };
      setOrders([demoOrder]);
      setSelectedOrder(demoOrder);
      localStorage.setItem("mysolution_orders", JSON.stringify([demoOrder]));
    }
  }, []);

  // Update categories if initialServiceId is passed
  React.useEffect(() => {
    if (initialServiceId) {
      const match = SERVICES.find((s) => s.id === initialServiceId);
      if (match) {
        setSelectedService(match);
        setSelectedCatId(match.category);
        setDashboardTab("apply");
        // reset form fields
        setFormData({});
        setUploadedFiles([]);
      }
    } else {
      // Dynamic default
      const list = SERVICES.filter((s) => s.category === selectedCatId);
      if (list.length > 0 && !selectedService) {
        setSelectedService(list[0]);
      }
    }
  }, [initialServiceId, selectedCatId]);

  // Handle drag and drop files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const addFiles = (filesList: FileList) => {
    const newFiles: { name: string; size: string; type: string; dataUrl?: string }[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const f = filesList[i];
      const kbSize = `${Math.round(f.size / 1024)} KB`;
      
      // Let's create dummy preview
      let dataUrl: string | undefined = undefined;
      if (f.type.startsWith("image/")) {
        dataUrl = URL.createObjectURL(f);
      }
      newFiles.push({
        name: f.name,
        size: kbSize,
        type: f.type,
        dataUrl
      });
    }
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // OCR Simulator
  const handleTriggerOcr = (type: "nin" | "waec") => {
    setScanning(true);
    setScanTarget(type);
    setScanMessage("Uploading document template to scan engine...");

    setTimeout(() => {
      setScanMessage("Running custom optical filters and edge matching...");
    }, 850);

    setTimeout(() => {
      setScanMessage("Parsing metadata variables & validating signatures...");
    }, 1650);

    setTimeout(() => {
      setScanning(false);
      setScanTarget("none");

      if (type === "nin") {
        const dummyNin = {
          fullName: "Damilola Beatrice Okafor",
          associatedNin: "38194820938",
          originalDob: "1997-11-23",
          fathersName: "Raymond Okafor",
          jambRegNo: "202638491823BN"
        };
        setFormData((prev) => ({ ...prev, ...dummyNin }));
        // Mock files
        setUploadedFiles([
          { name: "fgn_national_id_card.jpg", size: "185 KB", type: "image/jpeg" }
        ]);
      } else {
        const dummyWaec = {
          fullName: "Damilola Beatrice Okafor",
          examType: "WAEC External (GCE)",
          subjects: "1. English Language (A1)\n2. Mathematics (B2)\n3. Physics (B3)\n4. Chemistry (C4)\n5. Biology (B2)\n6. Civic Education (A1)\n7. Economics (B3)\n8. Geography (C5)",
        };
        setFormData((prev) => ({ ...prev, ...dummyWaec }));
        setUploadedFiles([
          { name: "waec_original_statement.pdf", size: "450 KB", type: "application/pdf" }
        ]);
      }
    }, 2800);
  };

  // Handle Form Submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    // Validate
    const missingFields = selectedService.formFields.filter(f => f.required && !formData[f.name]);
    if (missingFields.length > 0 && uploadedFiles.length === 0) {
      alert(`Please fill in required fields, including: ${missingFields[0].label}`);
      return;
    }

    // Cost Deduction via Wallet System
    const serviceCost = getNumericCost(selectedService.priceEstimate);

    if (!currentUser) {
      alert("Authentication required. Please sign in to your student/customer account first.");
      setDashboardTab("apply");
      return;
    }

    if (currentUser.walletBalance < serviceCost) {
      alert(`Insufficient funds in your wallet! \n\nService cost: ₦${serviceCost.toLocaleString()}\nYour Wallet Balance: ₦${currentUser.walletBalance.toLocaleString()}\n\nPlease fund your wallet with at least ₦${(serviceCost - currentUser.walletBalance).toLocaleString()} to continue.`);
      setDashboardTab("wallet");
      return;
    }

    // Secure debit
    const newBalance = currentUser.walletBalance - serviceCost;
    const debitTx: WalletTransaction = {
      id: `tx-debit-${Date.now()}`,
      type: "debit",
      amount: serviceCost,
      description: `Payment for ${selectedService.name} (${selectedService.priceEstimate})`,
      date: new Date().toLocaleString()
    };

    const updatedUser: UserAccount = {
      ...currentUser,
      walletBalance: newBalance,
      transactions: [debitTx, ...currentUser.transactions]
    };

    updateUserProfileState(updatedUser);

    const tId = `MSH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: VerificationOrder = {
      id: `ord-${Date.now()}`,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      submittedAt: new Date().toLocaleString(),
      formData: { ...formData },
      files: [...uploadedFiles],
      status: "Received",
      trackingId: tId
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    setSelectedOrder(newOrder);
    localStorage.setItem("mysolution_orders", JSON.stringify(updated));

    // Reset Form & Redirect with helpful alert
    alert(`🎉 Order Created Successfully!\n\n₦${serviceCost.toLocaleString()} was securely paid from your wallet.\nNew balance is: ₦${newBalance.toLocaleString()}`);
    setFormData({});
    setUploadedFiles([]);
    setDashboardTab("track");
  };

  // Status simulation: Increasable for developers/clients to see progress flow
  const advanceMockStatus = (targetOrd: VerificationOrder) => {
    const states: ("Received" | "Pending Verification" | "Processing" | "Completed")[] = [
      "Received",
      "Pending Verification",
      "Processing",
      "Completed"
    ];
    const currIdx = states.indexOf(targetOrd.status);
    const nextIdx = (currIdx + 1) % states.length;
    const nextStatus = states[nextIdx];

    const updated = orders.map((o) => {
      if (o.id === targetOrd.id) {
        return { ...o, status: nextStatus };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem("mysolution_orders", JSON.stringify(updated));
    setSelectedOrder({ ...targetOrd, status: nextStatus });
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-blue-50 text-blue-700 border-blue-200 border";
      case "Pending Verification":
        return "bg-amber-50 text-amber-800 border-amber-200 border";
      case "Processing":
        return "bg-indigo-50 text-indigo-800 border-indigo-200 border";
      case "Completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 border";
      default:
        return "bg-gray-150 text-gray-800";
    }
  };

  // Compile Copyable Form Receipt
  const generateWhatsAppMessage = (o: VerificationOrder) => {
    let text = `*MYSOLUTION HUB - VERIFICATION INVOICE*\n`;
    text += `*Tracking Code:* ${o.trackingId}\n`;
    text += `*Service:* ${o.serviceName}\n`;
    text += `*Submitted At:* ${o.submittedAt}\n`;
    text += `------------------------------------\n`;
    text += `*SUBMITTED CREDENTIAL DETAILS:*\n`;
    
    Object.entries(o.formData).forEach(([k, val]) => {
      // Label lookup
      const serviceObj = SERVICES.find(s => s.id === o.serviceId);
      const fieldObj = serviceObj?.formFields.find(f => f.name === k);
      const label = fieldObj?.label || k;
      text += `• *${label}:* ${val}\n`;
    });

    if (o.files.length > 0) {
      text += `\n*ATTACHED SYSTEM FILES (${o.files.length}):*\n`;
      o.files.forEach(f => {
        text += `- _${f.name}_ (${f.size})\n`;
      });
    }

    text += `------------------------------------\n`;
    text += `_Please review the files and begin processing. Thank you!_`;
    
    return "https://wa.me/2349041818917?text=" + encodeURIComponent(text);
  };

  if (!currentUser) {
    return (
      <div className="bg-gray-50/50 min-h-screen py-6 px-4 md:px-8 border-t border-gray-100" id="dashboard-root">
        <div className="max-w-7xl mx-auto">
          {/* Header block with back button so users can return home */}
          <div className="pb-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors cursor-pointer bg-white border border-gray-150 px-3 py-1.5 rounded-lg"
              id="dash-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </button>
          </div>
          <AuthScreen onLogin={updateUserProfileState} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 px-4 md:px-8 border-t border-gray-100" id="dashboard-root">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold transition-colors cursor-pointer bg-white border border-gray-150 px-3 py-1.5 rounded-lg"
                id="dash-back-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Homepage
              </button>
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold uppercase">
                Active Secure Workspace
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2">
              <Layers className="w-7 h-7 text-[#00C853]" />
              Digital Verification Center
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select standard Nigerian civil registers, JAMB codes, and print-out requests. Formats fully aligned with Moniepoint's conversion systems.
            </p>
          </div>

          {/* User Account & Balance Card RHS */}
          <div className="flex items-center gap-4 bg-white border border-gray-150 p-4 rounded-2xl w-full lg:w-auto shadow-sm" id="user-header-card">
            {/* Round Avatar badge */}
            <div className="w-10 h-10 rounded-xl bg-gray-950 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 lg:flex-none">
              <div className="text-[9px] font-bold text-gray-400 font-mono tracking-wider uppercase leading-none">
                Verified Client
              </div>
              <div className="text-xs font-extrabold text-gray-900 mt-1 leading-none truncate max-w-[150px]">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-gray-500 tracking-tight mt-1 line-clamp-1 max-w-[150px]">
                {currentUser.email}
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-150 shrink-0"></div>

            {/* Wallet Quick indicators */}
            <div className="text-right">
              <div className="text-[9px] uppercase font-mono tracking-widest text-[#00C853] font-bold leading-none">
                Wallet Cash
              </div>
              <div className="text-sm font-extrabold text-gray-900 mt-1 leading-none">
                ₦{currentUser.walletBalance.toLocaleString()}
              </div>
              <button
                onClick={() => setDashboardTab("wallet")}
                className="text-[9px] text-emerald-700 font-extrabold hover:underline hover:text-emerald-550 transition-colors block mt-1 leading-none cursor-pointer"
              >
                + Fund Wallet
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-150 shrink-0"></div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              title="Sign Out"
              id="user-logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-white border border-gray-150 p-1.5 rounded-2xl flex flex-col md:flex-row gap-2 items-center shadow-sm w-full mt-6" id="dash-tabs-switch">
          <div className="flex items-center gap-1.5 w-full md:w-auto flex-1 md:flex-none">
            <button
              onClick={() => setDashboardTab("apply")}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                dashboardTab === "apply"
                  ? "bg-[#00C853] text-white shadow-sm"
                  : "bg-transparent text-gray-650 hover:bg-gray-50"
              }`}
              id="dash-tab-apply"
            >
              <Plus className="w-4 h-4" />
              Submit Documents
            </button>
            <button
              onClick={() => setDashboardTab("track")}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                dashboardTab === "track"
                  ? "bg-[#00C853] text-white shadow-sm"
                  : "bg-transparent text-gray-650 hover:bg-gray-50"
              }`}
              id="dash-tab-track"
            >
              <Clock className="w-4 h-4" />
              My Processing Tasks
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Third active Tab: Wallet System */}
          <button
            onClick={() => setDashboardTab("wallet")}
            className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              dashboardTab === "wallet"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-emerald-50/60 text-[#00C853] hover:bg-emerald-50 border border-emerald-100"
            }`}
            id="dash-tab-wallet"
          >
            <Wallet className="w-4 h-4 text-emerald-500" />
            Naira Wallet System
            <span className="bg-emerald-500 text-white font-extrabold font-mono text-[9.5px] px-2 py-0.5 rounded-full ml-1">
              ₦{currentUser.walletBalance.toLocaleString()}
            </span>
          </button>
        </div>

        {/* OCR Scanning Screen overlay if running */}
        {scanning && (
          <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-150 shadow-2xl relative overflow-hidden text-center">
              {/* Scan Bar Visual */}
              <div className="mx-auto w-48 h-32 border-2 border-[#00C853] border-dashed rounded-xl relative overflow-hidden bg-gray-50 mb-6 flex items-center justify-center">
                <FileText className="w-12 h-12 text-[#00C853]/40" />
                <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 animate-scan"></div>
                <div className="absolute inset-0 bg-emerald-500/5"></div>
              </div>

              <h4 className="text-lg font-extrabold text-gray-900 tracking-tight">Interactive Scanner Active</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{scanMessage}</p>

              {/* Loader */}
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#00C853] animate-pulse w-4/5 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content split depending on Active Tab */}
        {dashboardTab === "apply" && (
          <div className="mb-8 mt-6 animate-fadeIn">
            {/* Visual Welcome Banner */}
            <div className="bg-gradient-to-r from-gray-905 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
              {/* Background ambient pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00C853]/15 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00C853]/20 text-[#00C853] rounded-full text-xs font-bold border border-[#00C853]/25 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse"></span>
                    Student & Customer Hub Active
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Welcome Back, Student / Client! 👋
                  </h3>
                  <p className="text-xs text-gray-350 mt-1.5 max-w-xl leading-relaxed">
                    Access automated portals for school applications, O'Level result uploads on CAPS, transcripts, civil registers, government forms, business CAC, and instant checker PINs.
                  </p>
                </div>
                
                {/* Stats board */}
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[130px]">
                    <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400">Total Orders</div>
                    <div className="text-2xl font-extrabold text-white mt-1">{orders.length}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">⏱ Real-time tracking</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[130px]">
                    <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-gray-400">Completed Tasks</div>
                    <div className="text-2xl font-extrabold text-[#00C853] mt-1">
                      {orders.filter(o => o.status === "Completed").length}
                    </div>
                    <div className="text-[10px] text-gray-300 mt-0.5">Secure Processing</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK SECTIONS (Requested Category Dashboard Buttons) */}
            <div className="mt-8">
              <h4 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C853]"></span>
                Services Quick Purchase Sections
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="quick-sections-widget">
                {CATEGORIES.map((cat) => {
                  const count = SERVICES.filter(s => s.category === cat.id).length;
                  const isActive = selectedCatId === cat.id;
                  
                  // Map specific background glow or icon highlights
                  let iconBg = "bg-emerald-500/10 text-[#00C853]";
                  if (cat.id === "educational_services") iconBg = "bg-blue-500/10 text-blue-500";
                  if (cat.id === "verification_service") iconBg = "bg-purple-500/10 text-purple-600";
                  if (cat.id === "documentation_service") iconBg = "bg-amber-500/10 text-amber-600";
                  if (cat.id === "registration_services") iconBg = "bg-teal-500/10 text-teal-600";
                  if (cat.id === "modification_services") iconBg = "bg-pink-500/10 text-pink-600";
                  if (cat.id === "exam_pin_services") iconBg = "bg-indigo-500/10 text-indigo-600";

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        // Auto-select the first service in the selected category
                        const matching = SERVICES.filter(s => s.category === cat.id);
                        if (matching.length > 0) {
                          setSelectedService(matching[0]);
                          setFormData({});
                          setUploadedFiles([]);
                        }
                        // Smooth scroll to selection zone
                        const formSection = document.getElementById("selection-form-split-view");
                        if (formSection) {
                          formSection.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[160px] ${
                        isActive
                          ? "bg-white border-[#00C853] shadow-md ring-2 ring-[#00C853]/15"
                          : "bg-white border-gray-150 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      id={`quick-sec-${cat.id}`}
                    >
                      {/* Highlight border on active */}
                      {isActive && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#00C853]"></div>
                      )}
                      
                      <div className="flex justify-between items-start w-full">
                        <div className={`p-2.5 rounded-xl ${iconBg} group-hover:scale-110 transition-transform`}>
                          <IconMapper name={cat.iconName} className="w-5 h-5 animate-pulse" />
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded leading-none">
                          {count} services
                        </span>
                      </div>

                      <div className="mt-4">
                        <h5 className="text-xs font-extrabold text-gray-950 tracking-tight group-hover:text-[#00C853] transition-colors leading-tight">
                          {cat.name}
                        </h5>
                        <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-normal font-medium">
                          {cat.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content split depending on Active Tab */}
        {dashboardTab === "apply" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6" id="selection-form-split-view">
            
            {/* Sidebar Column: Services Category & Options LIST (Cols 4) */}
            <div className="lg:col-span-4 flex flex-col gap-6" id="dashboard-sidebar-panels">
              {/* Categories Navigation */}
              <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5" />
                  Service Segments
                </h3>
                <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`w-full py-3 px-3.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedCatId === cat.id
                          ? "bg-emerald-50 text-emerald-800 border-l-4 border-[#00C853]"
                          : "bg-transparent text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                      id={`sidebar-cat-${cat.id}`}
                    >
                      <span className="flex items-center gap-2">
                        <IconMapper name={cat.iconName} className="w-4 h-4 text-emerald-600" />
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {SERVICES.filter((s) => s.category === cat.id).length} items
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Services checklist in chosen Category */}
              <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-3">
                  Select Specific Service
                </h3>
                <div className="space-y-1.5">
                  {SERVICES.filter((s) => s.category === selectedCatId).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedService(s);
                        setFormData({});
                        setUploadedFiles([]);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex flex-col gap-1 border cursor-pointer ${
                        selectedService?.id === s.id
                          ? "bg-gray-905 text-white border-none shadow-md"
                          : "bg-gray-50 text-gray-800 border border-gray-150 hover:bg-gray-100"
                      }`}
                      id={`select-specific-service-${s.id}`}
                    >
                      <span className="font-extrabold line-clamp-1">{s.name}</span>
                      <span className="text-[10px] opacity-75">{s.duration} • {s.priceEstimate}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Center Column: Dynamic Form & Sandbox Scanner (Cols 8) */}
            <div className="lg:col-span-8 flex flex-col gap-6" id="dashboard-center-form">
              {selectedService ? (
                <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm">
                  {/* Service Card Header */}
                  <div className="border-b border-gray-100 pb-5 mb-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <span className="text-[10px] font-extrabold font-mono bg-[#00C853]/10 text-[#00C853] px-2.5 py-0.5 rounded-full border border-[#00C853]/10">
                        {CATEGORIES.find((c) => c.id === selectedService.category)?.name}
                      </span>
                      <h3 className="text-xl font-bold text-gray-950 mt-1.5">{selectedService.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{selectedService.description}</p>
                    </div>
                    <div className="bg-gray-55/80 p-3 rounded-xl border border-gray-150/40 text-[11px] font-semibold shrink-0">
                      <div className="text-gray-450 uppercase text-[8px] font-bold tracking-wider leading-none">Estimate Rates</div>
                      <div className="font-extrabold text-gray-900 mt-0.5 text-xs">{selectedService.priceEstimate}</div>
                      <div className="text-emerald-700 text-[10px] font-mono mt-0.5">⏱ Expected: {selectedService.duration}</div>
                    </div>
                  </div>

                  {/* OCR Simulator Feature Box */}
                  <div className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-600 text-white p-2.5 rounded-lg">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                          Instant OCR Form Prefiller
                          <span className="text-[9px] bg-indigo-120 text-indigo-800 font-mono uppercase px-1.5 rounded">Interactive Smart Desk</span>
                        </h4>
                        <p className="text-[11px] text-indigo-750 mt-1">
                          Test our intelligent document scanning feature. Click a template below to simulate active document scanning, OCR parse, and auto-population.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerOcr("nin")}
                            className="bg-white border border-indigo-200 hover:border-indigo-500 text-xs font-bold text-indigo-900 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                            id="ocr-demo-nin"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            Scan National ID / NIN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTriggerOcr("waec")}
                            className="bg-white border border-indigo-200 hover:border-indigo-500 text-xs font-bold text-indigo-900 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                            id="ocr-demo-waec"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            Scan WAEC Exam cert
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HTML FORM */}
                  <form onSubmit={handleSubmitOrder} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {selectedService.formFields.map((field) => {
                        if (field.type === "file") return null; // Rendered below in separate zone

                        return (
                          <div 
                            key={field.name} 
                            className={`flex flex-col gap-1.5 ${
                              field.type === "textarea" ? "md:col-span-2" : ""
                            }`}
                          >
                            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                              {field.label}
                              {field.required && <span className="text-red-500">*</span>}
                            </label>

                            {field.type === "select" ? (
                              <select
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                required={field.required}
                                className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-850 focus:border-[#00C853] outline-none"
                                id={`form-input-${field.name}`}
                              >
                                <option value="">Select options...</option>
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === "textarea" ? (
                              <textarea
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                required={field.required}
                                placeholder={field.placeholder}
                                rows={4}
                                className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-xs text-slate-800 focus:border-[#00C853] outline-none"
                                id={`form-input-${field.name}`}
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                required={field.required}
                                placeholder={field.placeholder}
                                className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-800 focus:border-[#00C853] outline-none"
                                id={`form-input-${field.name}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Drag and Drop File Upload Area */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        Supporting Credentials & ID Verification Files
                        <span className="text-red-500">*</span>
                      </label>

                      {/* Drop Zone Box */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${
                          dragActive 
                            ? "border-[#00C853] bg-emerald-500/5" 
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"
                        }`}
                        id="document-drag-zone"
                      >
                        <input
                          type="file"
                          multiple
                          onChange={handleFileInput}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          id="file-input-hidden"
                          title="file upload input"
                        />
                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm text-[#00C853]">
                          <Upload className="w-5.5 h-5.5" />
                        </div>
                        <p className="text-xs font-bold text-gray-800 mt-3">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-[10px] text-gray-450 mt-1">
                          Supports JPG, PNG, PDF or DOCX up to 10MB per file
                        </p>
                      </div>

                      {/* Display Uploaded File list */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2 mt-2" id="uploaded-files-list">
                          {uploadedFiles.map((f, i) => (
                            <div
                              key={i}
                              className="bg-gray-100/65 border border-gray-200 rounded-xl p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2 max-w-[85%]">
                                {f.dataUrl ? (
                                  <img 
                                    src={f.dataUrl} 
                                    alt="preview" 
                                    className="w-10 h-10 object-cover rounded-lg border border-gray-200" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-[#00C853]/10 text-[#00C853] flex items-center justify-center rounded-lg border border-gray-200">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                )}
                                <div className="truncate">
                                  <div className="text-xs font-bold text-gray-900 truncate">{f.name}</div>
                                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{f.size}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                                title="Remove File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notice Block */}
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex gap-2.5 items-start">
                      <AlertTriangle className="w-5 h-4.5 text-amber-700 mt-0.5 shrink-0" />
                      <div className="text-[10.5px] text-amber-900 leading-normal">
                        All verification requests compile a secure ID metadata sheet first. Please click submit below, then forward the system receipt to our WhatsApp desk to finalize the administrative filing.
                      </div>
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#00C853]/25 transition-all cursor-pointer"
                        id="submit-form-button"
                      >
                        <ClipboardCheck className="w-4.5 h-4.5" />
                        Generate Invoice & Verify
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-500 mt-4">Please choose a service from the left sidebar to load its form data.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Track Tab */}
        {dashboardTab === "track" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            
            {/* Left Column: History list of tasks (Cols 5) */}
            <div className="lg:col-span-5 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm" id="tracking-orders-list">
              <h3 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-3">
                My Verification Inbox ({orders.length})
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className={`w-full p-4 rounded-xl text-left border transition-all flex flex-col gap-2 cursor-pointer ${
                        selectedOrder?.id === o.id
                          ? "bg-emerald-50/50 border-[#00C853] shadow-sm"
                          : "bg-white border-gray-150 hover:bg-gray-50"
                      }`}
                      id={`track-order-item-${o.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold font-mono text-gray-500">{o.trackingId}</div>
                          <div className="text-xs font-extrabold text-gray-900 mt-0.5 line-clamp-1">{o.serviceName}</div>
                        </div>
                        <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full ${getOrderStatusColor(o.status)}`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] text-gray-400 mt-1 border-t border-gray-100/60 pt-2">
                        <span>📅 {o.submittedAt.split(",")[0]}</span>
                        <span className="font-semibold text-gray-600 uppercase tracking-wider">{o.files.length} Attachments</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-550 font-bold">You have not submitted any digital orders yet.</p>
                </div>
              )}
            </div>

            {/* Right Column: Active Task Visual Tracker Node, WhatsApp generation and Developer Demo controls (Cols 7) */}
            <div className="lg:col-span-7 flex flex-col gap-6" id="tracking-detail-panel">
              {selectedOrder ? (
                <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                  {/* Title and ID */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start border-b border-gray-100 pb-4 mb-5">
                    <div>
                      <span className="text-xs font-semibold text-[#00C853]">{selectedOrder.trackingId}</span>
                      <h3 className="font-extrabold text-lg text-gray-950 mt-0.5">{selectedOrder.serviceName}</h3>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {selectedOrder.id} • Submitted: {selectedOrder.submittedAt}</p>
                    </div>
                    <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-lg ${getOrderStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* WhatsApp trigger CTA */}
                  <div className="bg-emerald-500/10 border border-[#00C853]/20 p-5 rounded-xl text-center flex flex-col items-center">
                    <MessageSquare className="w-10 h-10 text-[#00C853]" />
                    <h4 className="text-sm font-extrabold text-emerald-950 mt-2">Active WhatsApp Dispatch Needed</h4>
                    <p className="text-xs text-emerald-800 leading-normal max-w-md mt-1">
                      Our system registered your credentials successfully. Click below to launch WhatsApp and send your secure invoice directly to our administrative desk.
                    </p>
                    <a
                      href={generateWhatsAppMessage(selectedOrder)}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="mt-4 bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-xs px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow shadow-[#00C853]/20"
                      id="track-dispatch-whatsapp"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Invoice to WhatsApp (09041818917)
                    </a>
                  </div>

                  {/* Dev Sandbox State Control */}
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-150 rounded-xl">
                    <h4 className="text-xs font-extrabold text-gray-900 flex items-center gap-2">
                      <Landmark className="text-[#00C853] w-4.5 h-4.5" />
                      State Pipeline Sandbox Simulator
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Since this is a client demo model, click to manually advance this task's status node to preview visual states in the tracker pipeline.
                    </p>
                    <button
                      type="button"
                      onClick={() => advanceMockStatus(selectedOrder)}
                      className="mt-3 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow"
                      id="simulate-advance-state"
                    >
                      Advance Status Stage
                    </button>
                  </div>

                  {/* Visual Tracker Stepper */}
                  <div className="mt-8">
                    <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-5">
                      Progress Tracker Timeline
                    </h4>

                    <div className="relative pl-6 space-y-6">
                      {/* Vertical line connector */}
                      <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-150"></div>

                      {/* Step 1 */}
                      <div className="relative flex items-start gap-4">
                        <div className="absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white bg-[#00C853] shadow-sm"></div>
                        <div>
                          <p className="text-xs font-extrabold text-gray-900">Task Received & Registered</p>
                          <p className="text-[10px] text-gray-400">Order successfully logged in MYSOLUTION's client cache system with unique ID.</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative flex items-start gap-4">
                        <div className={`absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${
                          ["Pending Verification", "Processing", "Completed"].includes(selectedOrder.status)
                            ? "bg-[#00C853]"
                            : "bg-gray-300"
                        }`}></div>
                        <div>
                          <p className={`text-xs font-bold ${
                            ["Pending Verification", "Processing", "Completed"].includes(selectedOrder.status)
                              ? "text-gray-900 font-extrabold"
                              : "text-gray-400"
                          }`}>Document Security Audit</p>
                          <p className="text-[10px] text-gray-400">Civil and academic databases are checked relative to NIN parameters.</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative flex items-start gap-4">
                        <div className={`absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${
                          ["Processing", "Completed"].includes(selectedOrder.status)
                            ? "bg-[#00C853]"
                            : "bg-gray-300"
                        }`}></div>
                        <div>
                          <p className={`text-xs font-bold ${
                            ["Processing", "Completed"].includes(selectedOrder.status)
                              ? "text-gray-900 font-extrabold"
                              : "text-gray-400"
                          }`}>Administrative Processing</p>
                          <p className="text-[10px] text-gray-400">Liaison officers settle official fees and file modification requests with authorities.</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="relative flex items-start gap-4">
                        <div className={`absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${
                          selectedOrder.status === "Completed"
                            ? "bg-[#00C853]"
                            : "bg-gray-300"
                        }`}></div>
                        <div>
                          <p className={`text-xs font-bold ${
                            selectedOrder.status === "Completed"
                              ? "text-gray-900 font-extrabold"
                              : "text-gray-400"
                          }`}>Completed & Dispatch Delivered</p>
                          <p className="text-[10px] text-gray-400">Digital slips are generated, active PINs are deployed, or physical frames dispatched.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Values display summary */}
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-widest mb-3">Submitted Entry Logs</h4>
                    <div className="bg-gray-50 border border-gray-150/40 rounded-xl p-4 space-y-2.5">
                      {Object.entries(selectedOrder.formData).map(([key, val]) => {
                        const sObj = SERVICES.find((s) => s.id === selectedOrder.serviceId);
                        const label = sObj?.formFields.find((f) => f.name === key)?.label || key;
                        return (
                          <div key={key} className="text-xs">
                            <span className="text-gray-450 block uppercase text-[8px] font-extrabold tracking-wider leading-none">{label}</span>
                            <span className="font-semibold text-gray-800 block mt-1 whitespace-pre-line">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-400 mt-4">Select an active tracking order on the left column to view status updates.</p>
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* Naira Wallet System Tab */}
        {dashboardTab === "wallet" && (
          <div className="mt-6 animate-fadeIn space-y-6" id="wallet-system-dashboard">
            {/* Wallet Welcome Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Wallet Main Balance Presentation Card (Cols 5) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-gray-905 to-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
                {/* Visual Accent Glows */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C853]/15 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"></span>
                      Core Funding Wallet
                    </span>
                    <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white font-mono font-semibold uppercase">
                      NGN • SECURE
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="text-gray-450 text-xs">Total Available Balance</div>
                    <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1.5 font-sans">
                      ₦{currentUser.walletBalance.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-xs text-gray-350">
                  <div>
                    <div className="text-[9px] uppercase font-mono text-gray-450 leading-none">Registered Account ID</div>
                    <div className="font-semibold text-white mt-1 text-[11px] font-mono">{currentUser.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-mono text-gray-450 leading-none">Linked Phone</div>
                    <div className="font-semibold text-white mt-1 text-[11px] font-mono">{currentUser.phoneNumber}</div>
                  </div>
                </div>
              </div>

              {/* Fund Wallet Controls (Cols 7) */}
              <div className="lg:col-span-7 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5 mb-1">
                  <Wallet className="w-4 h-4 text-[#00C853]" />
                  Fund Your Wallet Cash
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Select a preloaded voucher or verify a bank transfer automatically to deposit Naira. No extra processing fees apply.
                </p>

                {/* Amount presets */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {["2000", "5000", "10000", "20000", "50000"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setFundAmount(preset);
                        setCustomFundAmount("");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        fundAmount === preset && !customFundAmount
                          ? "bg-[#00C853] text-white border-[#00C853] shadow-sm shadow-[#00C853]/15"
                          : "bg-gray-50 text-gray-700 border-gray-150 hover:bg-gray-100"
                      }`}
                    >
                      ₦{parseInt(preset).toLocaleString()}
                    </button>
                  ))}
                  <div className="relative inline-flex items-center">
                    <span className="absolute left-3 text-xs text-gray-500 font-bold">₦</span>
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customFundAmount}
                      onChange={(e) => {
                        setCustomFundAmount(e.target.value);
                        setFundAmount("");
                      }}
                      className="pl-6 pr-3 py-2 w-24 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 outline-none focus:border-[#00C853] font-bold"
                    />
                  </div>
                </div>

                {/* Gateway Selector Segment */}
                <div className="bg-gray-100 p-1 rounded-xl flex items-center mb-5">
                  <button
                    onClick={() => setFundingType("transfer")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      fundingType === "transfer"
                        ? "bg-white text-gray-950 shadow-sm"
                        : "bg-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    Instant Bank Transfer
                  </button>
                  <button
                    onClick={() => setFundingType("card")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      fundingType === "card"
                        ? "bg-white text-gray-950 shadow-sm"
                        : "bg-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Debit / Credit Card
                  </button>
                </div>

                {/* Simulated Payment Area */}
                {isFundingProcessing ? (
                  <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest">{fundingMessage}</h4>
                    <p className="text-[10px] text-gray-400">Verifying secure ledger logs by central banking system...</p>
                  </div>
                ) : fundingType === "transfer" ? (
                  /* BANK TRANSFER MOCK DESIGN */
                  <div className="bg-[#00C853]/5 border border-[#00C853]/15 rounded-2xl p-4 md:p-5 text-gray-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[9px] uppercase font-mono tracking-widest text-[#00C853] font-bold">MONIEPOINT INTEGRATED SETTLEMENT</div>
                        <h4 className="text-xs font-bold text-gray-900 mt-1">Simulated Direct Bank Transfer</h4>
                      </div>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded font-mono">SANDBOX ACTIVE</span>
                    </div>

                    <div className="bg-white border border-gray-150 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Moniepoint Bank Code</div>
                        <div className="font-extrabold text-gray-900 mt-0.5">Moniepoint Microfinance Bank</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Settlement Account</div>
                        <div className="font-extrabold text-gray-900 mt-0.5 font-mono">8209 1122 334</div>
                      </div>
                      <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Beneficiary Name</div>
                        <div className="font-extrabold text-gray-900 mt-0.5">MYSOLUTION HUB DEPOSIT DESK</div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-start text-[10px] text-[#00C853] leading-normal bg-white border border-emerald-100 p-3 rounded-lg">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Transmit <strong>₦{parseFloat(fundAmount || customFundAmount || "0").toLocaleString()}</strong> to the Moniepoint settle box, then click the confirmation verification button below to instantly authorize mock credit.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const amt = parseFloat(fundAmount || customFundAmount || "0");
                        if (amt <= 0) {
                          alert("Please enter or select a deposit amount greater than zero.");
                          return;
                        }

                        setIsFundingProcessing(true);
                        setFundingMessage("Handshaking with central banking processor...");
                        
                        setTimeout(() => {
                          setFundingMessage("Matching received transaction signatures...");
                        }, 800);

                        setTimeout(() => {
                          setFundingMessage("Credits authorizing automatically...");
                        }, 1600);

                        setTimeout(() => {
                          // Success credit
                          const finalBalance = currentUser.walletBalance + amt;
                          const newLogs: WalletTransaction = {
                            id: `tx-credit-${Date.now()}`,
                            type: "credit",
                            amount: amt,
                            description: "Cash Deposit via Instant Bank Transfer",
                            date: new Date().toLocaleString()
                          };

                          const updatedUser: UserAccount = {
                            ...currentUser,
                            walletBalance: finalBalance,
                            transactions: [newLogs, ...currentUser.transactions]
                          };

                          updateUserProfileState(updatedUser);
                          setIsFundingProcessing(false);
                          alert(`🎉 Funding Success!\n\n₦${amt.toLocaleString()} has been added to your Naira wallet balance!`);
                          setCustomFundAmount("");
                        }, 2400);
                      }}
                      className="w-full bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      I Have Sent the Money (Verify Ledger)
                    </button>
                  </div>
                ) : (
                  /* CARD DEPOSIT INTUITIVE FORM WITH CARD PREVIEW */
                  <div className="border border-gray-150 rounded-2xl p-5 space-y-5">
                    
                    {/* Simulated visual ATM card */}
                    <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-gray-905 rounded-2xl p-5 text-white shadow relative overflow-hidden min-h-[140px] flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold italic tracking-widest text-[#00C853]">MYS_PAYGATE</span>
                        {/* Gold chip */}
                        <div className="w-7 h-5 bg-gradient-to-tr from-amber-300 to-amber-500 rounded border border-amber-400"></div>
                      </div>

                      <div className="my-3 text-sm tracking-widest font-mono text-gray-200">
                        {cardNumber ? cardNumber.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                      </div>

                      <div className="flex justify-between items-end text-[10px] font-mono mt-2">
                        <div>
                          <div className="text-[7px] text-gray-400 uppercase">Card Holder</div>
                          <div className="uppercase font-bold tracking-tight text-white">{currentUser.fullName}</div>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <div className="text-[7px] text-gray-400 uppercase">Expiry</div>
                            <div className="font-bold text-white">{cardExpiry || "MM/YY"}</div>
                          </div>
                          <div>
                            <div className="text-[7px] text-gray-400 uppercase">CVV</div>
                            <div className="font-bold text-white">{cardCvv || "•••"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simple card inputs row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-3 flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Debit Card Number</label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="e.g. 5061023948123910"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#00C853] font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-2.5 text-xs text-center outline-none focus:border-[#00C853]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">CVV Security</label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-2.5 text-xs text-center outline-none focus:border-[#00C853] font-mono"
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setCardNumber("5399831920381923");
                            setCardExpiry("11/29");
                            setCardCvv("538");
                          }}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[9px] py-3 rounded-xl transition-all cursor-pointer"
                        >
                          Auto Input
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const amt = parseFloat(fundAmount || customFundAmount || "0");
                        if (amt <= 0) {
                          alert("Please specify a valid credit amount above zero.");
                          return;
                        }

                        if (!cardNumber || !cardExpiry || !cardCvv) {
                          alert("Please fill your mock card credentials first or click 'Auto Input'.");
                          return;
                        }

                        setIsFundingProcessing(true);
                        setFundingMessage("Initiating secured payment tunnel authorization...");

                        setTimeout(() => {
                          setFundingMessage("Pinging 3D Secure verification protocol...");
                        }, 900);

                        setTimeout(() => {
                          setFundingMessage("Finalizing Naira credit injection ledger...");
                        }, 1800);

                        setTimeout(() => {
                          const finalBalance = currentUser.walletBalance + amt;
                          const newTx: WalletTransaction = {
                            id: `tx-credit-${Date.now()}`,
                            type: "credit",
                            amount: amt,
                            description: `Card Funding via Paygate Gateway (Ending *${cardNumber.slice(-4)})`,
                            date: new Date().toLocaleString()
                          };

                          const updatedUser: UserAccount = {
                            ...currentUser,
                            walletBalance: finalBalance,
                            transactions: [newTx, ...currentUser.transactions]
                          };

                          updateUserProfileState(updatedUser);
                          setIsFundingProcessing(false);
                          
                          alert(`🎉 Card Payment Successful!\n\n₦${amt.toLocaleString()} has been securely injected to your available balance.`);
                          setCardNumber("");
                          setCardExpiry("");
                          setCardCvv("");
                          setCustomFundAmount("");
                        }, 2600);
                      }}
                      className="w-full bg-gray-950 hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      Securely Settle Card Payment (₦{parseFloat(fundAmount || customFundAmount || "0").toLocaleString()})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* WALLET TRANSACTIONS STATEMENT BOARD */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-950 tracking-tight flex items-center gap-1.5">
                    <History className="w-4.5 h-4.5 text-[#00C853]" />
                    Statement Account Ledger
                  </h3>
                  <p className="text-[11px] text-gray-500">Record of credit deposits and service invoice settlement histories.</p>
                </div>
                <span className="text-[10px] font-mono bg-gray-100 px-3 py-1 rounded text-gray-500">
                  {currentUser.transactions.length} Transactions Logged
                </span>
              </div>

              {currentUser.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700 leading-normal border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase font-mono tracking-widest text-gray-400">
                        <th className="py-3 px-2 font-bold">Transaction Reference ID</th>
                        <th className="py-3 px-2 font-bold">Nature / Action</th>
                        <th className="py-3 px-2 font-bold">Timestamp Logged</th>
                        <th className="py-3 px-2 font-bold">Processing Node</th>
                        <th className="py-3 px-2 font-bold text-right">Adjustment Ledger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {currentUser.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-2 font-mono text-[10px] uppercase text-gray-500">
                            {tx.id}
                          </td>
                          <td className="py-3.5 px-2 text-gray-900 font-semibold">
                            {tx.description}
                          </td>
                          <td className="py-3.5 px-2 text-gray-400 text-[11px]">
                            {tx.date}
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-150">
                              <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-ping"></span>
                              Completed
                            </span>
                          </td>
                          <td className={`py-3.5 px-2 text-right font-extrabold text-xs ${
                            tx.type === "credit" ? "text-emerald-600" : "text-gray-900"
                          }`}>
                            {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-400 font-bold">No registered statement actions found on this account ledger.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
