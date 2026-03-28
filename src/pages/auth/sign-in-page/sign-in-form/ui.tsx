import "./ui.scss";
import { useSignIn } from "../../../../services/auth/auth-service";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";

export default function SignInForm() {
  const signIg = useSignIn();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(320);

  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth);
    }
  }, []);

  const onSubmit = async (idToken: string) => {
    if (!idToken) return;
    signIg.mutate({ idToken: idToken });
  };

  return (
    <div>
      <div className="card" ref={cardRef}>
        <h1
          className="
  text-[28px] font-semibold text-white 
  text-center 
  leading-[1.1] 
  mb-2.5 
  tracking-[-0.5px]
  sm:text-[36px]
"
        >
          บันทึกการซื้อขายหุ้น
        </h1>
        <p className="subtitle">
          จัดการพอร์ตพร้อมดูข่าวสารหุ้นและสรุปกำไร/ขาดทุน
          เพื่อใช้เป็นตัวช่วยการยื่นภาษีและจัดทำบัญชีของคุณ
        </p>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <span className="mx-4 text-white">เข้าสู่ระบบ</span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full">
            <GoogleLogin
              onSuccess={(res) => onSubmit(res?.credential ?? "")}
              size="large"
              type="standard"
              theme="outline"
              width={Math.min(cardWidth - 48, 400)}
              auto_select={false}
              useOneTap={false}
              containerProps={{
                style: {
                  backgroundColor: "transparent",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                },
              }}
              onError={() => {
                toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ", {
                  duration: 3000,
                  position: "top-right",
                });
              }}
              shape="rectangular"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
