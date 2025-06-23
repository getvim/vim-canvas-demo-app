import { useForm, useFormContext } from "react-hook-form";

export interface ReferralFormInputs {
  authCode?: string | null;
  reasons?: string | null;
  notes?: string | null;
}

export const useReferralForm = useForm<ReferralFormInputs>;

export const useReferralFormContext = useFormContext<ReferralFormInputs>;
