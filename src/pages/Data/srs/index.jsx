import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../../components/Header";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { fetchallUsers } from "../../../apis/Users/AllUsers";
import AddIcon from "@mui/icons-material/Add";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteUser } from "../../../apis/Users/DeleteUsers";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { LanguageContext } from "../../../language";
import { fetchAllSr } from "../../../apis/Accountant/GetAllSr";
const SR = () => {
  // Variables.
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  const theme = useTheme();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const colors = tokens(theme.palette.mode);
  const usersData = useSelector((state) => state.GetAllSr.data.SRs);
  const state = useSelector((state) => state.GetAllSr);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "username",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: context.language === "en" ? "Email" : "البريد الالكتروني",
      flex: 1,
    },
    {
      field: "phone",
      headerName: context.language === "en" ? "Phone" : "رقم الهاتف",
      type: "number",
      flex: 1,
    },
    {
      field: "remainAmount",
      headerName: context.language === "en" ? "Remainder" : "المتبقي",
      type: "number",
      flex: 1,
    },
  ];

  // Functions

  useEffect(() => {
    dispatch(fetchAllSr());
  }, [dispatch]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={
            context.language === "en" ? "Sales Representatives" : "المندوبين"
          }
          subtitle={
            context.language === "en"
              ? "Manage Sales Representatives"
              : "التحكم في المندوبين"
          }
        />
      </Box>
      <Box marginTop="10px" height="75vh">
        {state.loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "100%",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: colors.whiteAccent[100] }} />
          </Box>
        ) : usersData ? (
          <DataGrid
            autoPageSize
            disableRowSelectionOnClick
            disableSelectionOnClick
            checkboxSelection
            localeText={context.language === "en" ? null : arabicLocaleText}
            rows={usersData.map((user, index) => ({
              id: index + 1,
              ...user,
            }))}
            sx={{
              "& .MuiToolbar-root": {
                direction: "ltr",
              },
            }}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        ) : (
          <DataGrid
            rows={[]}
            columns={[]}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>
    </Box>
  );
};

const arabicLocaleText = {
  toolbarDensity: "كثافة",
  toolbarDensityLabel: "كثافة",
  toolbarDensityCompact: "مضغوط",
  toolbarDensityStandard: "معياري",
  toolbarDensityComfortable: "مريح",
  toolbarColumns: "أعمدة",
  toolbarFilters: "تصفية",
  filterOperatorAnd: "Custom And",
  filterOperatorOr: "Custom Or",
  filterValuePlaceholder: "Custom Value",
  toolbarFiltersTooltipHide: "إخفاء الفلاتر",
  toolbarFiltersTooltipShow: "عرض الفلاتر",
  noResultsOverlayLabel: "لا توجد نتائج",
  noRowsLabel: "لا تجود كروت اتصالات",
  toolbarFiltersTooltipActive: (count) =>
    `${count} ${count === 1 ? "فلتر" : "فلاتر"}`,
  toolbarExport: "تصدير",
  toolbarExportPrint: "طباعه",
  toolbarExportCSV: "CSV تنزيل",
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} صفوف محددة`
      : `${count.toLocaleString()} صف محدد`,
};

export default SR;
