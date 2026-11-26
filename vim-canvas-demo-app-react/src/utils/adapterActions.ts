import { loadSdk } from "vim-os-js-browser";
import type { LoadSDKOptions, SDK } from "vim-os-js-browser/types";
import { createContext } from "react";
import {
  type AdapterAction,
  adapterActions,
  getAdapterActionPayload,
} from "@/lib/adapter-action-inputs";

type HandshakePayload = {
  manifestSupport?: { EHR?: { actions?: Record<string, boolean> } };
};

type SdkFactory = (
  payload: HandshakePayload,
  channel: MessageChannel,
  logger: unknown,
  tokens?: { idToken: string }
) => SDK;

export const adapterActionTimeouts = [30, 60] as const;
export type AdapterActionTimeout = (typeof adapterActionTimeouts)[number];

export type AdapterActionConnection = {
  available: ReadonlySet<AdapterAction>;
  execute: (action: AdapterAction, input: unknown, timeoutSeconds: AdapterActionTimeout) => Promise<unknown>;
};

type AppSdk = { sdk: SDK; actions: AdapterActionConnection | null };

export const AdapterActionsContext = createContext<AdapterActionConnection | null>(null);

let appSdk: Promise<AppSdk> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function getActionError(response: unknown): Error {
  if (response instanceof Error && response.message) return response;
  if (typeof response === "string" && response.trim()) return new Error(response);
  if (isRecord(response)) {
    const { data, message } = response;
    if (typeof data === "string" && data.trim()) return new Error(data);
    if (isRecord(data) && typeof data.message === "string" && data.message.trim()) {
      return new Error(data.message);
    }
    if (typeof message === "string" && message.trim()) return new Error(message);
  }
  return new Error("Vim OS could not complete the action.");
}

export function loadAppSdk(): Promise<AppSdk> {
  appSdk ??= new Promise((resolve, reject) => {
    let actions: AdapterActionConnection | null = null;
    // The browser loader forwards options to the runtime, whose factory hook
    // supplies the authenticated connection. Preserve the standard SDK instance.
    const options: LoadSDKOptions & { sdkFactory: SdkFactory } = {
      sdkFactory(payload, channel, logger, tokens) {
        try {
          const { vimSdk } = globalThis as typeof globalThis & {
            vimSdk?: { ExternalSDK?: new (...args: Parameters<SdkFactory>) => SDK };
          };
          if (!vimSdk?.ExternalSDK) {
            throw new Error("This Vim SDK runtime cannot initialize the app SDK factory.");
          }

          const sdk = new vimSdk.ExternalSDK(payload, channel, logger, tokens);
          actions = createAdapterActionConnection(payload, channel.port1);
          return sdk;
        } catch (error) {
          // The runtime calls this from a message listener, so reject our load
          // promise explicitly if constructing the SDK fails.
          reject(error);
          throw error;
        }
      },
    };

    loadSdk(options).then((sdk) => resolve({ sdk, actions }), reject);
  });

  return appSdk;
}

function createAdapterActionConnection(
  payload: HandshakePayload,
  appPort: MessagePort
): AdapterActionConnection {
  const supported = payload.manifestSupport?.EHR?.actions;
  const available = new Set(adapterActions.filter((action) => supported?.[action] === true));
  let running = false;

  return {
    available,
    async execute(action, input, timeoutSeconds) {
      if (!available.has(action)) {
        throw new Error("This action is unavailable for the current app and EHR.");
      }
      if (running) {
        throw new Error("An adapter action is already running.");
      }

      const actionInput = getAdapterActionPayload(action, input);
      const { port1, port2 } = new MessageChannel();
      let timeout: ReturnType<typeof setTimeout> | undefined;
      running = true;
      try {
        return await new Promise((resolve, reject) => {
          timeout = setTimeout(
            () => reject(new Error(`Timed out waiting for Vim OS after ${timeoutSeconds} seconds.`)),
            timeoutSeconds * 1000
          );

          port1.onmessage = ({ data }: MessageEvent<unknown>) => {
            if (!isRecord(data) || typeof data.error !== "boolean" || !("response" in data)) {
              reject(new Error("Vim OS returned an invalid action response."));
              return;
            }

            if (data.error) {
              reject(getActionError(data.response));
            } else {
              resolve(data.response);
            }
          };
          port1.onmessageerror = () => {
            reject(new Error("The Vim OS action response could not be read."));
          };

          appPort.postMessage(
            { type: "EXECUTE_ACTION", payload: { action, input: actionInput }, dataPort: port2 },
            [port2]
          );
        });
      } finally {
        clearTimeout(timeout);
        port1.close();
        port2.close();
        running = false;
      }
    },
  };
}
