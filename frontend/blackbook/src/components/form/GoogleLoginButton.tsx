import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleLogin } from "../../hooks/api/auth/useGoogleLogin";

export function GoogleLoginButton() {
  const { mutate: login, isPending, error } = useGoogleLogin();
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      console.error("idToken required.");
      return;
    }
    login(idToken);
  };
  return (
    <div className="my-4">
      <GoogleLogin onSuccess={handleSuccess}  />
    </div>
  );
}
