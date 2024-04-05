import { Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./../../../components/Header";
import UnarchiveIcon from "@mui/icons-material/UnarchiveOutlined";
import { useTheme } from "@emotion/react";
import { tokens } from "./../../../theme";
import { fetchSrOrders } from "./../../../apis/Orders/SrOrders";
import { archiveSrOrder } from "./../../../apis/Orders/ArchiveSrOrders";

const ArchivedSrOrder = () => {
  // Varaibles
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const srOrdersData = useSelector((state) => state.allSrOrders.data.orders);
  const state = useSelector((state) => state.allSrOrders);
  const dispatch = useDispatch();
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "SR_phone", headerName: "Phone", flex: 1 },
    {
      field: "_id",
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
      field: "remainAmount",
      headerName: "Remainder",
      flex: 1,
      // renderCell: ({ row: { remainAmount } }) => {
      //   return (
      //     <Box
      //       width="100%"
      //       p="5px"
      //       display="flex"
      //       backgroundColor={
      //         remainAmount === 0
      //           ? "Orange"
      //           : "White"
      //       }
      //       borderRadius="4px"
      //     >

      //     </Box>
      //   );
      // },
    },
    {
      field: "productsQuantity",
      headerName: "Quantity",
      type: "number",
      flex: 1,
    },

    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: ({ row }) => row.date.substring(0, 10),
    },
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
    dispatch(archiveSrOrder({ _id })).then((res) => {
      if (res.payload.status === 200) {
        dispatch(fetchSrOrders());
      }
    });
  };
  useEffect(() => {
    dispatch(fetchSrOrders());
  }, [dispatch]);

  return (
    <Box m="20px">
      <Header
        title="Archived SR Orders"
        subtitle="Archived SR Orders are listed below."
      />
      <Box mt="40px" height="75vh">
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
        ) : srOrdersData ? (
          <DataGrid
            rows={srOrdersData
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

export default ArchivedSrOrder;
