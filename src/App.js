import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import Users from "./pages/Data/users";
import Products from "./pages/Data/products";
import Orders from "./pages/Data/orders";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/Error/index";
import Bar from "./pages/BarChart";
import Pie from "./pages/PieChart";
import Line from "./pages/LineChart/index";
import { isMobile } from "react-device-detect";
import Login from "./pages/Auth/Login";
import Cookies from "universal-cookie";
// Auth
import Forgot from "./pages/Auth/Forget";
import Reset from "./pages/Auth/Reset";
import Update from "./pages/Auth/Update";
// Products & Orders
import AddProduct from "./pages/Data/products/AddProduct";
import ArchivedOrders from "./pages/Data/orders/ArchivedOrders";
import Settings from "./pages/global/Settings";
import AddUsers from "./pages/Data/users/addusers";
import EditProduct from "./pages/Data/products/EditProduct";
import Reports from "./pages/Data/reports/index";
import Accountant from "./pages/Data/accountant/index";
import SrOrders from "./pages/Data/orders/SrOrders";
import ArchivedSrOrders from "./pages/Data/orders/ArchivedSrOrders";
import { useContext } from "react";
import { LanguageContext } from "./language";
import Addsrorder from "./pages/Data/orders/AddSrOrder";
import SR from "./pages/Data/srs";
import Transactions from './pages/Data/accountant/transactions';
function App() {
  const cookies = new Cookies();
  const [theme, colorMode] = useMode();
  const context = useContext(LanguageContext);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {cookies.get("_auth_verify") ? (
          isMobile ? (
            <div style={{ width: "100%", height: "100%" }}>
              PLEASE TURN ON DESKTOP MODE
            </div>
          ) : (
            <div
              className="App"
              dir={context.language === "en" ? "ltr" : "rtl"}
            >
              <Sidebar />
              <main
                className="content"
                dir={context.language === "en" ? "ltr" : "rtl"}
              >
                <Topbar />
                <Routes>
                  <Route path="/*" element={<ErrorPage />} />
                  <Route
                    exact
                    path={cookies.get("_auth_role") !== "5000" ? "/" : null}
                    element={<Dashboard />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path={cookies.get("_auth_role") === "5000" ? "/" : "/users"}
                    element={
                      cookies.get("_auth_role") === "5000" ? <SR /> : <Users />
                    }
                  />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/srorders" element={<SrOrders />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/archive" element={<ArchivedOrders />} />
                  <Route path="/srarchive" element={<ArchivedSrOrders />} />
                  <Route path="/addproduct" element={<AddProduct />} />
                  <Route path="/settings" element={<Settings />}></Route>
                  <Route path="/transacions" element={<Transactions />}></Route>
                  <Route path="/addusers" element={<AddUsers />} />
                  <Route path="/addsrorder" element={<Addsrorder />} />
                  <Route
                    path="/products/:productId"
                    element={<EditProduct />}
                  />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/accountant" element={<Accountant />} />
                </Routes>
              </main>
            </div>
          )
        ) : (
          <div dir={context.language === "en" ? "ltr" : "rtl"}>
            <Routes>
              <Route path="/*" element={<Login />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/update" element={<Update />} />
            </Routes>
          </div>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
