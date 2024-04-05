import { useContext, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {
  BarChartOutlined,
  MenuOutlined,
  PieChartOutlineOutlined,
  StackedLineChartOutlined,
} from "@mui/icons-material";
import Cookies from "universal-cookie";
import { LanguageContext } from "../../language";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTotalPrice } from "../../apis/Accountant/GetTotalPrice";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={window.location.pathname === to ? (selected = title) : null}
      style={{ color: colors.grey[100] }}
      onClick={() =>
        window.location.pathname === to ? setSelected(title) : setSelected(null)
      }
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  // //Variables
  const context = useContext(LanguageContext);
  const navigator = useNavigate();
  const [totalPrice, setTotalPrice] = useState("");
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(window.location.pathname);

  useEffect(() => {
    dispatch(fetchTotalPrice()).then((res) => {
      if (res.payload.status === 200) {
        setTotalPrice(res.payload.data.totalPrice);
      }
    });
  }, [dispatch]);

  return (
    <Box
      sx={{
        height: "963px",
        "& .pro-sidebar-inner": {
          background: `${colors.whiteAccent[900]} !important`,
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item":
          context.language === "en"
            ? { padding: "5px 35px 5px 20px !important" }
            : { padding: "5px 20px 5px 35px !important", textAlign: "right" },
        "& .pro-inner-item:hover": {
          color: `${colors.primary[500]} !important`,
        },
        "& .pro-menu-item.active": { color: "#307a59 !important" },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* Logo and Icon */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlined /> : undefined}
            style={{ margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {context.language === "en" ? "Family Foods" : "فاميلي فودز"}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {/* User */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  // src={theme.palette.mode === "dark" ? `../../assets/logo-dark.png` : `../../assets/logo-light.png`}
                  src="../../assets/logo-light.png"
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onClick={() => navigator("/")}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {cookies.get("_auth_verify")}
                </Typography>
                <Typography
                  onClick={() => "first"}
                  value="en"
                  variant="h5"
                  color={colors.primary[500]}
                >
                  {cookies.get("_auth_role") === "5050"
                    ? context.language === "en"
                      ? "Admin"
                      : "مسئول"
                    : context.language === "en"
                    ? "Accountant"
                    : "محاسب"}
                </Typography>
                {cookies.get("_auth_role") === "5000" && (
                  <Typography>Totale Price : {totalPrice}</Typography>
                )}
              </Box>
            </Box>
          )}
          {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {cookies.get("_auth_role") !== "5000" && (
              <Item
                title={context.language === "en" ? "Dashboard" : "الرئيسيه"}
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={
                context.language === "en"
                  ? { m: "15px 0 5px 20px" }
                  : { m: "15px 32px 5px 0", textAlign: "right" }
              }
            >
              {context.language === "en" ? "DATA" : "البيانات"}
            </Typography>
            <Item
              title={
                cookies.get("_auth_role") !== "5000"
                  ? context.language === "en"
                    ? "Users"
                    : "مستخدمون"
                  : context.language === "en"
                  ? "Sales Representatives"
                  : "جميع المندوبين"
              }
              to={cookies.get("_auth_role") === "5000" ? "/" : "/users"}
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title={context.language === "en" ? "Products" : "منتجات"}
              to="/products"
              icon={<ShoppingCartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {cookies.get("_auth_role") === "5000" ? (
              <>
                <Item
                  title={
                    context.language === "en"
                      ? "Accounting Manager"
                      : "مستلزمات المحاسب"
                  }
                  to="/accountant"
                  icon={<AttachMoneyOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title={
                    context.language === "en"
                      ? "Transactions"
                      : "التحويلات"
                  }
                  to="/transacions"
                  icon={<CurrencyExchangeIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            ) : null}
            {cookies.get("_auth_role") === "5050" ? (
              <Item
                title={context.language === "en" ? "Reports" : "شكاوي"}
                to="/reports"
                icon={<ReportOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            ) : null}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={
                context.language === "en"
                  ? { m: "15px 0 5px 20px" }
                  : { m: "15px 32px 5px 0", textAlign: "right" }
              }
            >
              {context.language === "en" ? "Orders" : "طلبات"}
            </Typography>
            {cookies.get("_auth_role") === "5000" ? (
              <>
                <Item
                  title={
                    context.language === "en" ? "Sr Orders" : "طلبات المندوبين"
                  }
                  to="/srorders"
                  icon={<LocalShippingOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title={
                    context.language === "en" ? "Sr Archive" : "ارشيف المندوبين"
                  }
                  to="/srarchive"
                  icon={<ArchiveOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            ) : (
              <>
                <Item
                  title={context.language === "en" ? "Orders" : "الطلبات"}
                  to="/orders"
                  icon={<ShoppingBagIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title={context.language === "en" ? "Archive" : "ارشيف"}
                  to="/archive"
                  icon={<ArchiveOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            {cookies.get("_auth_role") === "5050" ? (
              <>
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={
                    context.language === "en"
                      ? { m: "15px 0 5px 20px" }
                      : { m: "15px 25px 5px 0", textAlign: "right" }
                  }
                >
                  {context.language === "en" ? "Charts" : "رسم بياني"}
                </Typography>
                <Item
                  title={context.language === "en" ? "Pie Chart" : "رسم دائري"}
                  to="/pie"
                  icon={<PieChartOutlineOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* <Item
                 title={context.language === "en" ? "Line Chart" : "رسم خطي"}
                  to="/line"
                  icon={<StackedLineChartOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title={context.language === "en" ? "Bar Chart" : "رسم بياني"}
                  to="/bar"
                  icon={<BarChartOutlined />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            ) : null}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
