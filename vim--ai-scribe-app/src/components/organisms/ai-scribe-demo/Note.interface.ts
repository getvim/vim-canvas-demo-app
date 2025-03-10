
export interface Note {
  id: string;
  patientName: string;
  timestamp: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}
