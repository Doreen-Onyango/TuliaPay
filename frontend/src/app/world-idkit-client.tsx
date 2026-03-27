"use client";

import React, { useCallback, useState } from "react";
import { IDKit, IDKitErrorCodes, orbLegacy } from "@worldcoin/idkit-core";
import { useAtom } from "jotai";
import { isVerifiedHumanAtom } from "../store";
import QRCode from "react-qr-code";

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
    <div className="w-full space-y-3">
      <button
        onClick={handleClick}
        disabled={isVerified || state === "requesting" || state === "polling"}
        className="w-full py-5 bg-brand text-white font-black rounded-2xl hover:bg-brand-light transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {label}
      </button>
      {connectorURI && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md p-5 space-y-4">
          <p className="text-sm text-slate-300 font-bold text-center">
            Scan this QR with World App (or open the link) to complete verification.
          </p>
          <div className="bg-white p-4 rounded-2xl w-fit mx-auto">
            <QRCode value={connectorURI} size={180} />
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={connectorURI}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-white text-slate-950 font-black rounded-xl text-center"
            >
              Open in World App
            </a>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(connectorURI);
                } catch {
                  // ignore
                }
              }}
              className="w-full py-3 bg-slate-900 text-white font-black rounded-xl border border-slate-800"
            >
              Copy link
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-rose-400 font-medium text-center">{error}</p>
      )}
    </div>
  );
}

