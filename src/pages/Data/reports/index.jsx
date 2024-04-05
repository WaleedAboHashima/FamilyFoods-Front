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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "./../../../components/Header";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchGetReports } from "./../../../apis/Report/GetReports";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { fetchDeleteReport } from "../../../apis/Report/DeleteReport";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";

const Reports = () => {
  const dispatch = useDispatch();
  const State = useSelector((state) => state.getReport);
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);
  const [editFormOpen, seteditFormOpen] = useState(false);
  const [report, setReport] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "message", headerName: "Message", flex: 1 },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row: { _id, message, username } }) => {
        return (
          <Box>
            <Tooltip title="View" placement="left">
              <IconButton
                onClick={() => {
                  seteditFormOpen(!editFormOpen);
                  setReport({ id: _id, message: message, username: username });
                }}
              >
                <VisibilityOutlinedIcon sx={{ color: "cyan" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="right">
              <IconButton
                onClick={() => {
                  setDeleteFormOpen(!deleteFormOpen);
                  setReport({ id: _id, message: message, username: username });
                }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];
  // Functions

  const handleDeleteReport = async (id) => {
    await dispatch(fetchDeleteReport({ id })).then(() => {
      setDeleteFormOpen(!deleteFormOpen);
      dispatch(fetchGetReports());
    });
  };

  useEffect(() => {
    dispatch(fetchGetReports());
  }, [dispatch]);
  return (
    <Box m="20px">
      <Header title="Reports" subtitle="All Reports are listed blow" />
      <Box mt="40px" height="75vh">
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
        ) : State.data.Reports ? (
          <DataGrid
            rows={State.data.Reports.map((rep, index) => ({
              id: index + 1,
              ...rep,
            }))}
            columns={columns}
            getRowId={(row) => row._id}
            components={{ Toolbar: GridToolbar }}
          ></DataGrid>
        ) : (
          <DataGrid
            rows={[]}
            columns={[]}
            components={{ Toolbar: GridToolbar }}
          ></DataGrid>
        )}
        <Dialog
          open={deleteFormOpen}
          onClose={() => setDeleteFormOpen(!deleteFormOpen)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete the message from{" "}
            <span style={{ color: "red" }}>{report.username}?</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this message :{" "}
              <span style={{ color: "yellow" }}>{report.message}</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteFormOpen(!deleteFormOpen)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteReport(report.id)}
              autoFocus
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullWidth
          open={editFormOpen}
          onClose={() => seteditFormOpen(!editFormOpen)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Message from <span style={{ color: "red" }}>{report.username}</span>{" "}
            is :
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ color: "yellow" }}>{report.message}</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => seteditFormOpen(!editFormOpen)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Reports;
