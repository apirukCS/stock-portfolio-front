import { useEffect, useCallback, useRef, useState } from "react";
import { useSignIn } from "../../../../services/auth/auth-service";

export function GoogleSignInButton() {
  const useSignInMutation = useSignIn();
  const initialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const handleCredentialResponse = useCallback(
    (response: any) => {
      console.log(
        "✅ idToken received:",
        response.credential?.substring(0, 50) + "...",
      );
      const idToken = response.credential;
      useSignInMutation.mutate({ idToken });
    },
    [useSignInMutation],
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-gsi";
    document.head.appendChild(script);

    script.onload = () => {
      // Force disable FedCM ทุกทาง
      (window as any).google.accounts.id.initialize({
        client_id:
          "507156469512-bdnoqanvpa9mjae8jnb17rpotcchndcm.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        use_one_tap: false,
        cancel_on_tap_outside: false,
        // 🔥 DISABLE FEDCM ทุกตัวเลือก
        use_fedcm_for_prompt: false,
        supported_idp_signin_filename: undefined, // Disable FedCM endpoint
        state_cookie_domain: undefined,
      });
      setIsReady(true);
    };

    return () => {
      const existing = document.getElementById("google-gsi");
      existing?.remove();
    };
  }, [handleCredentialResponse]);

  const handleGoogleSignIn = async () => {
    if (!(window as any).google?.accounts?.id) {
      console.error("❌ Google GSI not loaded");
      return;
    }

    try {
      // Method 1: Legacy prompt (fallback)
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.log("🔄 FedCM blocked - fallback to manual");
          // Method 2: Force legacy iframe popup
          window.open(
            `https://accounts.google.com/o/oauth2/v2/auth?client_id=507156469512-bdnoqanvpa9mjae8jnb17rpotcchndcm.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=id_token&scope=openid email profile&nonce=123`,
            "google-popup",
            "width=500,height=600,scrollbars=yes,resizable=yes",
          );
        } else if (notification.isSkippedMoment()) {
          console.log("👆 User dismissed");
        }
      });
    } catch (error) {
      console.error("❌ Sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={!isReady}
      className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-xl px-6 py-3 text-sm font-medium text-gray-900 flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
        {/* Google SVG เหมือนเดิม */}
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <span>{isReady ? "Continue with Google" : "Loading..."}</span>
    </button>
  );
}
