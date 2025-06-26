import { useForm, useFormContext } from "react-hook-form";

export interface ReferralFormInputs {
  specialty?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  priority?: string | null;
  authCode?: string | null;
  reasons?: string | null;
  notes?: string | null;
  numberOfVisits?: number | null;
  procedureCodes?: { id: string; label: string }[] | null;
  conditions?: { id: string; label: string }[] | null;
}

export const useReferralForm = useForm<ReferralFormInputs>;

export const useReferralFormContext = useFormContext<ReferralFormInputs>;
