import React from "react";
import * as Icons from "lucide-react";

interface IconMapperProps {
  name: string;
  className?: string;
}

export default function IconMapper({ name, className = "" }: IconMapperProps) {
  // Safe lookup of Lucide Icons
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback safe icon
    return <Icons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
}
