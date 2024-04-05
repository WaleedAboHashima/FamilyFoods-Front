import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Header from "../../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { LanguageContext } from "../../../language";
import { fetchAllTransactions } from "./../../../apis/Accountant/GetAllTransactions";

const Transactions = () => {
  // Vairables
  const context = useContext(LanguageContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const productsData = useSelector((state) => state.GetAllTransaction.data.payments);
  const state = useSelector((state) => state.GetAllTransaction);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "Name",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 1,
      valueGetter: ({ row }) => row.user.username,
    },
    {
      field: "Email",
      headerName: context.language === "en" ? "Email" : "البريد الالكتروني",
      flex: 1,
      valueGetter: ({ row }) => row.user.email,
    },
    {
      field: "Phone",
      headerName: context.language === "en" ? "Phone" : "الهاتف",
      flex: 1,
      valueGetter: ({ row }) => row.user.phone,
    },
    {
      field: "Remaining",
      headerName: context.language === "en" ? "Remaining" : "المتبقي",
      flex: 1,
      valueGetter: ({ row }) => row.user.remainAmount,
    },
    {
      field: "Amount",
      headerName: context.language === "en" ? "Amount" : "التكلفه",
      flex: 1,
      valueGetter: ({ row }) => row.amount,
    },
  ];

  const filteredColumns =
    cookies.get("_auth_role") === "5050"
      ? columns
      : columns.filter((column) => column.field !== "actions");

  /* Functions */

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={context.language === "en" ? "TRANSACTIONS" : "التحويلات"}
          subtitle={
            context.language === "en"
              ? "Transactions are listed below."
              : "التحويلات مرصوصه بالاسفل."
          }
        />
        <Button
          sx={{
            // backgroundColor: colors.whiteAccent[700],
            backgroundColor: colors.whiteAccent[900],
            color: colors.primary[200],
            fontSize: "14px",
            fontWeight: "bold",
            p: "10px 20px",
            display:
              cookies.get("_auth_role") === "5050" ? "inlineblock" : "none",
          }}
          onClick={() => navigator("/addproduct")}
        >
          {context.language === "en" ? "ADD PRODUCTS" : "اضافه منتج"}
          <AddIcon sx={{ mr: "10px" }} />
        </Button>
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
        ) : productsData ? (
          <DataGrid
            disableRowSelectionOnClick
            disableSelectionOnClick
            checkboxSelection
            rows={productsData.map((product, index) => ({
              id: index + 1,
              ...product,
            }))}
            columns={filteredColumns}
            getRowId={(row) => row._id}
            components={{ Toolbar: GridToolbar }}
            localeText={context.language === "en" ? null : arabicLocaleText}
            autoPageSize
            sx={{
              "& .MuiToolbar-root": {
                direction: "ltr",
              },
            }}
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

export default Transactions;
