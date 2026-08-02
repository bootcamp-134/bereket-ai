"use client";

import { useEffect, useState } from "react";

type FormState =
  | { kind: "idle"; message: string }
  | { kind: "submitting"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function ResetPasswordForm({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [state, setState] = useState<FormState>({
    kind: "idle",
    message: "Bağlantı doğrulanıyor…",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const resetToken = params.get("token") ?? "";
    setToken(resetToken);
    setState(
      resetToken
        ? { kind: "idle", message: "Yeni şifrenizi belirleyebilirsiniz." }
        : {
            kind: "error",
            message: "Şifre yenileme bağlantısı eksik veya geçersiz.",
          },
    );
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (password.length < 12 || password.length > 128) {
      setState({ kind: "error", message: "Şifre 12–128 karakter olmalıdır." });
      return;
    }
    if (password !== confirmation) {
      setState({
        kind: "error",
        message: "Şifre alanları birbiriyle eşleşmiyor.",
      });
      return;
    }

    setState({
      kind: "submitting",
      message: "Şifreniz güvenli biçimde yenileniyor…",
    });
    try {
      const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!response.ok) throw new Error("reset_failed");
      setToken("");
      setPassword("");
      setConfirmation("");
      setState({
        kind: "success",
        message: "Şifreniz yenilendi. Mobil uygulamadan giriş yapabilirsiniz.",
      });
    } catch {
      setState({
        kind: "error",
        message:
          "Bağlantı geçersiz veya süresi dolmuş. Yeni bir bağlantı isteyin.",
      });
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <div>
        <label
          className="text-sm font-medium text-stone-200"
          htmlFor="password"
        >
          Yeni şifre
        </label>
        <input
          className="form-input"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={
            !token || state.kind === "submitting" || state.kind === "success"
          }
        />
        <p className="mt-2 text-xs text-stone-500">
          En az 12, en fazla 128 karakter.
        </p>
      </div>
      <div>
        <label
          className="text-sm font-medium text-stone-200"
          htmlFor="confirmation"
        >
          Yeni şifre tekrar
        </label>
        <input
          className="form-input"
          id="confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          disabled={
            !token || state.kind === "submitting" || state.kind === "success"
          }
        />
      </div>
      <button
        className="primary-link w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={
          !token || state.kind === "submitting" || state.kind === "success"
        }
      >
        {state.kind === "submitting" ? "Yenileniyor…" : "Şifreyi yenile"}
      </button>
      <p
        className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
          state.kind === "error"
            ? "border-red-300/15 bg-red-300/5 text-red-200"
            : state.kind === "success"
              ? "border-emerald-300/15 bg-emerald-300/5 text-emerald-200"
              : "border-white/8 bg-white/[0.025] text-stone-400"
        }`}
        aria-live="polite"
      >
        {state.message}
      </p>
    </form>
  );
}
