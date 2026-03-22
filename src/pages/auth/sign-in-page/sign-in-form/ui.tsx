import { useState } from "react";
import "./ui.scss";
import AppButton from "../../../../components/button";
import { useSignIn } from "../../../../services/auth/auth-service";

export default function SignInForm() {
  const signIg = useSignIn();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState({
    username: false,
    password: false,
  });

  const onSubmit = async () => {
    if (!username || !password) return;
    signIg.mutate({
      username: username,
      password: password,
    });
  };

  return (
    <div>
      <div className="card">
        <h1 className="title">บันทึกการซื้อขายหุ้น</h1>
        <p className="subtitle">
          บันทึกการซื้อขายหุ้น พร้อมดูผลรวมพอร์ตข่าวสารหุ้นของคุณ
        </p>

        <div className={`input-wrapper ${focus.username ? "focused" : ""}`}>
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
        </div>

        <div>
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
        </div>
        <br></br>

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
        </div>

        <div className="footer">
          ยังไม่มีบัญชีผู้ใช้งานใช่หรือไม่?{" "}
          <a href="/auth/sign-up">ลงทะเบียน</a>
        </div>
      </div>
    </div>
  );
}
