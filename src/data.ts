import { Service, Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "educational_services",
    name: "Education Services",
    description: "WAEC, NECO, NABTEB and JAMB Scratch Cards, Tokens and PINs.",
    iconName: "Key",
  },
  {
    id: "verification_services",
    name: "Verification Services",
    description: "NIN/BVN verification, retrievals, and official registry correction processes.",
    iconName: "ShieldCheck",
  },
  {
    id: "online_services",
    name: "Online Services",
    description: "CAC registration, NPC Birth attestation, TIN, driver license, and international passport processing.",
    iconName: "Globe",
  },
  {
    id: "jamb_services",
    name: "JAMB Services",
    description: "Original result printing, admission letters, ePIN tokens, and official course regularization/changes.",
    iconName: "GraduationCap",
  },
  {
    id: "exam_registration_services",
    name: "Exam Registration Services",
    description: "WAEC, NECO, NABTEB, GCE, JUPEB and IJMB candidate enrollment forms.",
    iconName: "BookOpen",
  },
];

export const SERVICES: Service[] = [
  // 1. EDUCATION SERVICES (WAEC, NECO, NABTEB, JAMB PINs)
  {
    id: "waec-pin",
    name: "WAEC PIN",
    category: "educational_services",
    priceEstimate: "₦4,000",
    duration: "Instant (Within 5 Mins)",
    description: "Instant WAEC Result Checker PIN and Serial Number delivery to check O'Level results.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Jane Audu" },
      { name: "emailAddress", label: "Email Address for Delivery", type: "text", required: true, placeholder: "you@example.com" },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true, placeholder: "e.g. 08012345678" },
      { name: "quantity", label: "Quantity Needed", type: "number", required: true, placeholder: "1" }
    ]
  },
  {
    id: "neco-pin",
    name: "NECO PIN",
    category: "educational_services",
    priceEstimate: "₦1,500",
    duration: "Instant (Within 5 Mins)",
    description: "NECO Result Token activation key to check NECO Internal and External exam marks.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Obi Nwosu" },
      { name: "emailAddress", label: "Email Address for Delivery", type: "text", required: true, placeholder: "you@example.com" },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true, placeholder: "e.g. 08012345678" },
      { name: "quantity", label: "Quantity Needed", type: "number", required: true, placeholder: "1" }
    ]
  },
  {
    id: "nabteb-pin",
    name: "NABTEB PIN",
    category: "educational_services",
    priceEstimate: "₦4,000",
    duration: "Instant (Within 5 Mins)",
    description: "NABTEB exam Result Card scratch PIN and card serial for direct verification.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Adamu Haruna" },
      { name: "emailAddress", label: "Email Address for Delivery", type: "text", required: true, placeholder: "you@example.com" },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true, placeholder: "e.g. 08012345678" },
      { name: "quantity", label: "Quantity Needed", type: "number", required: true, placeholder: "1" }
    ]
  },
  {
    id: "jamb-pin",
    name: "JAMB PIN",
    category: "educational_services",
    priceEstimate: "₦6,700",
    duration: "Instant (Within 5 Mins)",
    description: "JAMB profile utility PIN to enable candidate registration and portal entries.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "e.g. Sandra Otu" },
      { name: "emailAddress", label: "Email Address for Delivery", type: "text", required: true, placeholder: "you@example.com" },
      { name: "phoneNumber", label: "Phone Number connected to NIN", type: "text", required: true, placeholder: "e.g. 08012345678" },
      { name: "quantity", label: "Quantity Needed", type: "number", required: true, placeholder: "1" }
    ]
  },

  // 2. VERIFICATION SERVICES
  {
    id: "nin-verification",
    name: "NIN Verification",
    category: "verification_services",
    priceEstimate: "₦2,000",
    duration: "Same Day Dispatch",
    description: "Perform premium, structural National Identification Number validation against database.",
    formFields: [
      { name: "ninNumber", label: "NIN Number (11 Digits)", type: "text", required: true, placeholder: "e.g. 12345678901" },
      { name: "fullName", label: "Full Name on NIN Card", type: "text", required: true, placeholder: "As registered with NIMC" },
      { name: "phoneNumber", label: "Linked Phone Number", type: "text", required: true, placeholder: "08011223344" },
      { name: "ninSlip", label: "NIN Slip or Temporary Print", type: "file", required: true }
    ]
  },
  {
    id: "nin-retrieval",
    name: "NIN Retrieval",
    category: "verification_services",
    priceEstimate: "₦3,000",
    duration: "Same Day Dispatch",
    description: "Retrieve your lost or misplaced NIN using biometric identifiers and registered mobile history.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true, placeholder: "First, Middle, Last Name" },
      { name: "linkedPhone", label: "Registry Phone Number", type: "text", required: true, placeholder: "Phone registered at NIMC center" },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "fathersName", label: "Father's Full Name", type: "text", required: true, placeholder: "Father's legal name" }
    ]
  },
  {
    id: "bvn-retrieval",
    name: "BVN Retrieval",
    category: "verification_services",
    priceEstimate: "₦4,000",
    duration: "Same Day Dispatch",
    description: "Retrieve Bank Verification Number (BVN) safely. Requires matching account and telephone signatures.",
    formFields: [
      { name: "fullName", label: "Full Name on Bank Account", type: "text", required: true, placeholder: "e.g. David Alao" },
      { name: "bankName", label: "Registered Bank Name", type: "text", required: true, placeholder: "e.g. Access Bank" },
      { name: "accountNo", label: "Bank Account Number", type: "text", required: true, placeholder: "10-digit number" },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "linkedPhone", label: "BVN Linked Phone Number", type: "text", required: true, placeholder: "e.g. 08012345678" }
    ]
  },
  {
    id: "nin-dob-mod",
    name: "NIN Date of Birth Modification",
    category: "verification_services",
    priceEstimate: "₦15,000",
    duration: "1 - 2 Business Days",
    description: "Official modification of the date of birth associated with your National Identification Number.",
    formFields: [
      { name: "ninNumber", label: "NIN Number", type: "text", required: true, placeholder: "11-digit NIN" },
      { name: "correctDob", label: "Correct Date of Birth", type: "date", required: true },
      { name: "wrongDob", label: "Current Wrong Date of Birth", type: "date", required: true },
      { name: "courtAffidavit", label: "Court Affidavit for Age Declaration", type: "file", required: true },
      { name: "birthCertificate", label: "NPC Birth Certificate or Attestation", type: "file", required: true }
    ]
  },
  {
    id: "nin-name-mod",
    name: "NIN Change of Name",
    category: "verification_services",
    priceEstimate: "₦15,050",
    duration: "1 - 2 Business Days",
    description: "Official modification and correction of name spelling or full name adjustments on NIMC registry.",
    formFields: [
      { name: "ninNumber", label: "National Identification Number", type: "text", required: true },
      { name: "newFullName", label: "New Proposed Legal Full Name", type: "text", required: true, placeholder: "e.g. Grace Emeka Okafor" },
      { name: "oldFullName", label: "Old Registered Full Name", type: "text", required: true, placeholder: "e.g. Grace Emeka" },
      { name: "newspaperCut", label: "Change of Name Newspaper Publication", type: "file", required: true },
      { name: "courtDeed", label: "Deed Poll or Legal Court Certificate", type: "file", required: true }
    ]
  },
  {
    id: "nin-phone-mod",
    name: "NIN Change of Phone Number",
    category: "verification_services",
    priceEstimate: "₦10,000",
    duration: "1 - 2 Business Days",
    description: "Modify the primary phone number linked to your National Identification Number for SMS tracking.",
    formFields: [
      { name: "ninNumber", label: "NIN Number", type: "text", required: true, placeholder: "11-digit NIN" },
      { name: "newPhone", label: "New Phone Number to Link", type: "text", required: true, placeholder: "08012345678" },
      { name: "reason", label: "Reason for Change", type: "textarea", required: true, placeholder: "e.g. Stolen sim card, lost registry lines" },
      { name: "affidavit", label: "Police Report / Supporting Sworn Affidavit", type: "file", required: true }
    ]
  },

  // 3. ONLINE SERVICES
  {
    id: "cac-reg",
    name: "CAC Registration",
    category: "online_services",
    priceEstimate: "₦22,000",
    duration: "4 - 7 Business Days",
    description: "Complete business registration and incorporation with the Corporate Affairs Commission.",
    formFields: [
      { name: "proposedName", label: "Proposed Business Name (Preferred)", type: "text", required: true, placeholder: "e.g. Apex Tech Ventures" },
      { name: "altName", label: "Alternative Proposed Business Name", type: "text", required: true, placeholder: "Alternative back-up option" },
      { name: "businessType", label: "Business Type", type: "select", required: true, options: ["Sole Proprietorship", "Private Limited Company (LTD)", "Partnership", "NGO / Association"] },
      { name: "proprietorName", label: "Full Name of Proprietor / Directors", type: "text", required: true },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
      { name: "emailAddress", label: "Email Address", type: "text", required: true, placeholder: "you@example.com" },
      { name: "ownerId", label: "Owner NIN / International Passport Bio Page", type: "file", required: true }
    ]
  },
  {
    id: "npc-birth",
    name: "NPC Birth Registration",
    category: "online_services",
    priceEstimate: "₦8,500",
    duration: "3 - 5 Business Days",
    description: "Secure an official National Population Commission (NPC) Birth Certificate or certified attestation.",
    formFields: [
      { name: "childName", label: "Child's Full Legal Name", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "placeOfBirth", label: "Place of Birth (Hospital, City, LGA)", type: "text", required: true },
      { name: "parentsNames", label: "Parents' Full Names (Father & Mother)", type: "textarea", required: true, placeholder: "Father: Yusuf Ahmed, Mother: Fatima Ahmed" },
      { name: "hospitalCard", label: "Local Hospital Birth Card or sworn affidavit", type: "file", required: true }
    ]
  },
  {
    id: "scuml-reg",
    name: "SCUML Registration",
    category: "online_services",
    priceEstimate: "₦35,000",
    duration: "10 - 14 Business Days",
    description: "Special Control Unit Against Money Laundering (SCUML) certified registration for professional services.",
    formFields: [
      { name: "businessName", label: "CAC Certified Business Name", type: "text", required: true },
      { name: "rcNumber", label: "BN / RC Registration Number", type: "text", required: true, placeholder: "e.g. RC-1122334" },
      { name: "sectorCode", label: "Business Sector Code", type: "select", required: true, options: ["Real Estate / Property Development", "Hotels / Hospitality Management", "Non-Governmental Association", "Professional / Consultancy firm", "Luxury Vehicles Sale", "Bureaux de Change", "Casinos & Lottery"] },
      { name: "cacDocs", label: "CAC Incorporation Documents Pack (ZIP / PDF)", type: "file", required: true }
    ]
  },
  {
    id: "tin-reg",
    name: "TIN Registration",
    category: "online_services",
    priceEstimate: "₦5,000",
    duration: "24 - 48 Hours",
    description: "Instant creation and activation of individual or company Tax Identification Number.",
    formFields: [
      { name: "entityName", label: "Entity / Individual Name", type: "text", required: true, placeholder: "Name for tax assessment" },
      { name: "tinClass", label: "TIN Classification", type: "select", required: true, options: ["Individual TIN (Self-Employed / Employee)", "Non-Limited Enterprise (BN) TIN", "Limited Liability (LTD) Corporate TIN"] },
      { name: "ninNumber", label: "National Identification Number (NIN)", type: "text", required: true, placeholder: "11-digits" },
      { name: "utilityBill", label: "Address Utility Bill (NEPA / Water)", type: "file", required: true }
    ]
  },
  {
    id: "nerd-reg",
    name: "NERD Registration",
    category: "online_services",
    priceEstimate: "₦25,000",
    duration: "3 - 5 Business Days",
    description: "National Educational Research Database (NERD) platform profile establishment.",
    formFields: [
      { name: "entityName", label: "Institution / Entity Name", type: "text", required: true },
      { name: "representativeName", label: "Authorized Representative Name", type: "text", required: true },
      { name: "representativeNin", label: "Representative NIN Number", type: "text", required: true },
      { name: "businessDocs", label: "Company Registry or Academic License (PDF)", type: "file", required: true }
    ]
  },
  {
    id: "marriage-reg",
    name: "Marriage Registration",
    category: "online_services",
    priceEstimate: "₦50,000",
    duration: "2 - 3 Weeks",
    description: "Facilitate certified Federal Marriage Registry enrollment and legal wedding booking systems.",
    formFields: [
      { name: "partnerAName", label: "Partner A Legal Full Name", type: "text", required: true },
      { name: "partnerBName", label: "Partner B Legal Full Name", type: "text", required: true },
      { name: "registryLocation", label: "Preferred Registry Location", type: "text", required: true, placeholder: "e.g. Ikoyi Registry, Lagos" },
      { name: "proposedDate", label: "Proposed Wedding Date", type: "date", required: true },
      { name: "partnerAPassport", label: "Partner A Passport Photograph", type: "file", required: true },
      { name: "partnerBPassport", label: "Partner B Passport Photograph", type: "file", required: true }
    ]
  },
  {
    id: "intl-passport",
    name: "International Passport Processing",
    category: "online_services",
    priceEstimate: "₦85,000",
    duration: "2 - 6 Weeks (Biometrics)",
    description: "Standard Nigerian Immigration Service Passport booking, biometrics scheduling, and renewal routing.",
    formFields: [
      { name: "fullName", label: "Full Legal Name (as on papers)", type: "text", required: true },
      { name: "appType", label: "Application Type", type: "select", required: true, options: ["Fresh Issue (5 Years, 32 Pages)", "Fresh Issue (10 Years, 64 Pages)", "Expired Renewal", "Lost / Damaged Replacement"] },
      { name: "stateOfOrigin", label: "State of Origin & LGA", type: "text", required: true },
      { name: "supportingDoc", label: "NIN Slip & Birth Certificate Scan (PDF/ZIP)", type: "file", required: true }
    ]
  },
  {
    id: "visa-app",
    name: "Visa Application",
    category: "online_services",
    priceEstimate: "₦120,500",
    duration: "3 - 5 Weeks",
    description: "Comprehensive visa application profiling, booking slots, SOP writing, and consulate form completion.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "occupation", label: "Current Occupation / Job", type: "text", required: true },
      { name: "destination", label: "Destination Country", type: "text", required: true, placeholder: "e.g. United Kingdom" },
      { name: "visaType", label: "Visa Type", type: "select", required: true, options: ["Tourist / Visitor Visa", "Student MSc / PhD Visa", "Business / Professional Visa"] },
      { name: "passportBio", label: "International Passport Bio Page Scan", type: "file", required: true },
      { name: "bankStatement", label: "6 Months Official Bank Statement (PDF)", type: "file", required: true }
    ]
  },
  {
    id: "nysc-reg",
    name: "NYSC Registration",
    category: "online_services",
    priceEstimate: "₦4,500",
    duration: "1 - 3 Days",
    description: "National Youth Service Corps portal upload, biometric synchronization booking support and green-card printout.",
    formFields: [
      { name: "callupNo", label: "Callup Number (if available)", type: "text", required: false, placeholder: "NYSC/NMU/2026/..." },
      { name: "matricNo", label: "Institution Matric Number", type: "text", required: true },
      { name: "schoolName", label: "School Attended", type: "text", required: true, placeholder: "University / Polytechnic Name" },
      { name: "surname", label: "Surname", type: "text", required: true },
      { name: "otherNames", label: "Other Names", type: "text", required: true },
      { name: "passport", label: "Passport Photograph (White Background)", type: "file", required: true }
    ]
  },
  {
    id: "drivers-licence",
    name: "Driver's Licence Processing",
    category: "online_services",
    priceEstimate: "₦28,000",
    duration: "2 - 3 Weeks (Temp in 48 Hrs)",
    description: "FRSC driver license booking service. Bypass queue systems and obtain physical temporary slips.",
    formFields: [
      { name: "fullName", label: "Driver Legal Full Name", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "licenseType", label: "License Category Type", type: "select", required: true, options: ["Private Car (Category B)", "Motorcycle (Category A)", "Heavy Truck (Category E)", "Commercial Bus (Category C)"] },
      { name: "ninSlip", label: "NIN Slip or Expired FRSC Card", type: "file", required: true }
    ]
  },
  {
    id: "vehicle-reg",
    name: "Vehicle Registration",
    category: "online_services",
    priceEstimate: "₦45,000",
    duration: "3 - 5 Business Days",
    description: "New vehicle registration, allocation of plate numbers, and third party automated insurances.",
    formFields: [
      { name: "ownerName", label: "Vehicle Owner Name", type: "text", required: true },
      { name: "vehicleSpecs", label: "Vehicle details (Make, Model, Year, Chassis)", type: "textarea", required: true, placeholder: "e.g. Toyota Camry 2018, Red Color" },
      { name: "plateClass", label: "Plate Class", type: "select", required: true, options: ["Standard Private Plate", "Commercial Transport Plate", "Customized Personalized Plate"] },
      { name: "purchaseReceipt", label: "Customs Papers / Proof of Purchase Receipt", type: "file", required: true }
    ]
  },
  {
    id: "court-affidavit",
    name: "Court Affidavit",
    category: "online_services",
    priceEstimate: "₦4,500",
    duration: "24 Hours",
    description: "Official legal sworn Court Affidavit declaration of age, change of name, or missing items.",
    formFields: [
      { name: "applicantName", label: "Applicant Name", type: "text", required: true },
      { name: "affidavitType", label: "Type of Affidavit", type: "select", required: true, options: ["Deed of Name Correction", "Declaration of Legal Age", "Loss of Valuable Items", "Proof of Residence Single Status"] },
      { name: "statement", label: "Details to include in sworn affidavit text", type: "textarea", required: true },
      { name: "idCard", label: "Valid ID Card (NIN / Voter Card)", type: "file", required: true }
    ]
  },
  {
    id: "police-report",
    name: "Police Report",
    category: "online_services",
    priceEstimate: "₦15,000",
    duration: "2 - 3 Days",
    description: "Sworn Police Station extraction report regarding lost items, car papers, or missing records.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "incidentType", label: "Type of Incident Report", type: "select", required: true, options: ["Loss of SIM card & ID", "Loss of Vehicle Logbook Documents", "Official Police Character Certificate"] },
      { name: "incidentDetails", label: "Incident narrative (date, place, items)", type: "textarea", required: true, placeholder: "Include dates, locations, serial numbers if any..." },
      { name: "idDoc", label: "Old ID or proof of property ownership", type: "file", required: true }
    ]
  },

  // 4. JAMB SERVICES
  {
    id: "jamb-epin",
    name: "JAMB ePIN",
    category: "jamb_services",
    priceEstimate: "₦6,700",
    duration: "Instant (Within 5 Mins)",
    description: "Purchase official JAMB UTME electronic registration PIN delivered directly via SMS/Email.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "profileCode", label: "JAMB Profile Code (10-digits)", type: "text", required: true, placeholder: "Enter code sent to 55019" },
      { name: "phoneNumber", label: "Linked Phone Number", type: "text", required: true, placeholder: "08012345678" },
      { name: "emailAddress", label: "Email Address", type: "text", required: true, placeholder: "you@example.com" },
      { name: "oLevel", label: "O'Level Result Sheet (WAEC/NECO)", type: "file", required: true }
    ]
  },
  {
    id: "de-epin",
    name: "Direct Entry ePIN",
    category: "jamb_services",
    priceEstimate: "₦10,000",
    duration: "Instant (Within 5 Mins)",
    description: "Purchase official JAMB Direct Entry electronic profile PIN for ND/HND/BSc holders.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "profileCode", label: "JAMB Profile Code (10-digits)", type: "text", required: true },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
      { name: "emailAddress", label: "Email Address", type: "text", required: true },
      { name: "higherDegree", label: "HND/ND/Degree Statement of result / Transcript", type: "file", required: true }
    ]
  },
  {
    id: "jamb-original-result",
    name: "JAMB Original Result Printing",
    category: "jamb_services",
    priceEstimate: "₦4,500",
    duration: "1 Business Day",
    description: "Obtain your official color PDF JAMB result slip with passport photograph attached for screening.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "jambRegNo", label: "JAMB Registration Number", type: "text", required: true, placeholder: "e.g. 26532451JA" },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true, placeholder: "080..." },
      { name: "emailAddress", label: "Email Address", type: "text", required: true, placeholder: "you@example.com" }
    ]
  },
  {
    id: "jamb-admission-letter",
    name: "JAMB Admission Letter Printing",
    category: "jamb_services",
    priceEstimate: "₦4,500",
    duration: "1 Business Day",
    description: "Retrieve and print the statutory JAMB institution Admission Letter required by academic registries.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "jambRegNo", label: "JAMB Registration Number", type: "text", required: true, placeholder: "e.g. 26532451JA" },
      { name: "examYear", label: "Examination Year", type: "select", required: true, options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020"] },
      { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
      { name: "email", label: "Email Address", type: "text", required: true }
    ]
  },
  {
    id: "jamb-regularization",
    name: "JAMB Regularization",
    category: "jamb_services",
    priceEstimate: "₦12,000",
    duration: "3 - 5 Business Days",
    description: "Submit a mapping request to regularize admissions not recorded on the central JAMB CAPS registry.",
    formFields: [
      { name: "fullName", label: "Candidate's Full Name", type: "text", required: true },
      { name: "jambRegNo", label: "Old JAMB Number (if any)", type: "text", required: false },
      { name: "qualification", label: "Entry Qualification", type: "select", required: true, options: ["ND (National Diploma)", "NCE Certificate", "HND Diploma", "IJMB/JUPEB Certificate"] },
      { name: "institution", label: "Institution Attended", type: "text", required: true, placeholder: "e.g. University of Ibadan" },
      { name: "gradYear", label: "Year of Graduation", type: "number", required: true, placeholder: "2500" },
      { name: "supportingDoc", label: "Admission Letter or Statement of Results", type: "file", required: true }
    ]
  },
  {
    id: "jamb-course-change",
    name: "JAMB Change of Course/Institution",
    category: "jamb_services",
    priceEstimate: "₦6,500",
    duration: "1 - 2 Business Days",
    description: "Alter choice of program or primary state universities selected during initial registration checks.",
    formFields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "jambRegNo", label: "JAMB Registration Number", type: "text", required: true },
      { name: "courseChoice", label: "Alternative Course Choice", type: "text", required: true },
      { name: "institutionChoice", label: "Alternative Institution Choice", type: "text", required: true },
      { name: "oLevelResult", label: "O'Level Result (WAEC/NECO)", type: "file", required: true }
    ]
  },

  // 5. EXAM REGISTRATION SERVICES
  {
    id: "waec-registration",
    name: "WAEC Registration",
    category: "exam_registration_services",
    priceEstimate: "₦27,000",
    duration: "2 - 4 Business Days",
    description: "Submit candidate registry profile for school or external WAEC (West African Senior School Certificate) examinations.",
    formFields: [
      { name: "studentName", label: "Student Legal Full Name", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "subjectsList", label: "List of 9 Selected Subjects", type: "textarea", required: true, placeholder: "e.g. English, Math, Physics, Chemistry, Biology, Civic..." },
      { name: "passportPhoto", label: "Passport Photograph", type: "file", required: true }
    ]
  },
  {
    id: "gce-registration",
    name: "GCE (WAEC/NECO) Registration",
    category: "exam_registration_services",
    priceEstimate: "₦25,000",
    duration: "2 - 4 Business Days",
    description: "Private external candidate enrollments (General Certificate of Education) for November/December slots.",
    formFields: [
      { name: "candidateName", label: "Candidate Legal Name", type: "text", required: true },
      { name: "stateChosen", label: "Preferred State & Examination Center", type: "text", required: true, placeholder: "e.g. Ikeja, Lagos" },
      { name: "subjects", label: "Selected Examination Subjects Details", type: "textarea", required: true },
      { name: "passport", label: "Passport Photograph", type: "file", required: true }
    ]
  },
  {
    id: "neco-registration",
    name: "NECO Registration",
    category: "exam_registration_services",
    priceEstimate: "₦22,000",
    duration: "2 - 4 Business Days",
    description: "Registrations for official NECO (National Examinations Council) Senior School Certifications.",
    formFields: [
      { name: "candidateName", label: "Candidate Name", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "examLocation", label: "Preferred State / Examination Centre LGA", type: "text", required: true },
      { name: "subjectsRequired", label: "Selected Examination Subjects", type: "textarea", required: true },
      { name: "passport", label: "Passport Photograph", type: "file", required: true }
    ]
  },
  {
    id: "nabteb-registration",
    name: "NABTEB Registration",
    category: "exam_registration_services",
    priceEstimate: "₦20,000",
    duration: "3 - 5 Business Days",
    description: "National Business and Technical Examinations Board (NABTEB) candidate enrollments.",
    formFields: [
      { name: "candidateName", label: "Candidate Full Name", type: "text", required: true },
      { name: "tradeCode", label: "Technical Trade Area / Interest Code", type: "select", required: true, options: ["Electrical Installation", "Mechanical Trade", "Computer Craft", "Business / Accountancy Trade"] },
      { name: "subjects", label: "List of general and trade subjects chosen", type: "textarea", required: true },
      { name: "passport", label: "Passport Photograph", type: "file", required: true }
    ]
  },
  {
    id: "jupeb-registration",
    name: "JUPEB Registration",
    category: "exam_registration_services",
    priceEstimate: "₦180,000",
    duration: "5 - 7 Business Days",
    description: "Enrollment in Joint Universities Preliminary Examinations Board advanced level system.",
    formFields: [
      { name: "candidateName", label: "Candidate Legal Name", type: "text", required: true },
      { name: "affiliateUni", label: "Preferred Affiliate University Center", type: "text", required: true, placeholder: "e.g. UNILAG center, UNIBEN center" },
      { name: "subjectCombo", label: "Three advanced subjects combo (e.g. Physics, Chemistry, Mathematics)", type: "text", required: true },
      { name: "oLevelResult", label: "O'Level Result Slip", type: "file", required: true },
      { name: "passport", label: "Passport Photograph", type: "file", required: true }
    ]
  },
  {
    id: "ijmb-registration",
    name: "IJMB Registration",
    category: "exam_registration_services",
    priceEstimate: "₦150,000",
    duration: "5 - 7 Business Days",
    description: "Enrollment in official Interim Joint Matriculation Board direct-entry university linkage system.",
    formFields: [
      { name: "candidateName", label: "Candidate Legal Name", type: "text", required: true },
      { name: "centerLocation", label: "Preferred Examination Study Center (State)", type: "text", required: true, placeholder: "e.g. Ilorin Center, Kwara State" },
      { name: "subjectCombo", label: "Three Advanced Subjects Combo Chosen", type: "text", required: true },
      { name: "oLevelResult", label: "O'Level Result (WAEC/NECO/NABTEB)", type: "file", required: true },
      { name: "passport", label: "Passport Photograph", type: "file", required: true }
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
    avatarColor: "bg-emerald-550",
  },
  {
    id: "t2",
    name: "Chiamaka Okafor",
    role: "International Aspirant (UK MSc Student)",
    text: "I was struggling with getting my transcript and birth records processed. The document desk processed my NPC Birth Certificate attestation and uploaded it for my admission. Their service is truly modern, and they responded on WhatsApp immediately.",
    service: "NPC Birth Certificate",
    avatarColor: "bg-indigo-550",
  },
  {
    id: "t3",
    name: "Musa Ibrahim",
    role: "Consultant / Job Applicant",
    text: "Their professional CV writing service is top notch. CV was rewritten into a stunning, clean ATS-compliant template. I started getting direct interviews from recruiters within 10 days of applying with the new CV. Super grateful!",
    service: "CV & Cover Letter Writing",
    avatarColor: "bg-teal-550",
  },
  {
    id: "t4",
    name: "Damilola Benson",
    role: "Federal Government NYSC Corps Member",
    text: "Fast service, incredibly reliable support, and very affordable charges. I always use them for examinations pins purchase, NIN slip modification updates, and my regular airtime VTU/data bundle subscriptions. Highly recommended!",
    service: "NIN Modification Profile",
    avatarColor: "bg-amber-550",
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
    title: "Fund Wallet & Pay Cash",
    description: "Top up your wallet instantaneously via safe bank transfer or card, and complete checkout silently.",
  },
  {
    number: "04",
    title: "Instant Live Tracking",
    description: "Real-time verification states let you watch your tasks transition from 'Pending' to 'Completed' safely.",
  }
];
