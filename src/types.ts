export interface Service {
  id: string;
  name: string;
  category: string;
  priceEstimate: string;
  duration: string;
  description: string;
  formFields: FormField[];
}

export type FormFieldType = "text" | "number" | "select" | "textarea" | "file" | "date";

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface VerificationOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  submittedAt: string;
  formData: Record<string, string>;
  files: { name: string; size: string; type: string; dataUrl?: string }[];
  status: "Received" | "Pending Verification" | "Processing" | "Completed";
  trackingId: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}
