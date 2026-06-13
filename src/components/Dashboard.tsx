import React from "react";
import { 
  FileText, ArrowLeft, Upload, FileCheck, CheckCircle2, ShieldCheck, 
  Trash2, MessageSquare, Plus, Clock, Landmark, AlertTriangle, 
  Sparkles, Layers, ListFilter, PlayCircle, ClipboardCheck,
  Wallet, LogOut, ArrowDownLeft, ArrowUpRight, CreditCard, User, Info, DollarSign, History,
  Database, HelpCircle, Eye, Settings, FileSpreadsheet, Download, RefreshCw, BarChart2
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
  // Application role toggle: "user" | "admin" to test both personas seamlessly
  const [roleMode, setRoleMode] = React.useState<"user" | "admin">("user");

  // Dynamic services (stores standard data and admin additions dynamically in local storage)
  const [services, setServices] = React.useState<Service[]>(() => {
    const saved = localStorage.getItem("mysolution_custom_services");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SERVICES;
      }
    }
    return SERVICES;
  });

  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem("mysolution_custom_services", JSON.stringify(newServices));
  };

  // Selected Category ID
  const [selectedCatId, setSelectedCatId] = React.useState<string>("educational_services");
  // Selected Service
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  
  // Custom form input state
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = React.useState<{ name: string; size: string; type: string; dataUrl?: string }[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  
  // OCR Prefill Scanner state
  const [scanning, setScanning] = React.useState(false);
  const [scanMessage, setScanMessage] = React.useState("");

  // Orders stored locally
  const [orders, setOrders] = React.useState<VerificationOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<VerificationOrder | null>(null);
  
  // Current Active Dashboard client Tab: "apply", "track" or "wallet"
  const [dashboardTab, setDashboardTab] = React.useState<"apply" | "track" | "wallet">("apply");

  // Success screen state after correct checkout
  const [successOrder, setSuccessOrder] = React.useState<VerificationOrder | null>(null);

  // Authenticated State matching
  const [currentUser, setCurrentUser] = React.useState<UserAccount | null>(null);
  const [fundingType, setFundingType] = React.useState<"transfer" | "card">("transfer");
  const [fundAmount, setFundAmount] = React.useState<string>("10000");
  const [customFundAmount, setCustomFundAmount] = React.useState<string>("");
  const [isFundingProcessing, setIsFundingProcessing] = React.useState(false);
  const [fundingMessage, setFundingMessage] = React.useState("");

  // Card parameters
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  // ADMIN STATE CONTROLS
  const [adminTab, setAdminTab] = React.useState<"stats" | "services" | "orders" | "users" | "transactions">("stats");
  const [allUsers, setAllUsers] = React.useState<UserAccount[]>([]);
  const [adminSelectedOrder, setAdminSelectedOrder] = React.useState<VerificationOrder | null>(null);
  const [adminSelectedUser, setAdminSelectedUser] = React.useState<UserAccount | null>(null);
  
  // Admin Editing / Adding Service
  const [isAddingService, setIsAddingService] = React.useState(false);
  const [newServiceName, setNewServiceName] = React.useState("");
  const [newServiceCategory, setNewServiceCategory] = React.useState("educational_services");
  const [newServicePrice, setNewServicePrice] = React.useState("₦5,000");
  const [newServiceDuration, setNewServiceDuration] = React.useState("24 Hours");
  const [newServiceDescription, setNewServiceDescription] = React.useState("");
  
  // Dynamic fields array builder for new services
  const [newServiceFields, setNewServiceFields] = React.useState<FormField[]>([
    { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. John Doe" }
  ]);
  const [fieldBuilderLabel, setFieldBuilderLabel] = React.useState("");
  const [fieldBuilderType, setFieldBuilderType] = React.useState<"text" | "number" | "select" | "textarea" | "date" | "file">("text");
  const [fieldBuilderRequired, setFieldBuilderRequired] = React.useState(true);

  // Load user session and sync lists on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("mysolution_current_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed loading saved user session", e);
      }
    }

    const savedUsers = localStorage.getItem("mysolution_users");
    if (savedUsers) {
      try {
        setAllUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error("Failed loading saved users list", e);
      }
    }
  }, []);

  // Update current user account and cascade changes to registered storage
  const updateUserProfileState = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("mysolution_current_user", JSON.stringify(updatedUser));

    const usersRaw = localStorage.getItem("mysolution_users");
    if (usersRaw) {
      try {
        const users = JSON.parse(usersRaw) as UserAccount[];
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setAllUsers(updatedUsers);
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
    setSuccessOrder(null);
  };

  // Extractor for prices (e.g. ₦15,050 -> 15050)
  const getNumericCost = (estimate: string): number => {
    const cleaned = estimate.replace(/₦/g, "").replace(/,/g, "");
    const match = cleaned.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }
    return 1000;
  };

  // Initialize or load orders on mount
  React.useEffect(() => {
    const savedOrders = localStorage.getItem("mysolution_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          if (parsed.length > 0) {
            setSelectedOrder(parsed[0]);
            setAdminSelectedOrder(parsed[0]);
          }
        }
      } catch (e) {
        console.error("Failed loading saved orders", e);
      }
    } else {
      // Seed a default order to populate visual elements immediately
      const demoTick: VerificationOrder = {
        id: "MSH-DE-9283",
        serviceId: "jamb-original-result",
        serviceName: "JAMB Original Result Printing",
        category: "jamb_services",
        submittedAt: new Date(Date.now() - 3600000 * 3).toLocaleString(),
        formData: {
          fullName: "Damilola Beatrice Okafor",
          jambRegNo: "26532451JA",
          phoneNumber: "08031122334",
          emailAddress: "student@mysolution.com"
        },
        files: [{ name: "waec_verification_slip.pdf", size: "145 KB", type: "application/pdf" }],
        status: "Pending", // Displays beautifully as "Pending Processing"
        trackingId: "JOR53920"
      };
      setOrders([demoTick]);
      setSelectedOrder(demoTick);
      setAdminSelectedOrder(demoTick);
      localStorage.setItem("mysolution_orders", JSON.stringify([demoTick]));
    }
  }, []);

  // Sync category and service selection if incoming from homepage click
  React.useEffect(() => {
    if (initialServiceId) {
      const match = services.find((s) => s.id === initialServiceId);
      if (match) {
        setSelectedService(match);
        setSelectedCatId(match.category);
        setDashboardTab("apply");
        setFormData({});
        setUploadedFiles([]);
        setSuccessOrder(null);
      }
    } else {
      const list = services.filter((s) => s.category === selectedCatId);
      if (list.length > 0 && !selectedService) {
        setSelectedService(list[0]);
      }
    }
  }, [initialServiceId, selectedCatId, services]);

  // Handle Drag & Drop uploading
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
      const sizeStr = `${Math.round(f.size / 1024)} KB`;
      let dataUrl: string | undefined = undefined;
      if (f.type.startsWith("image/")) {
        dataUrl = URL.createObjectURL(f);
      }
      newFiles.push({
        name: f.name,
        size: sizeStr,
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

  // Smart Pre-filled Initials Order ID generator matching Step 5 point 1 and Step 6
  const generateOrderNo = (serviceName: string) => {
    const initials = serviceName
      .split(" ")
      .map(word => word[0])
      .join("")
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 4);
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `${initials}${rand}`;
  };

  // Simulated Optical Character Recognition
  const handleTriggerOcr = (type: "nin" | "waec") => {
    setScanning(true);
    setScanMessage("Handshaking with cognitive AI vision servers...");

    setTimeout(() => {
      setScanMessage("Extracting text streams and bounding coordinate blocks...");
    }, 800);

    setTimeout(() => {
      setScanMessage("Parsing variables and auto-populating fields...");
    }, 1700);

    setTimeout(() => {
      setScanning(false);
      if (type === "nin") {
        const dummyNin = {
          fullName: "Chioma Deborah Yusuf",
          ninNumber: "38209381745",
          linkedPhone: "08034567812",
          phoneNumber: "08034567812",
          dateOfBirth: "1998-05-14",
          linkedPhoneNo: "08034567812"
        };
        setFormData((prev) => ({ ...prev, ...dummyNin }));
        setUploadedFiles([
          { name: "scanned_regulatory_nin_slip.jpg", size: "235 KB", type: "image/jpeg" }
        ]);
        alert("🎉 OCR Scan Complete! NIN details extracted and populated.");
      } else {
        const dummyWaec = {
          fullName: "Chioma Deborah Yusuf",
          studentName: "Chioma Deborah Yusuf",
          dateOfBirth: "1998-05-14",
          emailAddress: "student@mysolution.com",
          phoneNumber: "08034567812",
          subjectsList: "English (A1), Mathematics (B2), Physics (B3), Chemistry (C4), Biology (B2), Civic Education (A1), Economics (B3), Agricultural Science (B2)",
          examLocation: "Lagos, WAEC Zone Center A",
          subjects: "All science subjects successfully mapped"
        };
        setFormData((prev) => ({ ...prev, ...dummyWaec }));
        setUploadedFiles([
          { name: "waec_prefill_statement.pdf", size: "485 KB", type: "application/pdf" }
        ]);
        alert("🎉 OCR Scan Complete! WAEC parameters mapped successfully.");
      }
    }, 2500);
  };

  // CHECKOUT PAYMENT WITH WALLET SYSTEM DEDUCTION (Steps 4 & 5)
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    // Evaluate physical or digital field requirements
    const missingFields = selectedService.formFields.filter(f => f.required && !formData[f.name]);
    if (missingFields.length > 0 && uploadedFiles.length === 0) {
      alert(`Missing Parameters! Please complete: ${missingFields[0].label}`);
      return;
    }

    const serviceCost = getNumericCost(selectedService.priceEstimate);

    if (!currentUser) {
      alert("Please authenticate or log in to submit your request.");
      return;
    }

    // Step 4: Wallet verification check
    if (currentUser.walletBalance < serviceCost) {
      alert(`Insufficient Funds!\n\nThis Service costs ₦${serviceCost.toLocaleString()}.\nYour Wallet balance is: ₦${currentUser.walletBalance.toLocaleString()}.\nTo proceed, please fund your wallet with at least ₦${(serviceCost - currentUser.walletBalance).toLocaleString()}.`);
      setDashboardTab("wallet");
      return;
    }

    // Securely debit from state representation
    const newBalance = currentUser.walletBalance - serviceCost;
    const debitTx: WalletTransaction = {
      id: `TX-DEBIT-${Date.now().toString().slice(-6)}`,
      type: "debit",
      amount: serviceCost,
      description: `Settle: ${selectedService.name} Booking`,
      date: new Date().toLocaleString()
    };

    const updatedUser: UserAccount = {
      ...currentUser,
      walletBalance: newBalance,
      transactions: [debitTx, ...currentUser.transactions]
    };

    updateUserProfileState(updatedUser);

    // Step 5: Save submitted parameters and create order tracking
    const orderNo = generateOrderNo(selectedService.name);
    const newOrder: VerificationOrder = {
      id: `ord-${Date.now()}`,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      category: selectedService.category,
      submittedAt: new Date().toLocaleString(),
      formData: { ...formData },
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : [{ name: "virtual_prefill_reference.pdf", size: "35 KB", type: "application/pdf" }],
      status: "Pending", // Default is Pending, displayed as Pending Processing to the user
      trackingId: orderNo
    };

    const updatedOrdersList = [newOrder, ...orders];
    setOrders(updatedOrdersList);
    setSelectedOrder(newOrder);
    setAdminSelectedOrder(newOrder);
    localStorage.setItem("mysolution_orders", JSON.stringify(updatedOrdersList));

    // Reset input fields
    setFormData({});
    setUploadedFiles([]);

    // Open successful payment receipt view (Step 5)
    setSuccessOrder(newOrder);
  };

  // Pre-compiled WhatsApp Dispatch logic (Step 6)
  const getWhatsAppLink = (o: VerificationOrder) => {
    const text = `Hello MYSOLUTION HUB, I have successfully made payment for ${o.serviceName}.\n\nOrder ID: #${o.trackingId}\n\nKindly proceed with processing my request.\n\nThank you.`;
    return `https://wa.me/2349041818917?text=${encodeURIComponent(text)}`;
  };

  // Status visual color mapper (Step 7)
  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return { label: "Pending Processing", color: "bg-amber-50 text-amber-800 border-amber-200" };
      case "Under Review":
        return { label: "Under Review", color: "bg-blue-50 text-blue-800 border-blue-200" };
      case "Processing":
        return { label: "Processing", color: "bg-purple-50 text-purple-800 border-purple-200" };
      case "Completed":
        return { label: "Completed", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "Rejected":
        return { label: "Rejected", color: "bg-red-50 text-red-800 border-red-200" };
      default:
        return { label: status, color: "bg-gray-50 text-gray-800 border-gray-200" };
    }
  };

  // Custom Virtual completed file download (Step 8: Download Center)
  const handleDownloadCompletedFile = (o: VerificationOrder) => {
    const paramsList = Object.entries(o.formData)
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join("\n");

    // Render out a clean certified document format
    const docLayout = `
=========================================
      MYSOLUTION HUB CERTIFIED FILE
=========================================
Order tracking code: ${o.trackingId}
Date Processed: ${o.submittedAt}
Registry Service: ${o.serviceName}
Authorized Status: COMPLETED
File ID: REG-${Math.floor(1000 + Math.random() * 9000)}-PDF
Liaison Office: MYSOLUTION HUB DIGITAL CENTER

------------- CLIENT PARAMETERS -------------
${paramsList}

---------------------------------------------
This serves as the officially certified completed digital dispatch from our central registry portal. For verification or printed frames, forward this to owohpaulchinedum@gmail.com.

Thank you.
=========================================
    `;
    const blob = new Blob([docLayout], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${o.completedDocName || o.serviceName.replace(/\s+/g, "_") + "_Document"}_${o.trackingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Admin: create a custom dynamic service (Step 9)
  const handleAdminAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServiceDescription) {
      alert("Please fill name and description for the new service.");
      return;
    }

    const brandNewService: Service = {
      id: `srv-admin-${Date.now()}`,
      name: newServiceName,
      category: newServiceCategory,
      priceEstimate: newServicePrice,
      duration: newServiceDuration,
      description: newServiceDescription,
      formFields: [...newServiceFields]
    };

    const updated = [brandNewService, ...services];
    saveServices(updated);

    // Reset fields
    setNewServiceName("");
    setNewServiceDescription("");
    setNewServicePrice("₦5,000");
    setNewServiceDuration("24 Hours");
    setNewServiceFields([
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. John Doe" }
    ]);
    setIsAddingService(false);
    alert(`🎉 Custom Service "${newServiceName}" successfully integrated into the platform menu directory!`);
  };

  // Admin Field builder logic
  const handleAddFieldBuilder = () => {
    if (!fieldBuilderLabel) return;
    const nameKey = fieldBuilderLabel.toLowerCase().replace(/[^a-z0-9]/g, "");
    const newField: FormField = {
      name: nameKey,
      label: fieldBuilderLabel,
      type: fieldBuilderType,
      required: fieldBuilderRequired,
      placeholder: `Enter ${fieldBuilderLabel}...`
    };
    setNewServiceFields((prev) => [...prev, newField]);
    setFieldBuilderLabel("");
  };

  // Seed default registered users list on local system
  React.useEffect(() => {
    const defaultList = [
      {
        id: "demo-student-user",
        fullName: "Jane Doe (Demo Student)",
        email: "student@mysolution.com",
        phoneNumber: "08031122334",
        walletBalance: 15500,
        transactions: [
          {
            id: `tx-init`,
            type: "credit",
            amount: 15500,
            description: "Default Account Credited",
            date: new Date().toLocaleString()
          }
        ]
      },
      {
        id: "usr-admin-ops",
        fullName: "Owoh Paul Chinedum",
        email: "owohpaulchinedum@gmail.com",
        phoneNumber: "09041818917",
        walletBalance: 145000,
        transactions: []
      }
    ] as UserAccount[];

    const saved = localStorage.getItem("mysolution_users");
    if (!saved) {
      localStorage.setItem("mysolution_users", JSON.stringify(defaultList));
      setAllUsers(defaultList);
    }
  }, []);

  // Admin Settle Deposit Cash to any user account (Step 9)
  const handleAdminFundUserWallet = (targetUserId: string, amtStr: string, note: string) => {
    const amt = parseFloat(amtStr);
    if (isNaN(amt) || amt <= 0) {
      alert("Explain a valid credit deposit amount above zero.");
      return;
    }

    const updatedList = allUsers.map((user) => {
      if (user.id === targetUserId) {
        const creditTx: WalletTransaction = {
          id: `TX-CREDIT-MANUAL-${Date.now().toString().slice(-4)}`,
          type: "credit",
          amount: amt,
          description: note || "Custom Administrative Wallet Credit Settle",
          date: new Date().toLocaleString()
        };
        const updatedUser = {
          ...user,
          walletBalance: user.walletBalance + amt,
          transactions: [creditTx, ...user.transactions]
        };
        // Also keep current active logged user state in sync if they are the target
        if (currentUser && currentUser.id === user.id) {
          setCurrentUser(updatedUser);
          localStorage.setItem("mysolution_current_user", JSON.stringify(updatedUser));
        }
        return updatedUser;
      }
      return user;
    });

    setAllUsers(updatedList);
    localStorage.setItem("mysolution_users", JSON.stringify(updatedList));
    alert(`Success! Credited ₦${amt.toLocaleString()} to user account.`);
  };

  // Auth gate check
  if (!currentUser) {
    return (
      <div className="bg-gray-50/50 min-h-screen py-6 px-4 md:px-8 border-t border-gray-100" id="dashboard-unauth-root">
        <div className="max-w-7xl mx-auto">
          <div className="pb-4 flex justify-between items-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-bold bg-white border border-gray-200 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </button>
            <span className="text-xs text-gray-500 font-bold border border-gray-200 bg-white px-3 py-1.5 rounded-xl">🔒 SECURE 256-BIT PLATFORM</span>
          </div>
          <AuthScreen onLogin={updateUserProfileState} />
        </div>
      </div>
    );
  }

  // REVENUE INSIGHTS CALCULATIONS (Step 9 Statistics)
  const totalWalletDeposits = allUsers.reduce((sum, u) => {
    const accountCredits = u.transactions
      .filter((t) => t.type === "credit")
      .reduce((s, t) => s + t.amount, 0);
    return sum + accountCredits;
  }, 0);

  const totalRevenueCollected = orders.length * 4500 + orders.reduce((sum, o) => {
    const matchSrv = services.find(s => s.id === o.serviceId);
    return sum + (matchSrv ? getNumericCost(matchSrv.priceEstimate) : 3000);
  }, 0);

  const pendingTicketsCount = orders.filter((o) => o.status === "Pending" || o.status === "Under Review" || o.status === "Processing").length;
  const completedTicketsCount = orders.filter((o) => o.status === "Completed").length;

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 px-4 md:px-8 border-t border-gray-100 font-sans" id="mysolution-dashboard">
      <div className="max-w-7xl mx-auto">
        
        {/* Dynamic Navigation/Role Header Panel */}
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between pb-6 border-b border-gray-150">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs text-gray-650 hover:text-gray-900 font-bold transition-colors cursor-pointer bg-white border border-gray-150 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Homepage
              </button>
              
              <span className="text-[10px] uppercase font-mono font-extrabold px-3 py-1 bg-[#00C853]/10 text-emerald-800 rounded-full border border-emerald-100">
                Moniepoint Fintech Sandbox Flow
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Layers className="w-7 h-7 text-[#00C853]" />
              {roleMode === "user" ? "MYSOLUTION HUB Workspace" : "Administrative Command Center"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {roleMode === "user" 
                ? "Manage your digital records, order certificates and verify checkouts instantly using integrated Moniepoint sandbox transfers."
                : "Manage standard and custom categories, review and verify tickets, adjust user balance credits, and track revenue stats."
              }
            </p>
          </div>

          {/* User Persona & Role Mode Switch */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mt-2 lg:mt-0">
            {/* Elegant Selector Role Toggle */}
            <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center shadow-sm w-full sm:w-auto">
              <button
                onClick={() => {
                  setRoleMode("user");
                  setSuccessOrder(null);
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  roleMode === "user"
                    ? "bg-[#00C853] text-white shadow-sm"
                    : "text-gray-650 hover:bg-gray-50"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Student/Client
              </button>
              <button
                onClick={() => setRoleMode("admin")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  roleMode === "admin"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-650 hover:bg-gray-50"
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                Admin Dashboard
              </button>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="flex items-center gap-3 bg-white border border-gray-150 p-3 rounded-2xl w-full sm:w-auto shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-gray-950 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate text-left min-w-[90px]">
                <div className="text-[9px] font-bold text-gray-400 font-mono uppercase leading-none">Logged In</div>
                <div className="text-xs font-extrabold text-gray-900 mt-1 leading-none truncate">{currentUser.fullName}</div>
                <div className="text-[10px] text-gray-500 tracking-tight mt-0.5 truncate">₦{currentUser.walletBalance.toLocaleString()}</div>
              </div>
              <div className="h-6 w-[1.5px] bg-gray-100"></div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================== CLIENT/STUDENT MULTI-PAGE EXPERIENCE ==================== */}
        {roleMode === "user" && (
          <div id="user-viewspace" className="mt-6">
            
            {/* Interactive Step Success Screen Receipt (Step 5) */}
            {successOrder ? (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-10 shadow-xl max-w-xl mx-auto my-8 animate-fadeIn" id="success-receipt-page">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-[#00C853] rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-emerald-50">
                    <CheckCircle2 className="w-9 h-9 animate-bounce" />
                  </div>
                  
                  <span className="text-[10px] uppercase font-mono bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full">
                    Payment Successful
                  </span>
                  
                  <h3 className="text-2xl font-extrabold text-gray-900 mt-3 tracking-tight">Invoice Receipt Cleared</h3>
                  <p className="text-xs text-gray-500 mt-1">Your wallet has been securely debited. Reference details logged in NIMC/JAMB liaison desk.</p>
                </div>

                {/* Moniepoint-Style Dotted Receipt Design */}
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 mt-6 relative overflow-hidden">
                  {/* Decorative Side Circles */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-r border-gray-150 rounded-full"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-l border-gray-150 rounded-full"></div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center text-gray-400 font-mono text-[10px] uppercase tracking-wider pb-2 border-b border-dashed border-gray-200">
                      <span>Receipt Node</span>
                      <span>MSH-SEC-TX729</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Order ID</span>
                      <span className="font-extrabold text-gray-900">#{successOrder.trackingId}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Service Ordered</span>
                      <span className="font-extrabold text-gray-900 max-w-[200px] text-right truncate">{successOrder.serviceName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Amount Paid</span>
                      <span className="font-extrabold text-gray-900 text-sm">
                        ₦{getNumericCost(services.find(s => s.id === successOrder.serviceId)?.priceEstimate || "₦4,500").toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Date & Time</span>
                      <span className="font-extrabold text-gray-900 font-mono text-[11px]">{successOrder.submittedAt}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">Liaison Center</span>
                      <span className="font-extrabold text-[#00C853] uppercase tracking-wider">MYSOLUTION HUB</span>
                    </div>
                  </div>
                </div>

                {/* Step 6: Instant prefilled WhatsApp dispatch link */}
                <div className="mt-8 space-y-3">
                  <a
                    href={getWhatsAppLink(successOrder)}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="w-full bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-xs py-4.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#00C853]/25 cursor-pointer text-center"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Dispatch Secure Receipt to WhatsApp (Quick Action)
                  </a>

                  <button
                    onClick={() => {
                      setSuccessOrder(null);
                      setDashboardTab("track");
                    }}
                    className="w-full bg-gray-900 hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow cursor-pointer text-center"
                  >
                    Enter Order Tracking Pipeline
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Visual Segment Tabs Switcher */}
                <div className="bg-white border border-gray-150 p-1.5 rounded-2xl flex flex-col md:flex-row gap-2 items-center shadow-sm w-full mt-4" id="dash-tabs-switch">
                  <div className="flex items-center gap-1.5 w-full md:w-auto flex-1 md:flex-none">
                    <button
                      onClick={() => setDashboardTab("apply")}
                      className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        dashboardTab === "apply"
                          ? "bg-[#00C853] text-white shadow-sm"
                          : "bg-transparent text-gray-650 hover:bg-gray-50"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Browse Services & Buy
                    </button>
                    <button
                      onClick={() => setDashboardTab("track")}
                      className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                        dashboardTab === "track"
                          ? "bg-[#00C853] text-white shadow-sm"
                          : "bg-transparent text-gray-650 hover:bg-gray-50"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Track My Orders
                      {orders.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-550 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                          {orders.length}
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setDashboardTab("wallet")}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      dashboardTab === "wallet"
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-emerald-50/60 text-[#00C853] hover:bg-emerald-50 border border-emerald-100"
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-500" />
                    Fund Wallet (Instant Settle)
                    <span className="bg-emerald-500 text-white font-extrabold font-mono text-[9.5px] px-2 py-0.5 rounded-full ml-1">
                      ₦{currentUser.walletBalance.toLocaleString()}
                    </span>
                  </button>
                </div>

                {/* Submitting Forms Category Tab View */}
                {dashboardTab === "apply" && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Welcome Greeting Banner */}
                    <div className="bg-gradient-to-r from-gray-905 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mt-6">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00C853]/15 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                          <span className="inline-flex items-center gap-1 bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/20 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                            🟢 MYSOLUTION Marketplace Online
                          </span>
                          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Ready, Settle, Verify!</h3>
                          <p className="text-xs text-gray-350 mt-1.5 max-w-xl leading-relaxed">
                            Access automated processing portals for CAC incorporation registry, Birth NPCs, JAMB Original Slips, WAEC Pins, and swift driver licensing. Select any box below.
                          </p>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[140px]">
                          <div className="text-[9px] uppercase font-mono text-gray-400 font-bold tracking-widest">Available Credit</div>
                          <div className="text-2xl font-extrabold text-white mt-1">₦{currentUser.walletBalance.toLocaleString()}</div>
                          <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">● Secure Settlement</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Section Cards Row - displaying CATEGORIES */}
                    <div>
                      <h4 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00C853]"></span>
                        Service Registry Category Actions
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map((cat) => {
                          const countObj = services.filter(s => s.category === cat.id).length;
                          const isActive = selectedCatId === cat.id;

                          return (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCatId(cat.id);
                                const subset = services.filter(s => s.category === cat.id);
                                if (subset.length > 0) {
                                  setSelectedService(subset[0]);
                                  setFormData({});
                                  setUploadedFiles([]);
                                }
                              }}
                              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[170px] ${
                                isActive
                                  ? "bg-white border-[#00C853] shadow-md ring-2 ring-[#00C853]/15"
                                  : "bg-white border-gray-150 hover:bg-gray-50 hover:border-gray-300"
                              }`}
                            >
                              {isActive && (
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00C853]"></div>
                              )}
                              
                              <div className="flex justify-between items-start w-full">
                                <div className={`p-2.5 rounded-xl bg-emerald-500/10 text-[#00C853] group-hover:scale-110 transition-transform`}>
                                  <IconMapper name={cat.iconName} className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-mono text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded leading-none">
                                  {countObj} sub-services
                                </span>
                              </div>

                              <div className="mt-4">
                                <h5 className="text-xs font-extrabold text-gray-950 tracking-tight leading-tight group-hover:text-[#00C853] transition-colors">
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

                    {/* Step 1 & 2: Category checklist and customized dynamic Form fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                      {/* Sidebar Selector Checklist (Cols 4) */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                          <h3 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                            <ListFilter className="w-4 h-4 text-emerald-600" />
                            Select sub-service
                          </h3>

                          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                            {services.filter(s => s.category === selectedCatId).map((s) => {
                              const isServiceActive = selectedService?.id === s.id;
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => {
                                    setSelectedService(s);
                                    setFormData({});
                                    setUploadedFiles([]);
                                  }}
                                  className={`w-full p-3 rounded-xl text-left text-xs transition-all flex flex-col gap-1 border cursor-pointer ${
                                    isServiceActive
                                      ? "bg-gray-905 text-white border-transparent shadow"
                                      : "bg-gray-50 text-gray-800 border-gray-150 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="font-extrabold leading-tight">{s.name}</span>
                                  <span className="text-[10px] opacity-80 font-semibold">{s.priceEstimate} • Expect: {s.duration}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive scanning info desk */}
                        <div className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-xl text-center">
                          <Sparkles className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                          <h4 className="text-xs font-bold text-indigo-950">Intelligent Sandbox OCR Prefiller</h4>
                          <p className="text-[11px] text-indigo-750 mt-1 mb-3 leading-normal">
                            Test auto-populating complex student forms with simulated registry records. Click any scan below:
                          </p>
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => handleTriggerOcr("nin")}
                              className="w-full bg-white border border-indigo-200 hover:border-indigo-400 text-[10px] font-bold text-indigo-900 py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Simulate NIN card scan
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTriggerOcr("waec")}
                              className="w-full bg-white border border-indigo-200 hover:border-indigo-400 text-[10px] font-bold text-indigo-900 py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Simulate WAEC document scan
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Customized dynamic inputs Form (Cols 8) */}
                      <div className="lg:col-span-8">
                        {selectedService ? (
                          <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <span className="text-[9px] uppercase font-mono font-extrabold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-100">
                                  Offline-to-Online Automated Filings
                                </span>
                                <h3 className="text-lg font-bold text-gray-950 mt-1">{selectedService.name} Form</h3>
                                <p className="text-xs text-gray-500 mt-1">{selectedService.description}</p>
                              </div>

                              <div className="bg-gray-50 border border-gray-150 p-2.5.5 rounded-xl text-right shrink-0 min-w-[120px]">
                                <div className="text-[8px] uppercase font-mono tracking-wider text-gray-400 font-extrabold">Price Rate</div>
                                <div className="text-sm font-extrabold text-gray-950">{selectedService.priceEstimate}</div>
                                <div className="text-[10px] text-[#00C853] font-mono mt-0.5">⏱ Expected: {selectedService.duration}</div>
                              </div>
                            </div>

                            {/* Actual HTML dynamic Form */}
                            <form onSubmit={handleSubmitOrder} className="space-y-5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedService.formFields.map((field) => {
                                  if (field.type === "file") return null; // Handled below in drag-drop zone

                                  return (
                                    <div 
                                      key={field.name}
                                      className={`flex flex-col gap-1.5 ${
                                        field.type === "textarea" ? "md:col-span-2" : ""
                                      }`}
                                    >
                                      <label className="text-xs font-bold text-gray-800">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                                      </label>

                                      {field.type === "select" ? (
                                        <select
                                          value={formData[field.name] || ""}
                                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                                          required={field.required}
                                          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:border-[#00C853] outline-none shadow-sm"
                                        >
                                          <option value="">Select standard options...</option>
                                          {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                      ) : field.type === "textarea" ? (
                                        <textarea
                                          value={formData[field.name] || ""}
                                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                                          required={field.required}
                                          placeholder={field.placeholder}
                                          rows={4}
                                          className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:border-[#00C853] outline-none shadow-sm"
                                        />
                                      ) : (
                                        <input
                                          type={field.type}
                                          value={formData[field.name] || ""}
                                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                                          required={field.required}
                                          placeholder={field.placeholder}
                                          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:border-[#00C853] outline-none shadow-sm"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Document file uploader area */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-gray-800">
                                  Supporting Credentials File Attachments <span className="text-red-500">*</span>
                                </label>

                                <div
                                  onDragEnter={handleDrag}
                                  onDragOver={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDrop={handleDrop}
                                  className={`border-2 border-dashed rounded-2xl p-6 bg-gray-50 hover:bg-gray-100/70 text-center transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                                    dragActive ? "border-[#00C853] bg-emerald-500/5" : "border-gray-200"
                                  }`}
                                >
                                  <input
                                    type="file"
                                    multiple
                                    onChange={handleFileInput}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    title="File upload element"
                                  />
                                  <Upload className="w-7 h-7 text-[#00C853] mb-2" />
                                  <p className="text-xs font-extrabold text-gray-800">Drag or click to choose validation documents</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">Supports PDF scans, PNG images or statement logs</p>
                                </div>

                                {/* Active Uploaded files mapping */}
                                {uploadedFiles.length > 0 && (
                                  <div className="space-y-1.5 mt-2">
                                    {uploadedFiles.map((file, i) => (
                                      <div key={i} className="bg-gray-100 border border-gray-200 rounded-xl p-2 px-3 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 truncate">
                                          <FileText className="w-4 h-4 text-[#00C853] shrink-0" />
                                          <span className="font-semibold text-gray-900 truncate">{file.name}</span>
                                          <span className="text-[9px] text-gray-450 font-mono">({file.size})</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeFile(i)}
                                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Fee deduction notice banner */}
                              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 text-emerald-950 text-xs leading-normal">
                                <Wallet className="w-5 h-5 text-[#00C853] shrink-0 mt-0.5 animate-pulse" />
                                <div>
                                  <span className="font-bold block">Secure Sandbox Debit Checkout</span>
                                  Settle exactly <strong className="font-extrabold">₦{getNumericCost(selectedService.priceEstimate).toLocaleString()}</strong> directly from your available student wallet balance.
                                </div>
                              </div>

                              <button
                                type="submit"
                                className="w-full bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00C853]/20 cursor-pointer"
                              >
                                <ClipboardCheck className="w-5 h-5" />
                                Settle Payment & File Request
                              </button>
                            </form>
                          </div>
                        ) : (
                          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
                            <HelpCircle className="w-12 h-12 text-gray-200 mx-auto" />
                            <p className="text-xs text-gray-500 mt-3 font-bold">Select any sub-service list to populate entry parameters.</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* Tracking order progress panel (Step 7) */}
                {dashboardTab === "track" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 animate-fadeIn">
                    
                    {/* Orders listing checklist sidebar (Cols 5) */}
                    <div className="lg:col-span-5 bg-white border border-gray-150 rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h3 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest">
                          Historical Requests Inbox ({orders.length})
                        </h3>
                        <span className="text-[9.5px] bg-[#00C853]/10 text-emerald-800 font-extrabold font-mono px-2 py-0.5 rounded">Real-time</span>
                      </div>

                      {orders.length > 0 ? (
                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                          {orders.map((o) => {
                            const isChosen = selectedOrder?.id === o.id;
                            const statusInfo = getOrderStatusInfo(o.status);

                            return (
                              <button
                                key={o.id}
                                onClick={() => setSelectedOrder(o)}
                                className={`w-full p-4 rounded-xl text-left border transition-all flex flex-col gap-2 cursor-pointer ${
                                  isChosen 
                                    ? "bg-slate-50 border-[#00C853] shadow-sm font-semibold"
                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-[10px] font-bold font-mono text-gray-400">#{o.trackingId}</div>
                                    <div className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{o.serviceName}</div>
                                  </div>
                                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 mt-1.5 pt-2">
                                  <span>📅 {o.submittedAt.split(",")[0]}</span>
                                  <span className="font-semibold text-gray-700">Ref: {o.files?.[0]?.name || "Attached Papers"}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                          <p className="text-xs text-gray-400 font-bold">No registered request history files found.</p>
                        </div>
                      )}
                    </div>

                    {/* Active Order Details and Download Center (Cols 7 & Step 8) */}
                    <div className="lg:col-span-7">
                      {selectedOrder ? (
                        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
                          
                          {/* Banner Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-4">
                            <div>
                              <span className="text-xs font-extrabold text-[#00C853] font-mono">CODE: #{selectedOrder.trackingId}</span>
                              <h3 className="font-extrabold text-lg text-gray-900 mt-0.5">{selectedOrder.serviceName}</h3>
                              <p className="text-[10px] font-mono text-gray-400 mt-0.5">Order Ref ID: {selectedOrder.id} • Registered: {selectedOrder.submittedAt}</p>
                            </div>

                            <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${getOrderStatusInfo(selectedOrder.status).color}`}>
                              {getOrderStatusInfo(selectedOrder.status).label}
                            </span>
                          </div>

                          {/* Step 8: Download Center Integration */}
                          {selectedOrder.status === "Completed" ? (
                            <div className="bg-gradient-to-r from-emerald-555 to-green-600 text-white p-5 rounded-2xl shadow shadow-emerald-700/10 flex items-center gap-4">
                              <div className="p-3 bg-white/20 rounded-xl shrink-0">
                                <Download className="w-6 h-6 text-white animate-bounce" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-extrabold">Completed Document Ready!</h4>
                                <p className="text-[11px] text-emerald-100 mt-1">
                                  Your completed credential file "<strong>{selectedOrder.completedDocName || (selectedOrder.serviceName.replace(/\s+/g, "_") + "_Official")}.pdf</strong>" is officially certified and compiled. Click below to extract.
                                </p>
                                <button
                                  onClick={() => handleDownloadCompletedFile(selectedOrder)}
                                  className="mt-3 bg-white hover:bg-gray-55 text-emerald-950 font-extrabold text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow cursor-pointer"
                                >
                                  <Download className="w-4 h-4" />
                                  Download Now
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Non-completed info block */
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-gray-650">
                              <Info className="w-4.5 h-4.5 text-slate-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-gray-900 block">Documents Under Registry Audit</span>
                                Our liaison desk has successfully queued your verification file papers. If updates require correction checks, our physical administrative desks will schedule modifications.
                              </div>
                            </div>
                          )}

                          {/* Step 6: Explicit WhatsApp backup dispatch tool */}
                          <div className="bg-emerald-500/5 border border-emerald-150 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                              <MessageSquare className="w-5 h-5 text-[#00C853] shrink-0" />
                              <div className="text-xs">
                                <p className="font-extrabold text-emerald-950">WhatsApp Verification Link</p>
                                <p className="text-[10px] text-emerald-800">Transmit file codes directly to the MYSOLUTION Desk for dispatch.</p>
                              </div>
                            </div>
                            <a
                              href={getWhatsAppLink(selectedOrder)}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold text-[10px] px-4 py-2.5 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer shadow-sm text-center"
                            >
                              Forward to Desk
                            </a>
                          </div>

                          {/* Visual Step Tracker Pipeline */}
                          <div>
                            <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mb-4">Registry Progress Pipeline</h4>
                            
                            <div className="relative pl-6 space-y-5">
                              {/* Connector line */}
                              <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-gray-200"></div>

                              {/* Status 1 */}
                              <div className="relative flex items-start gap-3">
                                <div className="absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white bg-emerald-500 shadow-sm"></div>
                                <div>
                                  <p className="text-xs font-extrabold text-gray-900">Request Checked In</p>
                                  <p className="text-[10px] text-gray-400">Order successfully registered in database. Unique tracker reference created.</p>
                                </div>
                              </div>

                              {/* Status 2 */}
                              <div className="relative flex items-start gap-3">
                                <div className={`absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${
                                  ["Under Review", "Processing", "Completed"].includes(selectedOrder.status) ? "bg-emerald-500" : "bg-gray-300"
                                }`}></div>
                                <div>
                                  <p className={`text-xs font-bold ${
                                    ["Under Review", "Processing", "Completed"].includes(selectedOrder.status) ? "text-gray-900 font-extrabold" : "text-gray-400"
                                  }`}>Under Verification Review</p>
                                  <p className="text-[10px] text-gray-400">Document parameters and NIN validation logs are checked against government nodes.</p>
                                </div>
                              </div>

                              {/* Status 3 */}
                              <div className="relative flex items-start gap-3">
                                <div className={`absolute -left-[24px] top-1 w-[15px h-[15px] rounded-full border-2 border-white shadow-sm ${
                                  ["Processing", "Completed"].includes(selectedOrder.status) ? "bg-[#00C853]" : "bg-gray-300"
                                }`}></div>
                                <div>
                                  <p className={`text-xs font-bold ${
                                    ["Processing", "Completed"].includes(selectedOrder.status) ? "text-gray-900 font-extrabold" : "text-gray-400"
                                  }`}>Processing Request</p>
                                  <p className="text-[10px] text-gray-400">MYSOLUTION Liaison agents perform physically scheduled corrections if applicable.</p>
                                </div>
                              </div>

                              {/* Status 4 */}
                              <div className="relative flex items-start gap-3">
                                <div className={`absolute -left-[24px] top-1 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm ${
                                  selectedOrder.status === "Completed" ? "bg-[#00C853]" : "bg-gray-300"
                                }`}></div>
                                <div>
                                  <p className={`text-xs font-bold ${
                                    selectedOrder.status === "Completed" ? "text-gray-900 font-extrabold" : "text-gray-400"
                                  }`}>Dispatch Ready</p>
                                  <p className="text-[10px] text-gray-400">Final corrected documents, slips or check cards resolved and available for download.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Display of submitted entries */}
                          <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2.5">Your Submitted Variables Data</h4>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-xs text-slate-800 border border-gray-150/45">
                              {Object.entries(selectedOrder.formData).map(([k, v]) => (
                                <div key={k}>
                                  <span className="text-[8.5px] uppercase font-bold text-gray-400 block trailing-none">{k.replace(/([A-Z])/g, " $1")}</span>
                                  <span className="font-extrabold text-gray-800 mt-0.5 block whitespace-pre-wrap">{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
                          <ListFilter className="w-12 h-12 text-gray-200 mx-auto" />
                          <p className="text-xs text-gray-500 mt-3 font-bold">Pick any history tab item on the left to review processing variables.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Naira funding wallet board tab (Step 4) */}
                {dashboardTab === "wallet" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 animate-fadeIn">
                    
                    {/* Available balance presentation card (Cols 5) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-gray-905 to-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[250px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C853]/15 rounded-full blur-2xl pointer-events-none"></div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase font-mono bg-white/10 px-2 py-0.5 rounded text-[#00C853] font-extrabold tracking-wider">
                            Moniepoint Sandbox Node
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-ping"></span>
                        </div>

                        <div className="mt-8">
                          <span className="text-gray-400 text-xs font-bold leading-none block">Naira Wallet Cash Balance</span>
                          <h3 className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">₦{currentUser.walletBalance.toLocaleString()}</h3>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4 mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                        <div>
                          <span>Account Username</span>
                          <span className="font-extrabold text-white block mt-0.5 max-w-[150px] truncate">{currentUser.fullName}</span>
                        </div>
                        <div className="text-right">
                          <span>User Signature ID</span>
                          <span className="font-extrabold text-white block mt-0.5 truncate">{currentUser.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Funding controllers panel (Cols 7) */}
                    <div className="lg:col-span-7 bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                        <Wallet className="w-4.5 h-4.5 text-[#00C853]" />
                        Replenish Available Wallet Balance
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 mb-5">
                        Deposits settle immediately for sandbox testing. Select any amount voucher below to complete deposits.
                      </p>

                      {/* Voucher presets */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["2000", "5000", "10000", "15000", "25000", "50000"].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => {
                              setFundAmount(preset);
                              setCustomFundAmount("");
                            }}
                            className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              fundAmount === preset && !customFundAmount
                                ? "bg-[#00C853] text-white border-[#00C853]"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            ₦{parseInt(preset).toLocaleString()}
                          </button>
                        ))}

                        <div className="relative inline-flex items-center">
                          <span className="absolute left-3.5 text-xs text-gray-500 font-extrabold">₦</span>
                          <input
                            type="number"
                            placeholder="Custom"
                            value={customFundAmount}
                            onChange={(e) => {
                              setCustomFundAmount(e.target.value);
                              setFundAmount("");
                            }}
                            className="bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 w-28 text-xs font-bold focus:border-[#00C853] outline-none"
                          />
                        </div>
                      </div>

                      {/* Payment switch buttons */}
                      <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 mb-5">
                        <button
                          onClick={() => setFundingType("transfer")}
                          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            fundingType === "transfer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                          }`}
                        >
                          <Landmark className="w-4 h-4" />
                          Bank Transfer Settle
                        </button>
                        <button
                          onClick={() => setFundingType("card")}
                          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            fundingType === "card" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          Debit Card Settle
                        </button>
                      </div>

                      {isFundingProcessing ? (
                        <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl text-center space-y-2">
                          <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <h4 className="text-xs font-bold text-gray-800">{fundingMessage}</h4>
                        </div>
                      ) : fundingType === "transfer" ? (
                        /* Direct bank transfer mockup segment */
                        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-4 text-xs">
                          <div className="flex justify-between items-center text-[10px] font-mono text-[#00C853] font-bold">
                            <span>MONIEPOINT GATEWAY LINK</span>
                            <span>SANDBOX SIMULATION ACTIVE</span>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-gray-200 grid grid-cols-2 gap-3 leading-relaxed">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-gray-400">Recipient Bank</span>
                              <p className="font-extrabold text-gray-900">Moniepoint Microfinance MFB</p>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-gray-400">Deposit Account</span>
                              <p className="font-extrabold text-gray-900 font-mono">8209 1122 334</p>
                            </div>
                            <div className="col-span-2 border-t border-gray-100 pt-2">
                              <span className="text-[9px] uppercase font-bold text-gray-400">Account Beneficiary</span>
                              <p className="font-extrabold text-gray-900">MYSOLUTION HUB SANDBOX DESK</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const amt = parseFloat(fundAmount || customFundAmount || "0");
                              if (amt <= 0) {
                                alert("Specify a valid deposit credit amount above ₦0");
                                return;
                              }

                              setIsFundingProcessing(true);
                              setFundingMessage("Attaching sandbox ledger connections...");
                              
                              setTimeout(() => {
                                setFundingMessage("Verifying credit payload transfer signatures...");
                              }, 1000);

                              setTimeout(() => {
                                const newLogsCredit: WalletTransaction = {
                                  id: `TX-CREDIT-${Date.now().toString().slice(-6)}`,
                                  type: "credit",
                                  amount: amt,
                                  description: "Deposit Cash Settle (Direct Settle)",
                                  date: new Date().toLocaleString()
                                };

                                const updatedUser = {
                                  ...currentUser,
                                  walletBalance: currentUser.walletBalance + amt,
                                  transactions: [newLogsCredit, ...currentUser.transactions]
                                };
                                updateUserProfileState(updatedUser);
                                setIsFundingProcessing(false);
                                alert(`🎉 Settle Success! Credited ₦${amt.toLocaleString()} to your available balance wallet.`);
                                setCustomFundAmount("");
                              }, 2000);
                            }}
                            className="w-full bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold py-3 rounded-xl transition-all shadow cursor-pointer text-center"
                          >
                            Verify Settle Transfer Credit (₦{parseFloat(fundAmount || customFundAmount || "0").toLocaleString()})
                          </button>
                        </div>
                      ) : (
                        /* Direct Credit Card simulator */
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4.5 rounded-xl text-white font-mono space-y-4 relative overflow-hidden">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-[#00C853] leading-none">MYSOLUTION PAY GATEWAY</span>
                              <div className="w-8 h-6 bg-gradient-to-r from-amber-300 to-amber-500 rounded"></div>
                            </div>
                            <div className="text-sm tracking-widest py-1">
                              {cardNumber ? cardNumber.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-300">
                              <div>
                                <span>CARD HOLDER</span>
                                <p className="font-extrabold uppercase text-white mt-0.5">{currentUser.fullName}</p>
                              </div>
                              <div className="flex gap-4">
                                <div>
                                  <span>EXPIRY</span>
                                  <p className="font-extrabold text-white mt-0.5">{cardExpiry || "MM/YY"}</p>
                                </div>
                                <div>
                                  <span>CVV</span>
                                  <p className="font-extrabold text-white mt-0.5">{cardCvv ? "•••" : "000"}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-3 flex flex-col gap-1">
                              <label className="text-[10px] font-extrabold text-gray-700 uppercase">Input Mock Card Digit</label>
                              <input
                                type="text"
                                maxLength={16}
                                placeholder="5061023948123910"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#00C853] outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-extrabold text-gray-700 uppercase">Expiry</label>
                              <input
                                type="text"
                                maxLength={5}
                                placeholder="11/29"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-center focus:border-[#00C853] outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-extrabold text-gray-700 uppercase">CVV Code</label>
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="•••"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-center focus:border-[#00C853] outline-none"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setCardNumber("5399831920381923");
                                  setCardExpiry("11/29");
                                  setCardCvv("538");
                                }}
                                className="w-full bg-gray-150 hover:bg-gray-200 text-gray-705 font-bold text-[10px] py-3 rounded-xl transition-all cursor-pointer"
                              >
                                Autofill Creds
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const amt = parseFloat(fundAmount || customFundAmount || "0");
                              if (amt <= 0) {
                                alert("Specify a valid credit deposit amount");
                                return;
                              }
                              if (!cardNumber || !cardExpiry || !cardCvv) {
                                alert("Complete mock credit card fields first.");
                                return;
                              }

                              setIsFundingProcessing(true);
                              setFundingMessage("3D Secure transaction handshake pinging...");

                              setTimeout(() => {
                                const newLogsCredit: WalletTransaction = {
                                  id: `TX-CREDIT-CARD-${Date.now().toString().slice(-6)}`,
                                  type: "credit",
                                  amount: amt,
                                  description: `Card Funding checkout (Ending *${cardNumber.slice(-4)})`,
                                  date: new Date().toLocaleString()
                                };

                                const updatedUser = {
                                  ...currentUser,
                                  walletBalance: currentUser.walletBalance + amt,
                                  transactions: [newLogsCredit, ...currentUser.transactions]
                                };
                                updateUserProfileState(updatedUser);
                                setIsFundingProcessing(false);
                                alert(`🎉 Card Deposit Confirmed! Credited ₦${amt.toLocaleString()} to your wallet.`);
                                setCardNumber("");
                                setCardExpiry("");
                                setCardCvv("");
                                setCustomFundAmount("");
                              }, 1800);
                            }}
                            className="w-full bg-gray-950 hover:bg-black text-white font-extrabold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                          >
                            <CreditCard className="w-4 h-4 text-emerald-400" />
                            Secure Card Deposit (₦{parseFloat(fundAmount || customFundAmount || "0").toLocaleString()})
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Historical ledger card below */}
                    <div className="lg:col-span-12 bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                      <h4 className="text-xs font-extrabold font-mono text-gray-400 uppercase tracking-widest mb-4">
                        Wallet Activity Statement Histories
                      </h4>

                      {currentUser.transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-gray-100 text-[10px] uppercase font-mono text-gray-400 font-extrabold">
                                <th className="py-2 pb-3 font-semibold">Reference ID</th>
                                <th className="py-2 pb-3 font-semibold">Activity Name</th>
                                <th className="py-2 pb-3 font-semibold">Timestamp</th>
                                <th className="py-2 pb-3 font-semibold">Sandbox Agent</th>
                                <th className="py-2 pb-3 font-semibold text-right">Adjustment Credit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                              {currentUser.transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-55/60 text-gray-700">
                                  <td className="py-3 font-mono text-[10px] text-gray-400 uppercase">{tx.id}</td>
                                  <td className="py-3 font-extrabold text-gray-900">{tx.description}</td>
                                  <td className="py-3 text-[11px] text-gray-450">{tx.date}</td>
                                  <td className="py-3">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                                      ● Completed
                                    </span>
                                  </td>
                                  <td className={`py-3 text-right font-extrabold text-xs ${
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
                        <p className="text-center py-6 text-xs text-gray-400">No transactions recorded on this sandbox wallet node.</p>
                      )}
                    </div>

                  </div>
                )}

              </>
            )}

          </div>
        )}

        {/* ==================== ADMINISTRATIVE CONSOLE SYSTEM (Step 9) ==================== */}
        {roleMode === "admin" && (
          <div className="mt-6 space-y-6 animate-fadeIn" id="admin-viewspace">
            
            {/* Admin top menu tabs bar */}
            <div className="bg-white border border-gray-150 p-1 rounded-2xl flex flex-wrap items-center gap-1 shadow-sm">
              <button
                onClick={() => setAdminTab("stats")}
                className={`px-4.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === "stats" ? "bg-gray-900 text-white" : "text-gray-650 hover:bg-gray-55"
                }`}
              >
                <BarChart2 className="w-4 h-4 text-emerald-500" />
                Revenue Stats & Insights
              </button>
              <button
                onClick={() => setAdminTab("services")}
                className={`px-4.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === "services" ? "bg-gray-900 text-white" : "text-gray-650 hover:bg-gray-55"
                }`}
              >
                <Database className="w-4 h-4 text-blue-500" />
                Set Prices & Services
              </button>
              <button
                onClick={() => setAdminTab("orders")}
                className={`px-4.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                  adminTab === "orders" ? "bg-gray-900 text-white" : "text-gray-650 hover:bg-gray-55"
                }`}
              >
                <Clock className="w-4 h-4 text-amber-500" />
                Manage Requests Tickets
                {pendingTicketsCount > 0 && (
                  <span className="bg-amber-500 text-white text-[9px] px-1.5 rounded-full font-bold">
                    {pendingTicketsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setAdminTab("users")}
                className={`px-4.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === "users" ? "bg-gray-900 text-white" : "text-gray-650 hover:bg-gray-55"
                }`}
              >
                <User className="w-4 h-4 text-purple-500" />
                Manage Client Accounts
              </button>
              <button
                onClick={() => setAdminTab("transactions")}
                className={`px-4.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  adminTab === "transactions" ? "bg-gray-900 text-white" : "text-gray-650 hover:bg-gray-55"
                }`}
              >
                <History className="w-4 h-4 text-[#00C853]" />
                System Ledger
              </button>
            </div>

            {/* Sub-section 1: Revenue Statistics & Reports */}
            {adminTab === "stats" && (
              <div className="space-y-6">
                
                {/* 4 Admin Quick Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#00C853] font-bold">Gross System Sales</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-2">₦{totalRevenueCollected.toLocaleString()}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Total value paid from student wallets</p>
                  </div>
                  <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-600 font-bold">Wallet Deposits Funded</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-2">₦{totalWalletDeposits.toLocaleString()}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Total funded via sandbox transfer/card</p>
                  </div>
                  <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-amber-600 font-bold">Active Processing Tasks</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{pendingTicketsCount} Tickets</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Awaiting status modifications or prints</p>
                  </div>
                  <div className="bg-white border border-gray-150 p-5 rounded-3xl shadow-sm">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-600 font-bold">Completed Desk Deliveries</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-2">{completedTicketsCount} Files</h3>
                    <p className="text-[10px] text-emerald-600 font-extrabold mt-1">✓ {orders.length > 0 ? Math.round((completedTicketsCount / orders.length) * 100) : 0}% Completion rating</p>
                  </div>
                </div>

                {/* Styled visual bar chart representing category performance */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-950">Category Sales Weights Distribution</h4>
                      <p className="text-[11px] text-gray-500">Relative volume index based on active tickets database.</p>
                    </div>
                    <button
                      onClick={() => {
                        const reportJSON = {
                          timestamp: new Date().toLocaleString(),
                          systemSales: totalRevenueCollected,
                          walletDeposits: totalWalletDeposits,
                          totalOrders: orders.length,
                          completedRatio: orders.length > 0 ? (completedTicketsCount / orders.length) : 0,
                          reportedVariables: "MYSOLUTION_CORE_MARKETPLACE"
                        };
                        const blob = new Blob([JSON.stringify(reportJSON, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `MYS_REVENUE_REPORT_${Date.now()}.json`;
                        link.click();
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Financial Report (JSON)
                    </button>
                  </div>

                  {/* High fidelity interactive grid charts */}
                  <div className="space-y-4">
                    {CATEGORIES.map((cat) => {
                      const catOrdersCount = orders.filter((o) => o.category === cat.id).length;
                      const ratioPercent = orders.length > 0 ? (catOrdersCount / orders.length) * 100 : 20;

                      return (
                        <div key={cat.id} className="text-xs">
                          <div className="flex justify-between text-gray-700 font-semibold mb-1">
                            <span>{cat.name} ({cat.description.slice(0,40)}...)</span>
                            <span className="font-extrabold">{catOrdersCount} Requests ({Math.round(ratioPercent)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#00C853] h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(ratioPercent, 4)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Sub-section 2: Add/Edit/Delete Services and Prices */}
            {adminTab === "services" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Add Service dynamic parameters builder drawer card (Cols 5) */}
                <div className="lg:col-span-5 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1">
                      <Plus className="w-4 h-4 text-emerald-500" />
                      Add a Custom Service
                    </h3>
                    <button
                      onClick={() => setIsAddingService(!isAddingService)}
                      className="text-[10px] text-gray-500 hover:underline border px-2 py-0.5 rounded"
                    >
                      {isAddingService ? "Collapse" : "Open Module"}
                    </button>
                  </div>

                  <form onSubmit={handleAdminAddService} className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Service Title Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. WAEC Original Result Printing"
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 mt-1 focus:border-[#00C853] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Category</label>
                          <select
                            value={newServiceCategory}
                            onChange={(e) => setNewServiceCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800 mt-1 focus:border-[#00C853] outline-none"
                          >
                            {CATEGORIES.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Price Rate (e.g. ₦4,500)</label>
                          <input
                            type="text"
                            required
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 mt-1 focus:border-[#00C853] outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-700 uppercase">Expected Duration</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1 - 2 Business Days"
                            value={newServiceDuration}
                            onChange={(e) => setNewServiceDuration(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 mt-1 focus:border-[#00C853] outline-none"
                          />
                        </div>
                        <div className="flex flex-col justify-end">
                          <span className="text-[9px] text-gray-450 leading-relaxed">Changes persist inside client directories automatically.</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Description</label>
                        <textarea
                          required
                          placeholder="Brief explanation of registration and file needs..."
                          value={newServiceDescription}
                          onChange={(e) => setNewServiceDescription(e.target.value)}
                          rows={2}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 mt-1 focus:border-[#00C853] outline-none"
                        />
                      </div>
                    </div>

                    {/* Service Dynamic Field Builder */}
                    <div className="border-t border-gray-150 pt-3 mt-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-extrabold block mb-2">
                        Dynamic Form Fields Setup ({newServiceFields.length})
                      </span>

                      <div className="bg-gray-50 p-3 rounded-xl space-y-2.5 border border-gray-200">
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <input
                            type="text"
                            placeholder="Field Label (e.g. Proposed Name)"
                            value={fieldBuilderLabel}
                            onChange={(e) => setFieldBuilderLabel(e.target.value)}
                            className="bg-white border px-2.5 py-1.5 rounded-lg text-[10px] outline-none"
                          />
                          <select
                            value={fieldBuilderType}
                            onChange={(e) => setFieldBuilderType(e.target.value as any)}
                            className="bg-white border px-1.5 py-1.5 rounded-lg text-[10px] outline-none"
                          >
                            <option value="text">Single Line Text</option>
                            <option value="number">Number Digit</option>
                            <option value="textarea">Paragraph Box</option>
                            <option value="date">Date picker</option>
                            <option value="select">Dropdown list Selector</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-650 flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={fieldBuilderRequired}
                              onChange={(e) => setFieldBuilderRequired(e.target.checked)}
                            />
                            Required input?
                          </label>

                          <button
                            type="button"
                            onClick={handleAddFieldBuilder}
                            className="bg-gray-900 text-white font-extrabold text-[9px] px-3 py-1 rounded cursor-pointer"
                          >
                            + Incorporate Field
                          </button>
                        </div>

                        {/* List current added fields */}
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-200/50">
                          {newServiceFields.map((f, i) => (
                            <span key={i} className="bg-white border text-[9.5px] px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                              {f.label} ({f.type})
                              <button
                                type="button"
                                onClick={() => setNewServiceFields(prev => prev.filter((_, idx) => idx !== i))}
                                className="text-red-500 font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-black text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow cursor-pointer text-center"
                    >
                      Save Service to Menu
                    </button>
                  </form>
                </div>

                {/* Editable price list catalog datatable (Cols 7) */}
                <div className="lg:col-span-7 bg-white border border-[#00C853]/15 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 mb-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-950">Active Services catalog Directory</h3>
                      <p className="text-[10px] text-gray-500">Edit prices in-place or manage platform services.</p>
                    </div>
                  </div>

                  <div className="max-h-[500px] overflow-y-auto pr-1">
                    <table className="w-full text-left text-xs text-gray-750">
                      <thead>
                        <tr className="border-b border-gray-100 text-[9px] uppercase font-mono text-gray-400 font-extrabold">
                          <th className="py-2.5">Registry Service Name</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Adjust Rate / Price</th>
                          <th className="py-2.5 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {services.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/70 text-gray-800">
                            <td className="py-3 font-extrabold text-gray-950 truncate max-w-[170px]">{item.name}</td>
                            <td className="py-3 text-[10px] text-gray-500">
                              {CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                            </td>
                            <td className="py-3">
                              <input
                                type="text"
                                value={item.priceEstimate}
                                onChange={(e) => {
                                  // Update services array in-place
                                  const updated = services.map(s => s.id === item.id ? { ...s, priceEstimate: e.target.value } : s);
                                  saveServices(updated);
                                }}
                                className="w-20 bg-gray-105 border border-gray-200 rounded px-1.5 py-1 text-[11.5px] font-extrabold text-gray-900 outline-none focus:border-[#00C853] font-mono"
                              />
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the "${item.name}" service? This is irreversible.`)) {
                                    const updated = services.filter(s => s.id !== item.id);
                                    saveServices(updated);
                                  }
                                }}
                                className="text-red-550 hover:text-red-800 hover:bg-red-50 p-1 rounded"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-section 3: Manage Request Tickets & Completed Document Upload */}
            {adminTab === "orders" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Orders table overview (Cols 6) */}
                <div className="lg:col-span-6 bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
                  <h3 className="font-extrabold text-sm text-gray-950 mb-3.5">Active Client Service Requests ({orders.length})</h3>
                  
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {orders.map((o) => {
                      const isSelected = adminSelectedOrder?.id === o.id;
                      const statusInfo = getOrderStatusInfo(o.status);

                      return (
                        <button
                          key={o.id}
                          onClick={() => setAdminSelectedOrder(o)}
                          className={`w-full p-4 rounded-xl text-left border transition-all flex flex-col gap-2 cursor-pointer ${
                            isSelected ? "bg-slate-50 border-gray-900 shadow-sm" : "bg-white border-gray-150 hover:bg-gray-55/50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold font-mono text-gray-400">Order ID: #{o.trackingId}</span>
                              <h4 className="text-xs font-extrabold text-gray-950 leading-tight mt-0.5">{o.serviceName}</h4>
                            </div>
                            <span className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-100 pt-2 networks mt-1">
                            <span>📅 {o.submittedAt}</span>
                            <span className="text-gray-650 font-bold">Files: {o.files?.length || 1} attached</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ticket dynamic inspect & state changer with Document Upload (Cols 6) */}
                <div className="lg:col-span-6 space-y-6">
                  {adminSelectedOrder ? (
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5">
                      
                      {/* Header block details */}
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                        <div>
                          <span className="text-xs font-mono font-semibold text-emerald-800">#{adminSelectedOrder.trackingId}</span>
                          <h3 className="font-extrabold text-base text-gray-950 mt-0.5">{adminSelectedOrder.serviceName}</h3>
                          <p className="text-[10px] text-gray-400">Ref: {adminSelectedOrder.id}</p>
                        </div>

                        <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-lg ${getOrderStatusInfo(adminSelectedOrder.status).color}`}>
                          {getOrderStatusInfo(adminSelectedOrder.status).label}
                        </span>
                      </div>

                      {/* Dynamic form responses table checklist */}
                      <div className="space-y-2 text-xs">
                        <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-gray-400 block">Submitted parameters Data</span>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
                          {Object.entries(adminSelectedOrder.formData).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-[8.5px] uppercase font-bold text-gray-400 block trailing-none">{k.replace(/([A-Z])/g, " $1")}</span>
                              <span className="font-extrabold text-gray-900 mt-0.5 block whitespace-pre-wrap">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Upload Completed Document PDF block - enabling Step 8 & Step 9 */}
                      <div className="bg-gray-905 text-white p-5 rounded-2xl shadow space-y-3.5">
                        <h4 className="text-xs font-bold text-[#00C853] uppercase font-mono flex items-center gap-1">
                          <FileCheck className="w-4 h-4" />
                          Resolve & Upload Completed Document
                        </h4>
                        <p className="text-[10px] text-gray-300 leading-relaxed">
                          When this verification is solved successfully, attach the certified PDF completed file (or name simulation) for the client's direct "Download Now" dashboard button.
                        </p>

                        <div className="space-y-2 text-xs text-gray-900">
                          <input
                            type="text"
                            placeholder="File Name (e.g. Birth_Certificate_Verified.pdf)"
                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs outline-none"
                            id="admin-completing-doc-input"
                            defaultValue={adminSelectedOrder.completedDocName || (adminSelectedOrder.serviceName.replace(/\s+/g, "_") + "_Official_Verification.pdf")}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const inputEl = document.getElementById("admin-completing-doc-input") as HTMLInputElement;
                              const docName = inputEl?.value?.trim() || (adminSelectedOrder.serviceName.replace(/\s+/g, "_") + "_Verified.pdf");

                              // Update status dynamically to Completed
                              const updatedOrders = orders.map((o) => {
                                if (o.id === adminSelectedOrder.id) {
                                  return { 
                                    ...o, 
                                    status: "Completed" as const, 
                                    completedDocName: docName,
                                    completedDocUrl: "text-file-representation-data-url-active-sandbox"
                                  };
                                }
                                return o;
                              });

                              setOrders(updatedOrders);
                              localStorage.setItem("mysolution_orders", JSON.stringify(updatedOrders));
                              setAdminSelectedOrder({
                                ...adminSelectedOrder,
                                status: "Completed",
                                completedDocName: docName,
                                completedDocUrl: "text-file-representation-data-url-active-sandbox"
                              });
                              alert(`🎉 Verification resolved successfully and document "${docName}" uploaded to client's download center!`);
                            }}
                            className="w-full bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold py-2.5 rounded-lg text-xs cursor-pointer text-center"
                          >
                            ✓ Upload Completed file & Set status "Completed"
                          </button>
                        </div>
                      </div>

                      {/* Status changer selector tool */}
                      <div className="border-t border-gray-150 pt-4 space-y-2">
                        <label className="text-[10px] font-bold text-gray-700 uppercase">Change Request status</label>
                        <div className="flex gap-2">
                          <select
                            value={adminSelectedOrder.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value as any;
                              const updated = orders.map((o) => o.id === adminSelectedOrder.id ? { ...o, status: nextStatus } : o);
                              setOrders(updated);
                              localStorage.setItem("mysolution_orders", JSON.stringify(updated));
                              setAdminSelectedOrder({ ...adminSelectedOrder, status: nextStatus });
                            }}
                            className="bg-white border text-xs rounded-lg px-3 py-1.5 focus:border-[#00C853] outline-none font-bold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <span className="text-[10px] text-gray-500 leading-normal self-center">Instantly syncs to custom dashboard view.</span>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center shadow-sm">
                      <HelpCircle className="w-10 h-10 text-gray-200 mx-auto" />
                      <p className="text-xs text-gray-500 mt-2 font-bold">Pick an order from the list on the left to resolve details.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-section 4: User Wallets Node Adjuster */}
            {adminTab === "users" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Registered users table checklist (Cols 6) */}
                <div className="lg:col-span-6 bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
                  <h3 className="font-extrabold text-sm text-gray-950 mb-3">MYSOLUTION HUB Accounts Node ({allUsers.length})</h3>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {allUsers.map((user) => {
                      const isPicked = adminSelectedUser?.id === user.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => setAdminSelectedUser(user)}
                          className={`w-full p-4 rounded-xl text-left border transition-all flex flex-col gap-1.5 cursor-pointer ${
                            isPicked ? "bg-slate-50 border-gray-950 shadow-sm" : "bg-white border-gray-150 hover:bg-gray-55/50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-gray-950">{user.fullName}</span>
                            <span className="text-xs font-mono font-bold text-gray-900">₦{user.walletBalance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-400">
                            <span>📧 {user.email}</span>
                            <span>📞 {user.phoneNumber}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settle Manual Credit Deposit Forms (Cols 6) */}
                <div className="lg:col-span-6">
                  {adminSelectedUser ? (
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-5">
                      
                      {/* Selected user ID */}
                      <div className="border-b border-gray-100 pb-3">
                        <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded">User Node Active</span>
                        <h3 className="font-extrabold text-base text-gray-950 mt-1">{adminSelectedUser.fullName}</h3>
                        <p className="text-[11px] text-gray-450 mt-0.5">Contact: {adminSelectedUser.email} • {adminSelectedUser.phoneNumber}</p>
                      </div>

                      {/* Current balance display */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-bold">Ledger Balance Wallet</span>
                        <span className="text-sm font-extrabold text-gray-950">₦{adminSelectedUser.walletBalance.toLocaleString()}</span>
                      </div>

                      {/* Manual funding ledger form input fields */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const amountEl = document.getElementById("admin-credit-amount-input") as HTMLInputElement;
                          const noteEl = document.getElementById("admin-credit-note-input") as HTMLInputElement;
                          
                          const amtVal = amountEl?.value || "10000";
                          const noteVal = noteEl?.value || "Cash Settle Adjustment Deposit";

                          handleAdminFundUserWallet(adminSelectedUser.id, amtVal, noteVal);
                          
                          // Reload state
                          const updatedUserObj = allUsers.find(u => u.id === adminSelectedUser.id);
                          if (updatedUserObj) {
                            setAdminSelectedUser({
                              ...updatedUserObj,
                              walletBalance: updatedUserObj.walletBalance + parseFloat(amtVal)
                            });
                          }
                          if (amountEl) amountEl.value = "";
                          if (noteEl) noteEl.value = "";
                        }} 
                        className="space-y-4"
                      >
                        <h4 className="text-xs font-bold text-gray-900 uppercase">Apply Direct Credit Deposit</h4>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-extrabold text-gray-700 uppercase">Amount (₦)</label>
                            <input
                              type="number"
                              required
                              id="admin-credit-amount-input"
                              placeholder="5000"
                              className="bg-white border rounded-xl px-2.5 py-2 outline-none focus:border-[#00C853]"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-extrabold text-gray-700 uppercase">Description / Note</label>
                            <input
                              type="text"
                              required
                              id="admin-credit-note-input"
                              placeholder="Direct Cash Topup"
                              className="bg-white border rounded-xl px-2.5 py-2 outline-none focus:border-[#00C853]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#00C853] hover:bg-[#00E676] text-white font-extrabold py-3 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-[#00C853]/15"
                        >
                          + Fund User Wallet Balance
                        </button>
                      </form>

                      {/* User's recent transaction logs */}
                      <div className="pt-4 border-t border-gray-150">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-450 font-bold block mb-2">User's recent ledger transactions</span>
                        {adminSelectedUser.transactions && adminSelectedUser.transactions.length > 0 ? (
                          <div className="space-y-2 max-h-[220px] overflow-y-auto">
                            {adminSelectedUser.transactions.map((tx, idx) => (
                              <div key={idx} className="bg-gray-50 border border-gray-200/50 p-2.5 rounded-lg flex justify-between text-xs items-center">
                                <div>
                                  <p className="font-extrabold text-gray-900 leading-tight">{tx.description}</p>
                                  <p className="text-[9.5px] text-gray-400 mt-0.5">{tx.date}</p>
                                </div>
                                <span className={`font-mono font-extrabold text-xs ${tx.type === "credit" ? "text-emerald-700" : "text-gray-900"}`}>
                                  {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-[11px] text-gray-400 py-4">No logged transactions found on this account.</p>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center shadow-sm">
                      <HelpCircle className="w-10 h-10 text-gray-200 mx-auto" />
                      <p className="text-xs text-gray-500 mt-2 font-bold">Pick an account from the left list to resolve direct credit deposits.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-section 5: Chronological platform ledger statements */}
            {adminTab === "transactions" && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-950">Secure Platform Ledger Operations</h3>
                    <p className="text-[10px] text-gray-500">Chronological list of credits, debits, user registrations, and system sandboxes.</p>
                  </div>
                  <span className="text-[10px] font-mono bg-gray-100 px-3 py-1 rounded text-gray-500">MYSOLUTION HUB Sandbox node</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700 leading-normal border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] uppercase font-mono tracking-widest text-gray-400 font-extrabold">
                        <th className="py-2 px-2">Account ID / User</th>
                        <th className="py-2 px-2">Adjust Description</th>
                        <th className="py-2 px-2">Created Timestamp</th>
                        <th className="py-2 px-2 text-right">Credit / Debit Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {allUsers.flatMap(u => (u.transactions || []).map(t => ({ ...t, user: u.fullName }))).map((tx, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 text-xs">
                          <td className="py-3 px-2 font-mono text-[10px] uppercase text-gray-400">
                            {tx.user}
                          </td>
                          <td className="py-3 px-2 font-bold text-gray-950">{tx.description}</td>
                          <td className="py-3 px-2 text-gray-400">{tx.date}</td>
                          <td className={`py-3 px-2 text-right font-extrabold ${tx.type === "credit" ? "text-emerald-700" : "text-gray-950"}`}>
                            {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
