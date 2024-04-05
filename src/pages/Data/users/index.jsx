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
const Users = () => {
  // Variables.
  const context = useContext(LanguageContext);
  const cookies = new Cookies();
  const theme = useTheme();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const colors = tokens(theme.palette.mode);
  const usersData = useSelector((state) => state.allUsers.data.All_Users);
  const state = useSelector((state) => state.allUsers);
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
      field: "role",
      headerName: context.language === "en" ? "Access Level" : "الدور",
      flex: 2,
      renderCell: ({ row: { role, _id } }) => {
        return (
          <Box
            width="60%"
            p="5px"
            display="flex"
            backgroundColor={
              role === 5050
                ? theme.palette.mode === "dark"
                  ? colors.whiteAccent[900]
                  : colors.whiteAccent[100]
                : role === 5000
                ? colors.primary[800]
                : role === 2001
                ? colors.primary[500]
                : colors.whiteAccent[700]
            }
            borderRadius="4px"
          >
            {role === 5050 ? (
              <AdminPanelSettingsOutlinedIcon />
            ) : role === 2500 ? (
              <LocalShippingOutlinedIcon />
            ) : role === 5000 ? (
              <CurrencyPoundIcon />
            ) : (
              <PersonOutlineOutlinedIcon />
            )}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role === 5050
                ? context.language === "en"
                  ? "Admin"
                  : "مسئول"
                : role === 2500
                ? context.language === "en"
                  ? "SR"
                  : "مندوب"
                : role === 5000
                ? context.language === "en"
                  ? "Accountant"
                  : "محاسب"
                : context.language === "en"
                ? "User"
                : "مستخدم"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: context.language === "en" ? "Actions" : "أجراءات",
      renderCell: ({ row: { _id, username } }) => {
        return (
          <Box>
            <Tooltip title="Delete" placement="right">
              <IconButton
                onClick={() => {
                  setFormOpen(!formOpen);
                  setUserDetails({ id: _id, name: username });
                }}
              >
                <DeleteIcon sx={{ color: "#B22222" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Functions

  const handleDeleteUser = async (_id) => {
    await dispatch(deleteUser({ _id })).then(() => {
      dispatch(fetchallUsers());
      setFormOpen(!formOpen);
    });
  };

  useEffect(() => {
    dispatch(fetchallUsers());
  }, [dispatch]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={context.language === "en" ? "USERS" : "مستخدمون"}
          subtitle={
            context.language === "en" ? "Manage Users" : "التحكم في المستخدمون"
          }
        />
        <Box>
          <Button
            sx={{
              display:
                cookies.get("_auth_role") === "5050" ? "inlineblock" : "none",
              backgroundColor: colors.whiteAccent[900],
              color: colors.primary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => navigator("/addusers")}
          >
            {context.language === "en" ? "ADD USER" : "اضافه مستخدم"}
            <AddIcon sx={{ mr: "10px" }} />
          </Button>
        </Box>
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
        <Dialog
          open={formOpen}
          onClose={() => setFormOpen(!formOpen)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete <span style={{ color: "red" }}>{userDetails.name}?</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(!formOpen)}>Cancle</Button>
            <Button
              onClick={() => handleDeleteUser(userDetails.id)}
              autoFocus
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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

export default Users;
