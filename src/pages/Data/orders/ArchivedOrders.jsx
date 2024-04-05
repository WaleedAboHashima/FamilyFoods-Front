import { Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from './../../../components/Header';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import UnarchiveIcon from '@mui/icons-material/UnarchiveOutlined';
import { useTheme } from "@emotion/react";
import { tokens } from './../../../theme';
import { fetchAllOrders } from './../../../apis/Orders/AllOrders';
import { archiveOrder } from './../../../apis/Orders/ArchiveOrders';

const ArchivedOrder = () => {
  // Varaibles
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const ordersData = useSelector((state) => state.allOrders.data.orders);
  const dispatch = useDispatch();
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 , valueGetter: ({row}) => row.user.username},
    { field: "phone", headerName: "Phone", flex: 1, valueGetter : ({row}) => row.user.phone  },
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
              <CircularProgress sx={{ color: 'white' }} size={20} />
            ) : <CloseOutlinedIcon />}
            <Typography color={colors.whiteAccent[100]} sx={{ ml: "5px" }}>
              {status}
            </Typography>
          </Box>
        );
      }
    },
    { field: "quantity", headerName: "Quantity", type: "number", flex: 1 },
    { field: "totalPrice", headerName: "Total Price", type: "number", flex: 1 },
    {
      field: "action",
      headerName: "Actions",
      renderCell: ({ row: { _id } }) => {
        return (
          <Tooltip title="UnArchive" placement="right">
            <IconButton onClick={() => handleArchiveOrder(_id)}>
              <UnarchiveIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];




  //Functions
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
      <Header
        title="Archived Orders"
        subtitle="Archived Orders are listed below."
      />
      <Box mt="40px" height="75vh">
        {ordersData ? (
          <DataGrid
            rows={ordersData
              .filter((order) => order.archived)
              .map((order, index) => ({ id: index + 1, ...order }))}
            getRowId={(row) => row._id}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        ) : (
          <DataGrid rows={[]} columns={[]} />
        )}
      </Box>
    </Box>
  );
};

export default ArchivedOrder;
