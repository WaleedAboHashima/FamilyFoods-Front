import Header from "../../../components/Header";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { Box, CircularProgress, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllOrders } from "../../../apis/Orders/AllOrders";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { archiveOrder } from "../../../apis/Orders/ArchiveOrders";
import { tokens } from "../../../theme";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

const Orders = () => {
  // Variables
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const ordersData = useSelector((state) => state.allOrders.data.orders);
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 , valueGetter: ({row}) => row.user.username},
    { field: "phone", headerName: "Phone", flex: 1 , valueGetter: ({row}) => row.user.phone},
    {
      field: "orderId",
      headerName: "OrderID",
      flex: 1,
      renderCell: ({ row: { orderId } }) => {
        if (orderId === "Offline") {
          return <hr style={{ width: "100%" }} />;
        } else {
          return orderId;
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 3,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="50%"
            p="5px"
            display="flex"
            backgroundColor={
              status === "Waiting"
                ? "Orange"
                : status === "Delivered"
                ? colors.primary[600]
                : "#CC5500"
            }
            borderRadius="4px"
          >
            {status === "Waiting" ? (
              <MoreHorizOutlinedIcon />
            ) : status === "Delivered" ? (
              <DoneOutlinedIcon />
            ) : status === "Preparing" ? (
              <CircularProgress sx={{color: 'white'}} size={20} />
            ): <CloseOutlinedIcon />}
            <Typography color={colors.whiteAccent[100]} sx={{ ml: "5px" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
    { field: "quantity", headerName: "Quantity", type: "number", flex: 1 },
    { field: "totalPrice", headerName: "Total Price", type: "number", flex: 1 },
    {
      field: "action",
      headerName: "Actions",
      renderCell: ({ row: { _id } }) => {
        return (
          <Tooltip title="Archive" placement="right">
            <IconButton onClick={() => handleArchiveOrder(_id)}>
              <ArchiveOutlinedIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];
  // Functions
  const handleArchiveOrder = async (_id) => {
    await dispatch(archiveOrder({ _id })).then(() => {
      dispatch(fetchAllOrders());
    });
  };

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  return (
    <Box m="20px">
      <Header title="ORDERS" subtitle="Orders are listed below." />
      <Box mt="40px" height="75vh">
        {ordersData ? (
          <DataGrid
            rows={ordersData
              .filter((order) => !order.archived)
              .map((order, index) => ({ id: index + 1, ...order }))}
            columns={columns}
            getRowId={(row) => row._id}
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

export default Orders;
