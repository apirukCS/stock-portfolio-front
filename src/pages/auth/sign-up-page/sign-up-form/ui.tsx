import { useState } from "react";
import "./ui.scss";
import AppButton from "../../../../components/button";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../../../components/tooltip";
import { useSignUp } from "../../../../services/auth/auth-service";

export default function SignUpForm() {
  const navigate = useNavigate();
  const signUp = useSignUp();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState({
    username: false,
    password: false,
    email: false,
  });

  const onSubmit = async () => {
    if (!email || !password) return;
    signUp.mutate({
      username: username,
      email: email,
      password: password,
    });
  };

  return (
    <div>
      <div className="card">
        <h1 className="title pb-1">ลงทะเบียน</h1>

        <div className={`input-wrapper ${focus.username ? "focused" : ""}`}>
          <div className="input-inner">
            <span className="input-label">ชื่อผู้ใช้งาน</span>
            <input
              className="input-field"
              value={username}
              placeholder="กรุณากรอกชื่อผู้ใช้งาน"
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocus({ ...focus, username: true })}
              onBlur={() => setFocus({ ...focus, username: false })}
            />
          </div>
        </div>

        <div className={`input-wrapper ${focus.password ? "focused" : ""}`}>
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

        <div className={`input-wrapper ${focus.email ? "focused" : ""}`}>
          <div className="input-inner">
            <div className="flex gap-1">
              <span className="input-label">อีเมล</span>
              <Tooltip text={"ใช้ยืนยันตัวตนเพื่อเปลี่ยนรหัสผ่าน"} />
            </div>
            <input
              className="input-field"
              type="email"
              value={email}
              placeholder="กรุณากรอกอีเมล"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocus({ ...focus, email: true })}
              onBlur={() => setFocus({ ...focus, email: false })}
            />
          </div>
        </div>

        <div className="pb-1">
          <AppButton
            bgColor="#ffffff"
            color="#000000"
            onClick={onSubmit}
            isLoading={signUp.isPending}
          >
            <div className="fw-semibold">ลงทะเบียน</div>
          </AppButton>
          <div className="pb-1"></div>
          <AppButton
            bgColor="transparent"
            onClick={() => navigate("/auth/sign-in")}
          >
            <div className="text-sm fw-semibold text-gray-400">กลับไปยังหน้าเข้าสู่ระบบ</div>
          </AppButton>
        </div>
      </div>
    </div>
  );
}
