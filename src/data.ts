import { Service, Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "educational_services",
    name: "Educational Services",
    description: "School applications, O'Level result uploads on Caps, admissions, transcripts & project consulting",
    iconName: "GraduationCap",
  },
  {
    id: "verification_service",
    name: "Verification Service",
    description: "NPC birth attestation, transcript verification/valuation, and security clearance reports",
    iconName: "ShieldCheck",
  },
  {
    id: "documentation_service",
    name: "Documentation Service",
    description: "Mass printing scan desks, ATS CV packages, cover letters, and legal court affidavits",
    iconName: "FileText",
  },
  {
    id: "registration_services",
    name: "Registration Services",
    description: "CAC business incorporation, TIN tax registration, SCUML licensing, driver's licenses, and passports",
    iconName: "ClipboardCopy",
  },
  {
    id: "modification_services",
    name: "Modification Services",
    description: "Correction of date of birth, name spelling updates, re-mobilization, and civil modification help",
    iconName: "RefreshCw",
  },
  {
    id: "exam_pin_services",
    name: "Exam PIN Services",
    description: "Buy WAEC result checker keys, NECO token keys, scratch cards, and airtime data bundles",
    iconName: "Key",
  },
];

export const SERVICES: Service[] = [
  // EDUCATION SERVICES
  {
    id: "jamb-services",
    name: "JAMB Services",
    category: "educational_services",
    priceEstimate: "₦6,700 - ₦8,500",
    duration: "1 - 2 Business Days",
    description: "Official JAMB registration, Profile code creation, UTME change of institution/course and result printing assistance.",
    formFields: [
      { name: "fullName", label: "Candidate's Full Name", type: "text", required: true, placeholder: "As written on your O'Level" },
      { name: "profileCode", label: "JAMB Profile Code (if generated)", type: "text", required: false, placeholder: "10-digit code" },
      { name: "phoneNumber", label: "Phone Number linked to NIN", type: "text", required: true, placeholder: "08012345678" },
      { name: "jambSpecs", label: "Choice of Course & Institution", type: "textarea", required: true, placeholder: "1st Choice, 2nd Choice & Course details" },
      { name: "documentUpload", label: "O'Level Result / Birth Certificate", type: "file", required: true }
    ]
  },

  {
    id: "exam-pin",
    name: "Examination PIN Purchase",
    category: "exam_pin_services",
    priceEstimate: "₦3,800 - ₦4,500",
    duration: "Instant (Within 5 Mins)",
    description: "Buy WAEC result checker PINs, NECO token keys, and NABTEB verification PINs delivered directly to your inbox.",
    formFields: [
      { name: "fullName", label: "Your Full Name", type: "text", required: true },
      { name: "emailAddress", label: "Email Address for Delivery", type: "text", required: true, placeholder: "you@example.com" },
      { name: "pinType", label: "PIN Needed", type: "select", required: true, options: ["WAEC Scratch Card PIN", "NECO Checker Token", "NABTEB PIN", "JAMB Direct Entry PIN"] },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "1" }
    ]
  },

  {
    id: "international-school",
    name: "International School Applications",
    category: "educational_services",
    priceEstimate: "₦15,000 - ₦40,000",
    duration: "5 - 7 Business Days",
    description: "Full counseling, application fee settlement, SOP uploads and admission processing for schools in UK, US, Canada & Europe.",
    formFields: [
      { name: "fullName", label: "Applicant's Full Name", type: "text", required: true },
      { name: "preferredCountry", label: "Target Country", type: "select", required: true, options: ["United Kingdom", "Canada", "United States", "Germany", "Australia", "Other"] },
      { name: "course", label: "Proposed Course of Study", type: "text", required: true, placeholder: "e.g. MSc Data Science" },
      { name: "documents", label: "Consolidated Academic Transcript", type: "file", required: true }
    ]
  },


  {
    id: "educational-services-section",
    name: "Educational Services",
    category: "educational_services",
    priceEstimate: "₦5,000 - ₦25,000",
    duration: "1 - 3 Business Days",
    description: "Comprehensive assistance with school applications, institution screening registrations, O'Level result uploads on CAPS, and change of course or institution on school portals.",
    formFields: [
      { name: "studentName", label: "Student Legal Full Name", type: "text", required: true, placeholder: "First Name, Middle Name, Last Name" },
      { name: "phoneNumber", label: "Contact Phone Number", type: "text", required: true, placeholder: "e.g., 08012345678" },
      { name: "educationalNeeds", label: "Specific Service Required", type: "select", required: true, options: ["O'Level Result Upload on JAMB CAPS", "Institutional Post-UTME Screening", "Change of Course / Institution Assist", "Transcript Processing & Verification", "School Admission Consulting"] },
      { name: "details", label: "Institution & Course Details", type: "textarea", required: true, placeholder: "Describe the specific school, level, year, and course involved..." },
      { name: "academicCredentials", label: "Academic Credentials (e.g. O'Level/UTME result/Admission letter in PDF)", type: "file", required: true }
    ]
  },

  // IDENTITY SERVICES
  {
    id: "nin-services",
    name: "NIN Services",
    category: "modification_services",
    priceEstimate: "₦5,000 - ₦15,000",
    duration: "1 - 2 Business Days",
    description: "New National Identification Number (NIN) registration, modification of Date of Birth, Name corrections, and Premium NIN Slip printing.",
    formFields: [
      { name: "fullName", label: "Legal Full Name", type: "text", required: true, placeholder: "First Name, Middle Name, Last Name" },
      { name: "ninAction", label: "NIN Modification Required", type: "select", required: true, options: ["Fresh Enrolment", "Date of Birth Modification", "Correction of Name Spelling", "Re-print Lost NIN Slip", "NIN Verification/Validation"] },
      { name: "originalDob", label: "Date of Birth", type: "date", required: true },
      { name: "fathersName", label: "Father's Full Name", type: "text", required: true },
      { name: "currentSlip", label: "Present Document or Supporting Affidavit", type: "file", required: true }
    ]
  },
  {
    id: "npc-birth-cert",
    name: "NPC Birth Certificate / Attestation",
    category: "verification_service",
    priceEstimate: "₦8,000 - ₦12,000",
    duration: "3 - 5 Business Days",
    description: "Official National Population Commission (NPC) birth certificate or certificate attestation processing for international use.",
    formFields: [
      { name: "childName", label: "Subject Name (The Child)", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "placeOfBirth", label: "Place of Birth (Hospital & City)", type: "text", required: true },
      { name: "parentsNames", label: "Parents' Names", type: "textarea", required: true, placeholder: "Father's Name & Mother's Name" },
      { name: "birthReport", label: "Local Hospital Birth Card or Affidavit", type: "file", required: true }
    ]
  },
  {
    id: "court-affidavit",
    name: "Court Affidavit Processing",
    category: "documentation_service",
    priceEstimate: "₦3,500 - ₦6,000",
    duration: "24 Hours",
    description: "Legal Court Affidavit for Declaration of Age, Change of Name, Lost Items, Single Status, or Resident details.",
    formFields: [
      { name: "applicantName", label: "Applicant Name", type: "text", required: true },
      { name: "affidavitType", label: "Type of Court Affidavit", type: "select", required: true, options: ["Deed of Name Change", "Declaration of Age", "Loss of Wallet/Details", "Proof of Nationality", "Consent Affidavit"] },
      { name: "reasoning", label: "Affidavit Body text / Details", type: "textarea", required: true, placeholder: "Detail the names, ages, or dates to be corrected" },
      { name: "idCard", label: "Valid ID Card (NIN / Voter Card)", type: "file", required: true }
    ]
  },
  {
    id: "police-report",
    name: "Police Character / Loss Report",
    category: "verification_service",
    priceEstimate: "₦12,000 - ₦30,000",
    duration: "2 - 3 Business Days",
    description: "Official Police Character Clearance Certificate or Police Loss Report for lost ID, vehicle documents, and educational records.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "policeType", label: "Type of Report", type: "select", required: true, options: ["Loss of Document Report", "Police Character Certificate", "Assault Report Diary Extract"] },
      { name: "lostDetails", label: "Brief statement / explanation", type: "textarea", required: true, placeholder: "Describe how, when and where the incident occurred..." },
      { name: "supportingDoc", label: "Completed Information sheet or Old ID", type: "file", required: true }
    ]
  },
  {
    id: "marriage-registration",
    name: "Marriage Registration Services",
    category: "registration_services",
    priceEstimate: "₦35,000 - ₦75,000",
    duration: "2 - 3 Weeks",
    description: "Assistance with federal marriage registry bookings, documentation submission, statutory wedding preparation, and securing certified marriage registration certificates.",
    formFields: [
      { name: "partnerAName", label: "Partner A Legal Full Name", type: "text", required: true, placeholder: "First Name, Middle Name, Last Name" },
      { name: "partnerBName", label: "Partner B Legal Full Name", type: "text", required: true, placeholder: "First Name, Middle Name, Last Name" },
      { name: "registryLocation", label: "Preferred Registry Location / State", type: "text", required: true, placeholder: "e.g., Ikoyi Registry, Lagos" },
      { name: "proposedDate", label: "Proposed Wedding Date", type: "date", required: true },
      { name: "partnerAPassport", label: "Partner A Passport Photograph", type: "file", required: true },
      { name: "partnerBPassport", label: "Partner B Passport Photograph", type: "file", required: true },
      { name: "birthCertsOrNin", label: "Birth Certificates or NIN Slips (Combined PDF or ZIP)", type: "file", required: true }
    ]
  },

  // BUSINESS SERVICES
  {
    id: "cac-business",
    name: "CAC Business Name Registration",
    category: "registration_services",
    priceEstimate: "₦18,000 - ₦24,000",
    duration: "4 - 7 Business Days",
    description: "Registering business names with the Corporate Affairs Commission. Includes name search, filing, and certificate delivery.",
    formFields: [
      { name: "ownerName", label: "Business Owner/Proprietor Name", type: "text", required: true },
      { name: "proposedName1", label: "Proposed Business Name (Option 1)", type: "text", required: true, placeholder: "Preferred Business Name" },
      { name: "proposedName2", label: "Proposed Business Name (Option 2)", type: "text", required: true, placeholder: "Alternative Name" },
      { name: "businessNature", label: "Nature/Sector of Business", type: "textarea", required: true, placeholder: "e.g. Agricultural farming, General merchandise, Fashion design..." },
      { name: "ownerId", label: "Signature & Owner NIN/ID Card", type: "file", required: true }
    ]
  },
  {
    id: "tin-registration",
    name: "TIN Registration (Tax ID)",
    category: "registration_services",
    priceEstimate: "₦4,000 - ₦8,000",
    duration: "24 - 48 Hours",
    description: "Instant creation and activation of Joint Tax Board (JTB) or Federal Inland Revenue Service (FIRS) Tax Identification Number for individuals & entities.",
    formFields: [
      { name: "entityName", label: "Entity/Individual Legal Name", type: "text", required: true },
      { name: "taxType", label: "TIN Classification", type: "select", required: true, options: ["Individual TIN (Self-Employed / Worker)", "Enterprise/Non-Limited Corporate TIN", "Limited Liability (FIRS) Corporate TIN"] },
      { name: "associatedNin", label: "NIN Number (For Individual TIN)", type: "text", required: true, placeholder: "11-digit NIN Number" },
      { name: "utilityBill", label: "Address Utility Bill (Nepa bill/Water)", type: "file", required: true }
    ]
  },
  {
    id: "scuml-registration",
    name: "SCUML Registration & Licensing",
    category: "registration_services",
    priceEstimate: "₦25,000 - ₦45,000",
    duration: "10 - 14 Business Days",
    description: "Special Anti-Money Laundering (SCUML) certification from the EFCC. Required constraint for luxury business bank accounts in Nigeria.",
    formFields: [
      { name: "businessName", label: "CAC Certified Business Name", type: "text", required: true },
      { name: "rcNumber", label: "BN / RC Registration Number", type: "text", required: true, placeholder: "BN-1234 or RC-12345" },
      { name: "scumlNature", label: "Business Sector Code", type: "select", required: true, options: ["Real Estate / Property Management", "Hotels / Hospitality", "Consulting firm", "Audit & Accounting", "Luxury Auto Selling", "Jewelry, Dealers in Gold", "Casinos & Trust Services"] },
      { name: "cacDocs", label: "CAC Certificate & Status Report", type: "file", required: true }
    ]
  },

  // TRAVEL & IMMIGRATION
  {
    id: "intl-passport",
    name: "International Passport Processing",
    category: "registration_services",
    priceEstimate: "₦65,000 - ₦95,000",
    duration: "2 - 6 Weeks (Biometrics)",
    description: "Step-by-step facilitation for 32-Page/64-Page Standard Passport, renewals, correction of data, or fast-track booking.",
    formFields: [
      { name: "fullName", label: "Full Legal Name on Passport", type: "text", required: true },
      { name: "passportOps", label: "Application Type", type: "select", required: true, options: ["Fresh Issue (5 Years, 32 Pages)", "Fresh Issue (10 Years, 64 Pages)", "Renewal (Expiring Passport)", "Data Modification (Name/DOB)", "Lost Passport / Replace Document"] },
      { name: "stateOfOrigin", label: "State of Origin / Local Gov", type: "text", required: true },
      { name: "oldPassport", label: "Expired Passport Page / NIN Slip", type: "file", required: true }
    ]
  },
  {
    id: "driver-licence",
    name: "Driver's Licence Processing",
    category: "registration_services",
    priceEstimate: "₦26,000 - ₦38,000",
    duration: "2 - 3 Weeks (Temp Slip in 48h)",
    description: "Facilitation of 3-Year or 5-Year official Driver's License registration, physical exam bypass, biometric booking, & renewal tracking.",
    formFields: [
      { name: "fullName", label: "Driver Name", type: "text", required: true },
      { name: "dob", label: "Date of Birth", type: "date", required: true },
      { name: "classLic", label: "License Category Type", type: "select", required: true, options: ["Category A (Motorcycles)", "Category B (Private Saloon cars)", "Category C (Commercial buses/vehicles)", "Category E (Heavy Trucks)"] },
      { name: "durationLic", label: "Licence Validity Length", type: "select", required: true, options: ["3-Year Validity", "5-Year Validity"] },
      { name: "idAttachment", label: "Active NIN Slip or Expired Licence", type: "file", required: true }
    ]
  },

  // PRINTING & DOCUMENTATION
  {
    id: "printing-services",
    name: "Mass Printing & Scanning Desk",
    category: "documentation_service",
    priceEstimate: "₦50 - ₦300 / Page",
    duration: "Same day dispatch",
    description: "High speed, premium printing, thesis binding, scan-to-PDF desk, laminated certificates, and direct parcel shipping.",
    formFields: [
      { name: "clientName", label: "Contact Name", type: "text", required: true },
      { name: "printPrefs", label: "Printing Format Preferences", type: "textarea", required: true, placeholder: "e.g. 50 Pages Double-Sided, Color Spiral Bind, A4, Gloss paper..." },
      { name: "deliveryAddress", label: "Delivery Address (Or Jumia Hub/GIG)", type: "text", required: true },
      { name: "sourceFile", label: "Document PDF or Docx for Printing", type: "file", required: true }
    ]
  },
  {
    id: "cv-writing",
    name: "CV & Cover Letter Writing",
    category: "documentation_service",
    priceEstimate: "₦4,000 - ₦10,000",
    duration: "24 - 48 Hours",
    description: "ATS-optimized Premium CV, Cover letter, and optimized LinkedIn setup written by global recruiting professionals.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "targetJob", label: "Target Industry / Desired Role", type: "text", required: true, placeholder: "e.g., Senior Marketer, Cloud Engineer, Accountant" },
      { name: "experiences", label: "Provide brief current roles and skills", type: "textarea", required: true, placeholder: "List your duties, dates worked, or previous degrees" },
      { name: "oldCv", label: "Your Old CV / Educational History", type: "file", required: false }
    ]
  },

  // VEHICLE SERVICES
  {
    id: "vehicle-reg",
    name: "Vehicle Registration & Renewal",
    category: "registration_services",
    priceEstimate: "₦45,000 - ₦65,000",
    duration: "3 - 5 Business Days",
    description: "Full vehicle registration, customized license plates, change of ownership, roadworthiness certificates, and auto insurance cards.",
    formFields: [
      { name: "ownerName", label: "Vehicle Owner Name", type: "text", required: true },
      { name: "vehicleSpecs", label: "Vehicle Details", type: "textarea", required: true, placeholder: "Car Maker, Model, Color, Year of Manufacture, Chassis, and Engine Number" },
      { name: "regType", label: "Registration Objective", type: "select", required: true, options: ["Fresh Car plate (New Import)", "Ownership Change Transfer", "Annual License & Road-Worthiness Renewal", "Third Party Auto Insurance Certificate"] },
      { name: "customCard", label: "Customized Plate Requested?", type: "text", required: false, placeholder: "e.g. KGS-017A (Optional)" },
      { name: "importDocs", label: "Custom Papers / Proof of Purchase", type: "file", required: true }
    ]
  },

  // UTILITY SERVICES
  {
    id: "airtime-data",
    name: "Airtime & Data Wholesale bundles",
    category: "exam_pin_services",
    priceEstimate: "₦100 - ₦50,000",
    duration: "Instant (1 - 2 mins)",
    description: "Get discount bundles of MTN, Airtel, Glo and 9mobile VTU airtime, SME data plans, and electricity meter payments.",
    formFields: [
      { name: "phoneNo", label: "Target Phone Number", type: "text", required: true, placeholder: "08034567890" },
      { name: "network", label: "Telecom Network provider", type: "select", required: true, options: ["MTN Nigeria", "Airtel Nigeria", "Glo Mobile", "9mobile Network", "Ikeja Electric (IKEDC)", "Eko Electric (EKEDC)", "DSTV Premium"] },
      { name: "bundlePlan", label: "Bundle description", type: "text", required: true, placeholder: "e.g. 10GB SME (30 Days Validity) / N5000 Airtime / Meter ID" }
    ]
  },

  // EMPLOYMENT SERVICES
  {
    id: "job-opp",
    name: "Latest Job Opportunity Registration",
    category: "educational_services",
    priceEstimate: "₦2,000 - ₦5,000",
    duration: "24 Hours",
    description: "Account creation, profiles set up on LinkedIn, Indeed, Jobberman, and Upwork with automated job alert keywords set.",
    formFields: [
      { name: "jobSeeker", label: "Full Name", type: "text", required: true },
      { name: "qualification", label: "Highest Qualification attained", type: "select", required: true, options: ["O'Level (SSCE)", "ND / NCE", "HND / BSC Merit", "MSc / PhD", "Professional Certification only"] },
      { name: "desiredSector", label: "Target Sector", type: "text", required: true, placeholder: "e.g., Banking, Tech, Teaching, Logistics" },
      { name: "credentialFile", label: "CV or Degree Transcripts", type: "file", required: true }
    ]
  },

  // PROPERTY SERVICES
  {
    id: "house-rent",
    name: "Affordable Rent Listings Tracker",
    category: "registration_services",
    priceEstimate: "₦250,000 - ₦1,500,000 / Yr",
    duration: "Weekly Matching alerts",
    description: "Browse verified listings of apartments, duplexes, shops, and office spaces with direct access to physical agents.",
    formFields: [
      { name: "tenantName", label: "Client Name", type: "text", required: true },
      { name: "propertyType", label: "Target Space Needs", type: "select", required: true, options: ["Self-Contain / Studio Apartment", "2-Bedroom Flat", "3-Bedroom Custom Flat", "Physical Lock-up Shop", "Large Office Complex"] },
      { name: "locationPreferred", label: "Preferred Locations (Nigeria)", type: "text", required: true, placeholder: "e.g. Lekki, Ikeja, Gbagada, Jabi, Gwarinpa, Port Harcourt..." },
      { name: "annualBudget", label: "Maximum Budget Range Name (₦)", type: "text", required: true, placeholder: "e.g. 500,000 - 800,000" }
    ]
  },

  // GADGETS
  {
    id: "gadgets-deal",
    name: "Premium Vetted Gadgets Purchase",
    category: "educational_services",
    priceEstimate: "Negotiated (Varies)",
    duration: "1 - 2 Days courier",
    description: "Buy grade-A refurbished or new HP, Dell, Lenovos, iPhones, Samsungs, and custom chargers directly tested by MYSOLUTION HUB Tech Center.",
    formFields: [
      { name: "buyerName", label: "Full Name of Purchaser", type: "text", required: true },
      { name: "gadgetTarget", label: "Device Brand & Specs Requested", type: "textarea", required: true, placeholder: "e.g., HP EliteBook 840 G5 Core i7 16GB RAM/512GB SSD, or iPhone 13 Pro Max 256GB" },
      { name: "courierMethod", label: "Delivery Method", type: "select", required: true, options: ["Self-Pick up at MYSOLUTION Desk", "Home Courier (Lagos / Abuja / PH)", "Inter-state Park Delivery (GIG/Peace)"] }
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Dr. Joshua Adebayo",
    role: "Lagos Business Owner & Lecturer",
    text: "MYSOLUTION HUB made registering my consultancy business with the CAC extremely easy. I didn't have to fill out complex government portals or query lists. In exactly six days, my digital certificates were ready. Highly professional!",
    service: "CAC Business Name Registration",
    avatarColor: "bg-emerald-500",
  },
  {
    id: "t2",
    name: "Chiamaka Okafor",
    role: "International Aspirant (UK MSc Student)",
    text: "I was struggling with getting my transcript and birth records processed. The document desk processed my NPC Birth Certificate attestation and uploaded it for my admission. Their service is truly modern, and they responded on WhatsApp immediately.",
    service: "NPC Birth Certificate",
    avatarColor: "bg-indigo-500",
  },
  {
    id: "t3",
    name: "Musa Ibrahim",
    role: "Consultant / Job Applicant",
    text: "Their professional CV writing service is top notch. CV was rewritten into a stunning, clean ATS-compliant template. I started getting direct interviews from recruiters within 10 days of applying with the new CV. Super grateful!",
    service: "CV & Cover Letter Writing",
    avatarColor: "bg-teal-500",
  },
  {
    id: "t4",
    name: "Damilola Benson",
    role: "Federal Government NYSC Corps Member",
    text: "Fast service, incredibly reliable support, and very affordable charges. I always use them for examinations pins purchase, NIN slip modification updates, and my regular airtime VTU/data bundle subscriptions. Highly recommended!",
    service: "NIN Modification Profile",
    avatarColor: "bg-amber-500",
  }
];

