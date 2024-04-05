import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import Header from "./../../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSrOrders } from "./../../../apis/Orders/SrOrders";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import Cookies from "universal-cookie";
import { tokens } from "../../../theme";
import { useTheme } from "@emotion/react";
import { useContext } from "react";
import { LanguageContext } from "../../../language";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { archiveSrOrder } from "./../../../apis/Orders/ArchiveSrOrders";
const SrOrders = () => {
  // Variables
  const dispatch = useDispatch();
  const State = useSelector((state) => state.allSrOrders);
  const cookies = new Cookies();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const context = useContext(LanguageContext);
  const [snackbaropen, setsnackbaropen] = useState(false);
  const [snackbarmessage, setsnackbarmessage] = useState("");
  const [snackbarstatus, setsnackbarstatus] = useState("");

  const navigator = useNavigate();
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "SR UserName",
      headerName: "Name",
      valueGetter: (data) => data.row.SR_username,
    },
    {
      field: "SR Email",
      headerName: "Name",
      valueGetter: (data) => data.row.SR_email,
      flex: 1,
    },
    {
      field: "SR Phone",
      headerName: "Phone",
      flex: 1,
      valueGetter: (data) => data.row.SR_phone,
    },
    { field: "remainAmount", headerName: "Remainder", flex: 1 },
    { field: "productsQuantity", headerName: "Quantity", flex: 1 },
    {
      field: "date",
      headerName: "DATE",
      flex: 1,
      renderCell: ({ row: { date } }) => {
        const liveMonth = new Date().getMonth() + 1;
        const currentMonth = new Date(date).getMonth() + 1;
        return (
          <Box
            sx={
              currentMonth > liveMonth ? { color: "red" } : { color: "white" }
            }
          >
            {date.substring(0, 10)}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row: { _id } }) => {
        return (
          <>
            {/* <Tooltip title="View" placement="left">
              <IconButton onClick={() => console.log(_id)}>
                <VisibilityIcon
                  sx={
                    theme.palette.mode === "dark"
                      ? { color: "cyan" }
                      : { color: "blue" }
                  }
                />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Archive" placement="top">
              <IconButton onClick={() => handleArchiveOrder(_id)}>
                <ArchiveOutlinedIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
      flex: 1,
    },
  ];

  const handleArchiveOrder = async (_id) => {
    dispatch(archiveSrOrder({ _id })).then((res) => {
      if (res.payload.status === 200) {
        dispatch(fetchSrOrders());
      } else if (res.payload.status === 409) {
        setsnackbarstatus("error");
        setsnackbarmessage(
          context.language === "en"
            ? "This SR still has money to pay."
            : "لم يسدد هذا المندوب كل ما عليه."
        );
        setsnackbaropen(true);
      }
    });
  };

  //Functions

  useEffect(() => {
    dispatch(fetchSrOrders());
  }, [dispatch]);
  return (
    <Box m="20px">
      <Snackbar
        color={snackbarstatus}
        open={snackbaropen}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: context.language === "en" ? "right" : "left",
        }}
        autoHideDuration={3000}
        onClose={() => setsnackbaropen(false)}
      >
        <Alert
          severity={snackbarstatus}
          sx={{
            background: "red",
            color: "white",
            "&& .MuiAlert-icon": { color: "white" },
            direction: "ltr",
            fontSize: 15,
          }}
        >
          {snackbarmessage}
        </Alert>
      </Snackbar>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={
            context.language === "en" ? "Sales Representatives" : "المندوبين"
          }
          subtitle={
            context.language === "en" ? "Manage SR" : "التحكم في المندوبين"
          }
        />
        <Box>
          <Button
            sx={{
              display:
                cookies.get("_auth_role") === "5000" ? "inlineblock" : "none",
              backgroundColor: colors.whiteAccent[900],
              color: colors.primary[200],
              fontSize: "14px",
              fontWeight: "bold",
              p: "10px 20px",
            }}
            onClick={() => navigator("/addsrorder")}
          >
            {context.language === "en" ? "ADD SR ORDER" : "اضافه طلب للمندوب"}
            <AddIcon sx={{ mr: "10px" }} />
          </Button>
        </Box>
      </Box>
      <Box marginTop="10px" height="70vh">
        {State.loading ? (
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
        ) : State.data.orders ? (
          <DataGrid
            disableSelectionOnClick
            checkboxSelection
            rows={State.data.orders
              .filter((o) => !o.archived)
              .map((o, index) => ({
                id: index + 1,
                ...o,
              }))}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        ) : (
          <DataGrid rows={[]} columns={[]} />
        )}
      </Box>
    </Box>
  );
};

export default SrOrders;
