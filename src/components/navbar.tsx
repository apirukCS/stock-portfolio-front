import { useEffect, useState } from "react";
import { useConfirmAlertDialog } from "../dialogs/confirm-alert-dialog";
import { useNavigate } from "react-router-dom";
import graphIcon from "../assets/svg/graph-icon.svg";
import editIcon from "../assets/svg/edit-icon.svg";
import signOutIcon from "../assets/images/sign-out.png";
import { USER_NAME } from "../utils/const/local-storage-const";
import {
  useGetTarget,
  useUpdateTarget,
} from "../services/target/target-service";
import { useMixedNews } from "../hooks/useStockNews";
import { useStockContext } from "../contexts/stock-context";

export const Navbar = () => {
  const { confirm, ConfirmAlertDialog } = useConfirmAlertDialog();
  const navigation = useNavigate();
  const username = localStorage.getItem(USER_NAME);
  const onSignOut = async () => {
    const isConfirm = await confirm("คุณต้องการออกจากระบบใช่หรือไม่");
    if (isConfirm) {
      localStorage.clear();
      navigation("/");
    }
  };
  return (
    <div className="navbar navbar-bg-color flex items-center gap-4 px-4">
      <ConfirmAlertDialog />

      {/* ซ้าย */}
      <img src={graphIcon} alt="graph-icon.svg" className="flex-shrink-0" />

      {/* 🔥 กลาง (ticker ต้อง shrink ได้) */}
      <div className="flex-1 min-w-0">
        <StockNewsTicker />
      </div>

      {/* ขวา */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {username && (
          <div className="w-[30px] h-[30px] rounded-full bg-[#7949FF] flex items-center justify-center text-white font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:inline-flex text-white text-sm">
          {username ? username.trim().split(/\s+/)[0] : "-"}
        </span>

        <button
          onClick={() => onSignOut()}
          className="sm:border sm:rounded-[8px] sm:border-[#1E1E24] sm:px-4 sm:py-2 text-sm min-w-[20px] text-center transition-colors hover:cursor"
        >
          <img
            className="sm:hidden"
            src={signOutIcon}
            alt="sign-out"
            width={20}
          />
          <label className="hidden sm:inline hover:cursor-pointer">
            ออกจากระบบ
          </label>
        </button>
      </div>
    </div>
  );
};

export function StockNewsTicker() {
  const { stocks } = useStockContext();
  const symbols = stocks.map((s) => `${s.name.toUpperCase()}`);
  const { data, isLoading } = useMixedNews(symbols);
  const username = localStorage.getItem(USER_NAME);

  const getFallbackContent = () => {
    if (!stocks.length) {
      return (
        <div className="text-white text-sm flex items-center gap-2">
          👋 สวัสดีคุณ {username} เริ่มต้นด้วยการเพิ่มหุ้นที่คุณซื้อขาย
          โดยการกดปุ่ม{" "}
          <span className="text-yellow-400 font-bold">เพิ่มรายการหุ้น</span>
          ได้เลย!
        </div>
      );
    }

    return (
      <div className="text-white text-sm flex items-center gap-3">
        📈 ติดตามข่าวสารหุ้น {symbols.slice(0, 3).join(", ")}
        {symbols.length > 3 && ` และ ${symbols.length - 3} หุ้นอื่นๆ`}
        <span className="text-yellow-400">⏳ กำลังอัพเดท...</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-white flex items-center gap-3 animate-pulse">
        <div className="w-14 h-10 bg-gray-700 rounded animate-pulse"></div>
        <span className="text-sm">กำลังโหลดข่าวสาร...</span>
      </div>
    );
  }

  if (!symbols?.length) {
    return (
      <div className="overflow-hidden w-full bg-black py-2">
        <div className="flex gap-6">{getFallbackContent()}</div>
      </div>
    );
  }

  // 🔥 ใหม่: มี stocks แต่ไม่มี news data
  if (data && !data.length) {
    return (
      <div className="overflow-hidden w-full bg-black py-2">
        <div className="flex gap-6">
          <div className="text-white text-sm flex items-center gap-3">
            ไม่พบข่าวสารสำหรับหุ้น: {symbols.slice(0, 2).join(", ")}
            {symbols.length > 2 && ` และ ${symbols.length - 2} หุ้นอื่นๆ`}
            <br />
            <strong>ฉันแนะนำ:</strong>ให้ใช้ชื่อหุ้น
            <span className="text-yellow-400">(สัญลักษณ์หุ้น)</span>
            ที่ถูกต้อง เช่น NVDA, AAPL, BE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden w-full bg-black py-2">
      <div className="ticker flex gap-6">
        {data?.slice(0, 15).map((n: any, index: number) => {
          const isStock = symbols.includes(n.related);
          return (
            <a
              key={index}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 min-w-max group"
            >
              {n.image && (
                <img
                  src={n.image || "https://via.placeholder.com/60"}
                  alt=""
                  className="w-14 h-10 object-cover rounded"
                />
              )}
              <div className="flex items-center gap-2">
                {isStock && (
                  <span className="text-yellow-400 font-bold">
                    [{n.related}]
                  </span>
                )}
                <span className="text-white group-hover:underline">
                  {n.headline}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition">
                  🔗
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function EditableTarget() {
  const { data: target, isLoading } = useGetTarget();
  const updateTarget = useUpdateTarget();
  const [isEditing, setIsEditing] = useState(false);

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(target ?? "");

    if (!(target ?? "").trim()) {
      setErrorTarget();
    }
  }, [target]);

  const [hover, setHover] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) {
      setErrorTarget();
    }

    setError(false);
    setIsEditing(false);
    updateTarget.mutate(value);
  };

  const setErrorTarget = () => {
    if (!value.trim()) {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 400);

      return;
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-2 relative group mx-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {(isEditing || !target) && !isLoading ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ระบุเป้าหมายของคุณ"
          onBlur={handleSubmit}
          className={`px-2 py-1 rounded bg-gray-800 text-white outline-none
            border ${error ? "animate-shake-invalid" : "border-gray-600"}`}
        />
      ) : (
        <div className="text-white line-clamp-1">{value}</div>
      )}

      {!isEditing && hover && target && (
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 rounded hover:bg-gray-700 transition"
        >
          <img src={editIcon} alt="edit-icon.svg" />
        </button>
      )}
    </div>
  );
}
