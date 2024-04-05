import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Logout, Settings } from "@mui/icons-material";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import TranslateIcon from "@mui/icons-material/Translate";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { LanguageContext } from "../../language";

const Topbar = () => {
  // Variables
  const theme = useTheme();
  const navigator = useNavigate();
  const cookies = new Cookies();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [dropmenu, setDropmenu] = useState(null);
  const context = useContext(LanguageContext);
  const open = Boolean(dropmenu);

  // Functions
  const handleClick = (event) => {
    if (dropmenu === null) {
      setDropmenu(event.currentTarget);
    } else {
      setDropmenu(null);
    }
  };

  const changeLanguage = (newLanguage) => {
      context.setLanguage(newLanguage);
  };

  const handleLogOut = () => {
    cookies.remove("token");
    cookies.remove("_auth_verify");
    cookies.remove("username");
    cookies.remove("_auth_id");
    cookies.remove("_auth_role");
    window.location.pathname = "/";
  };
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      ></Box>

      {/* Icons */}
      <Box display="flex">
        <Tooltip title={context.language === "en" ? "العربيه" : "English"}>
          <IconButton
            onClick={() =>
              changeLanguage(context.language === "en" ? "ar" : "en")
            }
          >
            {context.language === "en" ? <TranslateIcon /> : <GTranslateIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            context.language === "en"
              ? theme.palette.mode === "dark"
                ? "Light"
                : "Dark"
              : theme.palette.mode === "dark"
              ? "موضيئ"
              : "مظلم"
          }
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title={context.language === "en" ? "My Account" : "حسابي"}>
          <IconButton onClick={handleClick}>
            <PersonOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={dropmenu}
        open={open}
        onClose={handleClick}
        id="account-menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {context.language === "en" ? "Log Out" : "تسجيل الخروج"}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;
