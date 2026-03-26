// import { useState } from "react";
import "./ui.scss";
// import { useSignIn } from "../../../../services/auth/auth-service";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { toast } from "react-hot-toast";
import { GoogleSignInButton } from "./google-sign-in-button";

export default function SignInForm() {
  // const signIg = useSignIn();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const clientId =
  //   "507156469512-bdnoqanvpa9mjae8jnb17rpotcchndcm.apps.googleusercontent.com";
  // const [idToken, setIdToken] = useState("");
  // const [focus, setFocus] = useState({
  //   username: false,
  //   password: false,
  // });

  // const onSubmit = async (idToken: string) => {
  //   if (!idToken) return;
  //   signIg.mutate({ idToken: idToken });
  // };

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
        <GoogleSignInButton/>
        {/* <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            onSuccess={(res) => onSubmit(res?.credential ?? "")}
            size="large"
            type="standard"
            theme="filled_blue"
            onError={() => {
              toast.success("เกิดข้อผิดพลาดบางอย่าง", {
                duration: 3000,
                position: "top-right",
              });
            }}
            shape="rectangular"
          />
        </GoogleOAuthProvider> */}
        {/* <div className="footer">
          ยังไม่มีบัญชีผู้ใช้งานใช่หรือไม่?{" "}
          <a href="/auth/sign-up">ลงทะเบียน</a>
        </div> */}
      </div>
    </div>
  );
}
