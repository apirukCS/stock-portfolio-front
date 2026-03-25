import { useNavigate } from "react-router-dom";
import { api as axios } from "../axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ACCESS_TOKEN,
  USER_ID,
  USER_NAME,
} from "../../utils/const/local-storage-const";
import type { LoginResponse, SignUpData } from "./auth-service.model";

export const useSignUp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const res = await axios.post("/auth/register", data);
      return res.data;
    },
    onSuccess: (e: LoginResponse) => {
      toast.success("ลงทะเบียนสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      updateSessionAndUserOnLocalStorage(e);
      navigate("/app/list-stock");
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง", {
        duration: 3000,
        position: "top-right",
      });
    },
  });
};

export const useSignIn = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: { idToken: string }) => {
      console.log("call mutationFn");
      
      const res = await axios.post("/auth/google-login", data);
      return res.data;
    },
    onSuccess: (e: LoginResponse) => {
      toast.success("เข้าสู่ระบบสำเร็จ", {
        duration: 3000,
        position: "top-right",
      });
      updateSessionAndUserOnLocalStorage(e);
      navigate("/app/list-stock");
    },
    onError: () => {
      toast.error("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง", {
        duration: 3000,
        position: "top-right",
      });
    },
  });
};

export const useSignOut = async () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const res = await axios.post("/auth/logout", {});
      return res.data;
    },
    onSuccess: () => {
      // localStorage.clear();
      navigate("/");
    },
    onError: (err: any) => {
      toast.error(err || "เกิดข้อผิดพลาดบางอย่าง", {
        duration: 3000,
        position: "top-right",
      });
    },
  });
};

const updateSessionAndUserOnLocalStorage = (response: LoginResponse) => {
  localStorage.setItem(ACCESS_TOKEN, response.access_token ?? "");
  localStorage.setItem(USER_ID, response.user_id ? `${response.user_id}` : "");
  localStorage.setItem(USER_NAME, response.name ?? "");
};
