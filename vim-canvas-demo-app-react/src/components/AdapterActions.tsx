import { useContext, useState, type FormEvent } from "react";
import { set } from "lodash-es";
import { ArrowRight, CircleAlert, Maximize2, Minimize2 } from "lucide-react";
import { z } from "zod";
import { useVimOSEncounter } from "@/hooks/useEncounter";
import { useVimOSPatient } from "@/hooks/usePatient";
import { adapterActionInputs, adapterActions, type AdapterAction } from "@/lib/adapter-action-inputs";
import { cn } from "@/lib/utils";
import { AdapterActionsContext, adapterActionTimeouts, type AdapterActionTimeout } from "@/utils/adapterActions";
import { AdapterActionResponse, type ActionResponse } from "./AdapterActionResponse";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loading } from "./ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type InputField = {
  path: string;
  label: string;
  type: "date" | "text";
  required: boolean;
};

function getFields(schema: z.ZodTypeAny, path = "", required = true): InputField[] {
  if (schema instanceof z.ZodOptional) {
    return getFields(schema.unwrap(), path, false);
  }
  if (schema instanceof z.ZodDefault) {
    return getFields(schema.removeDefault(), path, false);
  }
  if (schema instanceof z.ZodObject) {
    const shape: z.ZodRawShape = schema.shape;
    return Object.entries(shape).flatMap(([key, value]) =>
      getFields(value, path ? `${path}.${key}` : key, required)
    );
  }
  return [{
    path,
    label: schema.description ?? path,
    type: schema instanceof z.ZodString && schema.isDate ? "date" : "text",
    required,
  }];
}

function AdapterActionInput({
  field: { path, label, type, required },
  prefill,
}: { field: InputField; prefill?: string }) {
  const [editedValue, setEditedValue] = useState<string>();
  const id = `adapter-input-${path}`;

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Label
        htmlFor={id}
        className="flex flex-wrap items-baseline gap-x-1.5 text-xs font-medium leading-[1.1rem] text-slate-700"
      >
        {label}
        {!required && <span className="text-[10px] font-normal text-slate-500">Optional</span>}
      </Label>
      <Input
        id={id}
        name={path}
        type={type}
        required={required}
        value={editedValue ?? prefill ?? ""}
        onChange={(event) => setEditedValue(event.target.value)}
        className="mt-auto min-w-0 rounded-lg border-slate-300 px-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 disabled:bg-slate-50"
      />
    </div>
  );
}

const actionLabels: Record<AdapterAction, string> = {
  FIND_PATIENT: "Find patient",
  GET_PATIENT: "Get patient details",
  GET_PATIENT_ENCOUNTERS: "List patient encounters",
  GET_ENCOUNTER_DATA: "Get encounter details",
  GET_ENCOUNTER_CPTS: "Get encounter CPT codes",
  GET_ENCOUNTER_LAB_RESULTS: "Get encounter lab results",
  GET_ENCOUNTER_VITALS: "Get encounter vitals",
  PRINT_ENCOUNTER: "Print encounter",
};

function formatActionResponse(value: unknown): ActionResponse {
  const json = JSON.stringify(value, (key, entry: unknown) =>
    ["token", "accessToken", "idToken", "refreshToken"].includes(key)
      ? "[redacted]"
      : entry, 2) ?? "null";
  const html = value && typeof value === "object" && "html" in value
    && typeof value.html === "string" && value.html.trim()
    ? value.html
    : undefined;
  const pdf = value && typeof value === "object" && "pdf" in value
    && typeof value.pdf === "string" && value.pdf.trim()
    ? value.pdf
    : undefined;
  return { json, html, pdf };
}

function actionError(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues.map(({ path, message }) => `${path.join(".")}: ${message}`).join("\n");
  }
  if (error instanceof Error) return error.message;
  return "Vim OS could not complete the action.";
}

