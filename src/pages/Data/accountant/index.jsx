import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllSr } from "../../../apis/Accountant/GetAllSr";
import { useState } from "react";
import { fetchAllProducts } from "../../../apis/Products/AllProducts";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { fetchAddSROrder } from "../../../apis/Orders/AddSrOrders";
import { fetchSrOrders } from "../../../apis/Orders/SrOrders";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CollectHandler } from "./../../../apis/Accountant/CollectMoney";
function Accountant() {
  const [SR, setSR] = useState();
  const [formOpen, setFormOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedSr, setSelectedSr] = useState(0);
  const [orderDetails, setOrderDetails] = useState("");
  const [orders, setOrders] = useState();
  const [price, setPrice] = useState();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "Order Date",
      headerName: "Date",
      flex: 1,
      valueGetter: ({ row }) => row.date,
    },
    {
      field: "Remain Amount",
      headerName: "Remainder",
      flex: 1,
      valueGetter: ({ row }) => row.remainAmount,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row: { _id } }) => {
        return (
          <Box>
            <Tooltip title="Edit Remainder" placement="right">
              <IconButton
                onClick={() => {
                  setFormOpen(!formOpen);
                  setOrderDetails({ id: _id });
                }}
              >
                <CreateRoundedIcon sx={{ color: "cyan" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];
  const handleSubmit = (orderId) => {
    dispatch(CollectHandler({ orderId, srId: selectedSr._id, price })).then(
      (res) => {
        if (res.payload.status === 201) {
          window.location.reload();
        }
      }
    );
  };
  useEffect(() => {
    dispatch(fetchAllSr()).then((res) => {
      if (res.payload.data) {
        setSR(res.payload.data.SRs);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSrOrders()).then((res) => {
      if (res.payload.data) {
        if (selectedSr) {
          const orders = res.payload.data.orders;
          if (orders.length > 0) {
            const filter = orders.filter(
              (order) => order.SR_email === selectedSr.email
            );
            setOrders(filter);
          } else {
            setOrders([]);
          }
        }
      }
    });
  }, [dispatch, selectedSr]);

  return (
    <Box p={5}>
      <Select
        value={selectedSr}
        fullWidth
        onChange={(e) => setSelectedSr(e.target.value)}
      >
        <MenuItem disabled value={0}>
          Please Select a SR.
        </MenuItem>
        {SR &&
          SR.map((sr) => (
            <MenuItem key={sr._id} value={sr}>
              {sr.username}
            </MenuItem>
          ))}
      </Select>

      <Box height="70vh" mt={10}>
        {orders && (
          <DataGrid
            disableSelectionOnClick
            checkboxSelection
            rows={orders
              .filter((o) => !o.archived)
              .map((o, index) => ({
                id: index + 1,
                ...o,
              }))}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        )}
      </Box>
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(!formOpen)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {/* Delete <span style={{ color: "red" }}>{userDetails.name}?</span> */}
          Edit the price below :
        </DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setFormOpen(!formOpen)}>
            Cancle
          </Button>
          <Button
            disabled={price ? false : true}
            onClick={() => handleSubmit(orderDetails.id)}
            autoFocus
            color="primary"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Accountant;