export const FEATURES = [
  {
    title: "Fast Turnaround Time",
    description: "Most document updates and PIN services are completed instantly or within hours. We prioritize efficiency.",
    icon: "Zap",
  },
  {
    title: "Professional Support",
    description: "Gain direct access to vetted, experienced liaison officers who interact with government bodies on your behalf.",
    icon: "ShieldAlert",
  },
  {
    title: "Secure Processing",
    description: "Your confidential data, NINs, passwords, and private uploads are protected by military-grade security systems.",
    icon: "LockKeyhole",
  },
  {
    title: "Affordable Charges",
    description: "No hidden fees. Honest, highly subsidized, and ultra-competitive pricing structures for standard services.",
    icon: "CircleDollarSign",
  },
  {
    title: "Excellent Customer Support",
    description: "Fast-responders ready to resolve questions, update progress on WhatsApp, and mail items nationwide.",
    icon: "Headphones",
  }
];

export const STEPS = [
  {
    number: "01",
    title: "Select Your Service",
    description: "Navigate our dynamic menu by category. View processing times, estimates, and select exactly what you need.",
  },
  {
    number: "02",
    title: "Fill Details & Upload Files",
    description: "Provide candidate details in the secure dashboard. Drag & drop your supporting documents cleanly.",
  },
  {
    number: "03",
    title: "Receive WhatsApp Dispatch",
    description: "Click to generate a secure order file. Connect directly to our WhatsApp Desk for swift processing.",
  },
  {
    number: "04",
    title: "Instant Live Tracking",
    description: "Real-time verification states let you watch your tasks transition from 'Received' to 'Completed' safely.",
  }
];