export function AdapterActions({ expanded, onToggleExpanded }: {
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const connection = useContext(AdapterActionsContext);
  const { patient } = useVimOSPatient();
  const { encounter } = useVimOSEncounter();
  const [action, setAction] = useState<AdapterAction>(
    () => adapterActions.find((name) => connection?.available.has(name)) ?? adapterActions[0]
  );
  const [timeoutSeconds, setTimeoutSeconds] = useState<AdapterActionTimeout>(adapterActionTimeouts[0]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ActionResponse>();
  const [error, setError] = useState<string>();
  const canRun = connection?.available.has(action) ?? false;
  const unavailableMessage = !connection
    ? "This Vim SDK session doesn’t expose adapter actions."
    : connection.available.size === 0
      ? "No adapter actions are available for this app and EHR."
      : !canRun
        ? "This action isn’t enabled for the current app and EHR."
        : undefined;
  const fields = getFields(adapterActionInputs[action]);
  const patientId = patient?.identifiers?.ehrPatientId;
  const encounterId = encounter?.identifiers?.ehrEncounterId;
  const prefill: Record<string, string | undefined> = {
    patientId,
    encounterId,
    "demographics.firstName": patient?.demographics?.firstName,
    "demographics.lastName": patient?.demographics?.lastName,
    "demographics.dateOfBirth": patient?.demographics?.dateOfBirth?.split("T")[0],
    "demographics.address.zipCode": patient?.address?.zipCode,
    "insurance.memberId": patient?.insurance?.memberId,
  };
  const inputContext = JSON.stringify([
    action,
    patient?.identifiers?.vimPatientId ?? patientId,
    fields.some(({ path }) => path === "encounterId") ? encounterId : undefined,
  ]);

  async function execute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!connection || !canRun || busy) return;

    const form = new FormData(event.currentTarget);
    const input = {};
    for (const { path } of fields) {
      const value = form.get(path);
      if (typeof value === "string" && value.trim()) {
        set(input, path, value.trim());
      }
    }

    setBusy(true);
    setResult(undefined);
    setError(undefined);
    try {
      setResult(formatActionResponse(await connection.execute(action, input, timeoutSeconds)));
    } catch (error) {
      setError(actionError(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("mx-auto space-y-3 px-3 py-3", expanded ? "max-w-5xl" : "max-w-lg")}>
      <form
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        autoComplete="off"
        onSubmit={execute}
      >
        <div className="space-y-2 border-b border-slate-100 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="adapter-action" className="text-xs font-semibold text-slate-700">
              Adapter action
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-md border-slate-200 px-2 text-xs text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
              onClick={onToggleExpanded}
            >
              {expanded
                ? <Minimize2 aria-hidden="true" className="size-3.5" />
                : <Maximize2 aria-hidden="true" className="size-3.5" />}
              {expanded ? "Compact app" : "Enlarge app"}
            </Button>
          </div>
          <Select
            value={action}
            disabled={busy}
            onValueChange={(value) => {
              setAction(value as AdapterAction);
              setResult(undefined);
              setError(undefined);
            }}
          >
            <SelectTrigger
              id="adapter-action"
              className="h-10 rounded-lg border-slate-300 font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 [&>svg]:mt-0 [&>svg]:self-center"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {adapterActions.map((name) => (
                <SelectItem key={name} value={name} className="focus:bg-teal-50 focus:text-teal-900">
                  {actionLabels[name]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <code className="block break-all text-[11px] text-slate-500">{action}</code>
        </div>
        <div className="space-y-3 p-3.5">
          {unavailableMessage && (
            <div role="status" className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span>{unavailableMessage}</span>
            </div>
          )}
          {canRun && (
            <fieldset
              key={inputContext}
              disabled={busy}
              className={fields.length > 1
                ? "grid min-w-0 grid-cols-1 gap-3 min-[350px]:grid-cols-2"
                : "min-w-0"}
            >
              <legend className="mb-2 text-xs font-semibold text-slate-700">Inputs</legend>
              {fields.map((field) => (
                <AdapterActionInput key={field.path} field={field} prefill={prefill[field.path]} />
              ))}
            </fieldset>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-3.5 py-2.5">
          <span role="status" className="sr-only">{busy ? "Waiting for Vim OS." : ""}</span>
          <div className="flex items-center gap-2">
            <Label htmlFor="adapter-action-timeout" className="text-xs font-medium text-slate-700">Timeout</Label>
            <Select
              value={String(timeoutSeconds)}
              disabled={busy}
              onValueChange={(value) => {
                const seconds = adapterActionTimeouts.find((seconds) => String(seconds) === value);
                if (seconds !== undefined) setTimeoutSeconds(seconds);
              }}
            >
              <SelectTrigger id="adapter-action-timeout" className="w-20 rounded-md border-slate-300 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {adapterActionTimeouts.map((seconds) => (
                  <SelectItem key={seconds} value={String(seconds)}>{seconds} s</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!canRun || busy}
            className="gap-1.5 rounded-lg bg-teal-800 px-3 text-xs text-white hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {busy ? <Loading label="Running…" /> : (
              <><ArrowRight aria-hidden="true" className="size-3.5" />Run action</>
            )}
          </Button>
        </div>
      </form>
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="min-w-0 whitespace-pre-wrap break-words">{error}</p>
        </div>
      )}
      {result && <AdapterActionResponse response={result} />}
    </div>
  );
}
