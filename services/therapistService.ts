export type Therapist = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  specialty?: string;
  experience?: string;
  license?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseType?: string;
  licenseStatus?: string;
  licenseExpiration?: string;
  licenseIssuingAuthority?: string;
};

const MOCK: Record<string, Therapist> = {
  "demo": {
    id: "demo",
    name: "Dr. Demo Therapist",
    email: "demo@clinic.example",
    phone: "+1 (555) 123-4567",
    specialty: "Anxiety & Stress Management",
    experience: "8 years",
    license: "LCSW",
    licenseNumber: "LC-123456",
    licenseStatus: "Active",
    licenseExpiration: "2026-12-31",
    licenseIssuingAuthority: "State Board of Behavioral Health",
  },
};

export function getTherapistDetails(id: string): Therapist | null {
  return MOCK[id] ?? null;
}
