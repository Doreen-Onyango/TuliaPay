"use client";

import React, { useCallback, useState } from "react";
import { IDKit, IDKitErrorCodes, orbLegacy } from "@worldcoin/idkit-core";
import { useAtom } from "jotai";
import { isVerifiedHumanAtom } from "../store";
import QRCode from "react-qr-code";
import { Button } from "../components/ui/Button";
import { UserCheck, Shield, Copy, ExternalLink, RefreshCw } from "lucide-react";

type VerifyState = "idle" | "requesting" | "polling" | "verified" | "error";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function WorldIDVerifyButton() {
  const [isVerified, setIsVerified] = useAtom(isVerifiedHumanAtom);
  const [state, setState] = useState<VerifyState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [connectorURI, setConnectorURI] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    if (isVerified || state === "requesting" || state === "polling") return;

    try {
      setError(null);
      setState("requesting");

      const action = "verify-human";

      const sigRes = await fetch(`${BACKEND_BASE_URL}/api/world/sign-request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!sigRes.ok) {
        const data = await sigRes.json().catch(() => ({}));
        throw new Error(
          data?.error || "Failed to create World ID request on backend",
        );
      }

      const sigJson = await sigRes.json();

      const builder = IDKit.request({
        app_id: sigJson.app_id,
        action: sigJson.action,
        rp_context: sigJson.rp_context,
        allow_legacy_proofs: true,
        // Use staging by default for local development; switch to "production" when live.
        environment:
          (process.env.NEXT_PUBLIC_WORLD_ENV as "staging" | "production" | undefined) ??
          "staging",
      });

      const request = await builder.preset(
        orbLegacy({
          signal: sigJson.rp_context.nonce,
        }),
      );

      // When not running inside World App, connectorURI is the link/QR the user must open.
      if (request.connectorURI) {
        setConnectorURI(request.connectorURI);
        console.info(
          "[World ID] Open this URL in World App or simulator to complete verification:",
          request.connectorURI,
        );
      }

      setState("polling");

      const completion = await request.pollUntilCompletion({
        pollInterval: 2_000,
        timeout: 90_000,
      });

      console.info("[World ID] completion:", completion);

      if (!completion.success) {
        setState("error");
        setConnectorURI(null);
        if (completion.error === IDKitErrorCodes.Timeout) {
          setError(
            "World ID check timed out. Please open the link/QR in World App and try again.",
          );
        } else if (completion.error === IDKitErrorCodes.Cancelled) {
          setError("World ID verification was cancelled.");
        } else {
          setError(
            completion.error ||
              "World ID verification was not completed. Please try again.",
          );
        }
        return;
      }

      const verifyRes = await fetch(`${BACKEND_BASE_URL}/api/world/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(completion.result),
      });

      const verifyJson = await verifyRes.json();

      if (!verifyRes.ok || !verifyJson.success) {
        setState("error");
        setConnectorURI(null);
        setError(
          verifyJson?.detail || verifyJson?.error || "World ID verification failed",
        );
        return;
      }

      setIsVerified(true);
      setConnectorURI(null);
      setState("verified");
    } catch (err: unknown) {
      console.error("[World ID] client error:", err);
      const message =
        err instanceof Error ? err.message : "Unexpected World ID error";
      setError(message);
      setState("error");
    }
  }, [isVerified, setIsVerified, state]);

  const label =
    state === "requesting"
      ? "Preparing secure check…"
      : state === "polling"
        ? "Awaiting World ID…"
        : state === "verified"
          ? "Human verified"
          : "Verify with World ID";

  return (
    <div className="w-full space-y-6">
      <Button
        onClick={handleClick}
        disabled={isVerified || state === "requesting" || state === "polling"}
        variant={state === "verified" ? "secondary" : "primary"}
        size="lg"
        fullWidth
        icon={state === "verified" ? UserCheck : state === "error" ? RefreshCw : Shield}
        isLoading={state === "requesting" || state === "polling"}
        className="py-6 text-xl shadow-2xl shadow-brand/20 rounded-2xl"
      >
        {label}
      </Button>

      {connectorURI && (
        <div className="rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl p-8 space-y-6 shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-30 animate-pulse"></div>
          
          <div className="space-y-2 text-center">
            <h4 className="text-white font-black text-lg tracking-tight">Scan Secure QR</h4>
            <p className="text-slate-400 text-xs font-medium px-4">
              Open the World App on your mobile device and scan the code below to finalize your personhood verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl w-fit mx-auto shadow-inner border-8 border-slate-950/20 group-hover:scale-[1.02] transition-transform duration-500">
            <QRCode 
              value={connectorURI} 
              size={200} 
              fgColor="#0f172a" 
              level="H"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="white"
              size="md"
              className="!rounded-xl text-xs gap-2"
              onClick={() => window.open(connectorURI, "_blank")}
              icon={ExternalLink}
            >
              Open App
            </Button>
            <Button
              variant="glass"
              size="md"
              className="!rounded-xl text-xs gap-2 border-white/5 hover:bg-white/10"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(connectorURI);
                } catch {
                  // ignore
                }
              }}
              icon={Copy}
            >
              Copy Link
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-rose-400 font-bold text-center flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {error}
          </p>
        </div>
      )}

      {/* Dev Reset - helps testing the flow multiple times */}
      <div className="pt-8 text-center">
        <button
          onClick={() => setIsVerified(false)}
          className="text-[10px] text-slate-600 hover:text-rose-400 font-black uppercase tracking-[0.2em] transition-colors"
        >
          Reset Verification Status (Dev)
        </button>
      </div>
    </div>
  );
}

