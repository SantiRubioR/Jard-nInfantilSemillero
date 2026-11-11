"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  initialActionState,
  type ActionState,
} from "@/lib/action-state";
import type { ServiceResult } from "@/lib/result";
import { getCurrentUser, signIn, signOut, watchAuthState } from "./auth.service";
import type { LoginInput } from "./auth.schemas";
import type { AuthUser } from "./auth.types";

export function useLoginViewModel() {
  const [state, setState] = useState<ActionState>(initialActionState);
  const [pending, setPending] = useState(false);

  const submit = useCallback(
    async (input: LoginInput): Promise<ServiceResult<AuthUser>> => {
      setPending(true);
      const result = await signIn(input);
      setPending(false);

      if (result.ok) {
        setState({ status: "success", message: "Sesión iniciada correctamente." });
      } else {
        setState({ status: "error", message: result.message });
      }

      return result;
    },
    [],
  );

  return { state, pending, submit };
}

export function useAdminGuardViewModel(callbacks: {
  onUnauthenticated: () => void;
}) {
  const callbacksRef = useRef(callbacks);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("modo-demo@jardinsemillero.local");

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    let active = true;

    getCurrentUser().then((result) => {
      if (!active) return;

      if (result.ok && result.data) {
        setEmail(result.data.email);
        setReady(true);
        return;
      }

      setReady(false);
      callbacksRef.current.onUnauthenticated();
    });

    const unsubscribe = watchAuthState((user) => {
      if (!active) return;

      if (user) {
        setEmail(user.email);
        setReady(true);
      } else {
        setReady(false);
        callbacksRef.current.onUnauthenticated();
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { ready, email };
}

export function useAdminSidebarViewModel(callbacks: {
  onSignedOut: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await signOut();
    setPending(false);
    callbacks.onSignedOut();
  }

  return { pending, signOut: handleSignOut };
}
