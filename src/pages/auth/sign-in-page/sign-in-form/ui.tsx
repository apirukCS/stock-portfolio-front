// import { useState } from "react";
import "./ui.scss";
import { useSignIn } from "../../../../services/auth/auth-service";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import { toast } from "react-hot-toast";

export default function SignInForm() {
  const signIg = useSignIn();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const clientId =
    "507156469512-bdnoqanvpa9mjae8jnb17rpotcchndcm.apps.googleusercontent.com";
  // const [idToken, setIdToken] = useState("");
  // const [focus, setFocus] = useState({
  //   username: false,
  //   password: false,
  // });

  const onSubmit = async (idToken: string) => {
    if (!idToken) return;
    signIg.mutate({ idToken: idToken });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => onSubmit(tokenResponse.access_token),
    onError: () => toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ"),
    flow: "implicit", // หรือ "auth-code"
  });

  return (
    <div>
      <div className="card">
        <h1 className="title">บันทึกการซื้อขายหุ้น</h1>
        <p className="subtitle">
          บันทึกการซื้อขายหุ้น พร้อมดูผลรวมพอร์ตและข่าวสารหุ้นของคุณ
        </p>
        {/* <div className={`input-wrapper ${focus.username ? "focused" : ""}`}>
          <div className="input-inner">
            <span className="input-label">ชื่อผู้ใช้งาน</span>
            <input
              className="input-field"
              type="email"
              value={username}
              placeholder="กรุณากรอกชื่อผู้ใช้งาน"
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocus({ ...focus, username: true })}
              onBlur={() => setFocus({ ...focus, username: false })}
            />
          </div>
        </div> */}
        {/* <div>
          <div
            className={`input-wrapper mb-0 ${focus.password ? "focused" : ""}`}
          >
            <div className="input-inner">
              <span className="input-label">รหัสผ่าน</span>
              <input
                className="input-field"
                type="password"
                value={password}
                placeholder="กรุณากรอกรหัสผ่าน"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocus({ ...focus, password: true })}
                onBlur={() => setFocus({ ...focus, password: false })}
              />
            </div>
          </div>
        </div> */}
        {/* <br></br>
        <div className="pb-4">
          <AppButton
            type="submit"
            bgColor="#ffffff"
            color="#000000"
            onClick={() => onSubmit()}
            isLoading={signIg.isPending}
          >
            <div className="fw-semibold">เข้าสู่ระบบ</div>
          </AppButton>
        </div> */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <span className="mx-4 text-white">เข้าสู่ระบบ</span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        {/* เมื่อ deploy ขึ้นไปแล้ว มันขยายไม่เต็มในบางที เมื่อเคยเลือก account ไปแล้ว */}
        <button
          onClick={() => googleLogin()}
          className="w-full py-3.5 px-6 bg-white text-gray-900 rounded-2xl flex items-center justify-center gap-3 font-semibold shadow-2xl hover:shadow-3xl hover:bg-white/90 transition-all duration-300 border border-white/30 backdrop-blur-sm"
          disabled={signIg.isPending}
        >
          {signIg.isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          ) : (
            <>
              <svg
                className="w-6 h-6 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a7 7 0 10-14 0 7.001 7.001 0 006 6.93V17H6v2h8v-2h-2v-.07z"
                  clipRule="evenodd"
                />
              </svg>
              เข้าสู่ระบบด้วย Google
            </>
          )}
        </button>
        {/* <div className="w-full max-w-xs mx-auto">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={(res) => onSubmit(res?.credential ?? "")}
              onError={() => {
                toast.success("เกิดข้อผิดพลาดบางอย่าง", {
                  duration: 3000,
                  position: "top-right",
                });
              }}
              theme="outline"
              shape="pill"
              width={"100%"}
              type="standard"
              text="signin_with"
              useOneTap
            />
          </GoogleOAuthProvider>
        </div> */}
        {/* <div className="footer">
          ยังไม่มีบัญชีผู้ใช้งานใช่หรือไม่?{" "}
          <a href="/auth/sign-up">ลงทะเบียน</a>
        </div> */}
      </div>
    </div>
  );
}
