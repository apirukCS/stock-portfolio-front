import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { StockProvider } from "../contexts/stock-context";
// import { mockTransaction, useCreateStockTransaction } from "../services/stock-transaction/stock-transaction-service";

export default function MainLayout() {
  // const transaction = useCreateStockTransaction();
  // for (let i = 0; i < 3; i++) {
  //   transaction.mutate(mockTransaction());
  // }

  return (
    <StockProvider>
      <div className="layout">
        <Navbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </StockProvider>
  );
}
