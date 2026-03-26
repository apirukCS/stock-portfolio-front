import "./ui.scss";
import { GoogleSignInButton } from "./google-sign-in-button";

export default function SignInForm() {
  return (
    <div>
      <div className="card">
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
        <div className="flex items-center my-9">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <span className="mx-4 text-white">เข้าสู่ระบบ</span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        <GoogleSignInButton />
        {/* <button
          onClick={() => googleLogin()}
          className="w-full py-3.5 px-6 text-sm sm:text-base bg-white text-gray-600 rounded-[40px] flex items-center justify-center gap-5 font-semibold shadow-2xl hover:shadow-3xl hover:bg-white/90 transition-all duration-300 border border-white/30 backdrop-blur-sm"
          disabled={signIg.isPending}
        >
          {signIg.isPending ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          ) : (
            <>
              <img src={logoGoogle} alt="logo-google.png" width={22} />
              เข้าสู่ระบบด้วย Google
            </>
          )}
        </button> */}
      </div>
    </div>
  );
}
