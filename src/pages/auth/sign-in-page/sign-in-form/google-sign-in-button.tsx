import { useEffect } from "react";
import { useSignIn } from "../../../../services/auth/auth-service";

export function GoogleSignInButton() {
  const useSignInMutation = useSignIn();
  const handleCredentialResponse = (response: any) => {
    console.log("response ", response);

    const idToken: string = response.credential;
    console.log("idToken ", idToken);
    useSignInMutation.mutate({ idToken: idToken });
  };

  useEffect(() => {
    window.handleCredentialResponse = handleCredentialResponse;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="g_id_onload"
      data-client_id="507156469512-bdnoqanvpa9mjae8jnb17rpotcchndcm.apps.googleusercontent.com"
      data-callback="handleCredentialResponse"
      data-auto_select="true"
      data-use_one_tap="true"
    >
      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="continue_with"
        data-shape="pill"
      />
    </div>
  );
}
