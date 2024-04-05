import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import ReportIcon from "@mui/icons-material/Report";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StateBox from "./../../components/StatBox";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarChart from "./../../components/BarChart";
import PieChart from "./../../components/PieChart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchallUsers } from "../../apis/Users/AllUsers";
import { useState } from "react";
import { fetchAllProducts } from "../../apis/Products/AllProducts";
import { fetchGetReports } from "../../apis/Report/GetReports";
import { fetchTop3 } from "./../../apis/Info/Top3";
import { DataGrid } from "@mui/x-data-grid";
import { useContext } from "react";
import { LanguageContext } from "../../language";
import { fetchAllOrders } from "../../apis/Orders/AllOrders";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [users, setUsers] = useState();
  const [sr, setSr] = useState();
  const [products, setProducts] = useState();
  const [reports, setReports] = useState();
  const [transactions, setTransactions] = useState();
  const [top3, setTop3] = useState([]);
  const customersState = useSelector((state) => state.allUsers);
  const productsState = useSelector((state) => state.allProducts);
  const reportsState = useSelector((state) => state.getReport);
  const transactionState = useSelector((state) => state.allOrders);
  const context = useContext(LanguageContext);
  const columns = [
    {
      field: "Name",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 1,
      valueGetter: ({ row }) => row.user.username,
    },
    {
      field: "Email",
      headerName: context.language === "en" ? "Email" : "البريد الاليكتروني",
      flex: 1,
      valueGetter: ({ row }) => row.user.email,
    },
    {
      field: "orderCount",
      headerName: context.language === "en" ? "No. Of Orders" : "العدد الطلبات",
      flex: 1,
    },
    ,
  ];
  const productsColumns = [
    {
      field: "img",
      headerName: "Image",
      renderCell: ({ row: { img } }) => {
        return (
          <img
            src={img}
            style={{ padding: "5px 0" }}
            alt={"Product Logo"}
            width="auto"
            height="120%"
          />
        );
      },
    },
    {
      field: "name",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 1,
    },
    {
      field: "flavor",
      headerName: context.language === "en" ? "Flavour" : "الطعم",
      flex: 1,
    },
  ];
  useEffect(() => {
    dispatch(fetchallUsers()).then((res) => {
      if (res.payload.data) {
        setUsers(res.payload.data.All_Users.length);
        const allsr = res.payload.data.All_Users.filter(
          (user) => user.role === 2500
        );
        setSr(allsr.length);
      }
    });
    dispatch(fetchAllProducts()).then((res) => {
      if (res.payload.data) {
        setProducts(res.payload.data.Products);
      }
    });
    dispatch(fetchGetReports()).then((res) => {
      if (res.payload.status === 200) {
        setReports(res.payload.data.Reports.length);
      }
    });
    dispatch(fetchTop3()).then((res) => {
      if (res.payload.data) {
        setTop3(res.payload.data.orders);
      }
    });
    dispatch(fetchAllOrders()).then((res) => {
      if (res.payload.data) {
        setTransactions(res.payload.data.orders);
      }
    });
  }, [dispatch]);
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome To Ur Dashboard" />
      </Box>

      {/* Grids and Charts */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Row 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.whiteAccent[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {customersState.loading ? (
            <Skeleton
              sx={{ width: "100%", height: "100%" }}
              variant="rectangular"
            />
          ) : (
            <StateBox
              title={users ? users : ""}
              subtitle={
                context.language === "en" ? "All Customers" : "جميع المستخدمين"
              }
              progress={users ? users / 100 : ""}
              increase={users ? `${(users / 200) * 100}%` : ""}
              icon={
                <PersonAddIcon
                  sx={{ color: colors.primary[600], fontSize: "26px" }}
                />
              }
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.whiteAccent[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {customersState.loading ? (
            <Skeleton
              sx={{ width: "100%", height: "100%" }}
              variant="rectangular"
            />
          ) : (
            <StateBox
              title={sr ? sr : ""}
              subtitle={
                context.language === "en"
                  ? "All Sales Representative"
                  : "جميع المندوبين"
              }
              progress={sr ? sr / 100 : ""}
              increase={sr ? `${(sr / 200) * 100}%` : ""}
              icon={
                <LocalShippingIcon
                  sx={{ color: colors.primary[600], fontSize: "26px" }}
                />
              }
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.whiteAccent[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {productsState.loading ? (
            <Skeleton
              sx={{ width: "100%", height: "100%" }}
              variant="rectangular"
            />
          ) : (
            <StateBox
              title={products ? products.length : ""}
              subtitle={
                context.language === "en" ? "All Products" : "جميع المنتجات"
              }
              progress={products ? products.length / 100 : ""}
              increase={products ? `${(products.length / 200) * 100}%` : ""}
              icon={
                <ShoppingCartIcon
                  sx={{ color: colors.primary[600], fontSize: "26px" }}
                />
              }
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.whiteAccent[900]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {reportsState.loading ? (
            <Skeleton
              sx={{ width: "100%", height: "100%" }}
              variant="rectangular"
            />
          ) : (
            <StateBox
              title={reports ? reports : ""}
              subtitle={
                context.language === "en"
                  ? "Reports Recieved"
                  : "الشكاوي الواردة"
              }
              progress={reports ? reports / 100 : ""}
              increase={reports ? `${Math.round((reports / 100) * 100)}%` : ""}
              icon={
                <ReportIcon
                  sx={{ color: colors.primary[600], fontSize: "26px" }}
                />
              }
            />
          )}
        </Box>
        {/* Row 2 */}
        <Box
          p={3}
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.whiteAccent[900]}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                {context.language === "en"
                  ? "Important Customers"
                  : "عملاء مهمون"}
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.primary[500]}
              >
                {context.language === "en"
                  ? "High Volume Customers"
                  : "المستخدمين الأكثر شراء"}
              </Typography>
            </Box>
          </Box>
          <Box height={"80%"}>
            {top3 && (
              <DataGrid
                autoPageSize
                checkboxSelection
                sx={{
                  height: "100%",
                  paddingY: 2,
                  "& .MuiDataGrid-footerContainer": {
                    display: "none",
                  },
                }}
                rows={top3.map((user, index) => ({
                  id: index + 1,
                  ...user,
                }))}
                columns={columns}
              />
            )}
          </Box>
        </Box>

        {/* Transactions */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.whiteAccent[900]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[200]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              {context.language === "en"
                ? "Recent Transactions"
                : "التحويلات الاخيرة"}
            </Typography>
          </Box>
          {transactionState.loading ? (
            <Skeleton
              sx={{ width: "100%", height: "100%" }}
              variant="rectangular"
            />
          ) : (
            transactions &&
            transactions.map((order, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[200]}`}
                p="15px"
              >
                <Box>
                  <Typography
                    color={colors.whiteAccent[100]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {order.orderId}
                  </Typography>
                  <Typography
                    color={colors.grey[100]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {order.user.username}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]}>
                  {order.date.substring(0, 10)}
                </Box>
                <Box color={colors.primary[600]} p="5px" borderRadius="4px">
                  {order.totalPrice}
                </Box>
              </Box>
            ))
          )}
        </Box>
        {/* Row 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.whiteAccent[900]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            {context.language === "en"
              ? "High Volume Products"
              : "المنتجات الاكثر شراء"}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
            height={'80%'}
          >
            {products && (
              <DataGrid
                autoPageSize
                checkboxSelection
                sx={{
                  height: "100%",
                  width: '100%',
                  paddingY: 2,
                  "& .MuiDataGrid-footerContainer": {
                    display: "none",
                  },
                }}
                rows={products.map((product, index) => ({
                  id: index + 1,
                  ...product,
                }))}
                columns={productsColumns}
              />
            )}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.whiteAccent[900]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.whiteAccent[900]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600" sx={{ mb: "15px" }}>
            Pie Chart
          </Typography>
          <Box height="100%">
            <PieChart isDashboard={true} />
          </Box>
        </Box>

        {/* */}
      </Box>
    </Box>
  );
};

export default Dashboard;
