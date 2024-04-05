import { configureStore } from "@reduxjs/toolkit";
// Authentication
import loginReducer from "./Auth/Login";
import forgetReducer from "./Auth/ForgetPassword";
import resetReducer from "./Auth/ResetPassword";
import updateReducer from "./Auth/UpdatePassword";
// User
import allUsersReducer from "./Users/AllUsers";
import deleteUserReducer from "./Users/DeleteUsers";
import addUserReducer from "./Users/AddUser";
// Product
import getProductReducer from "./Products/GetProduct";
import allProductsReducer from "./Products/AllProducts";
import deleteProductReducer from "./Products/DeleteProduct";
import addProductReducer from "./Products/AddProduct";
import updateProductReducer from "./Products/UpdateProduct";
// Orders
import allOrdersReducer from "./Orders/AllOrders";
import archiveOrderReducer from "./Orders/ArchiveOrders";
// Sr Orders
import allSrOrdersReducer from "./Orders/SrOrders";
// Settings
import settingsReducer from "./Info/AdminSettings";
// Report
import getReportReducer from "./Report/GetReports";
import deleteReportReducer from "./Report/DeleteReport";
//Dashboards
import Top3Reducer from "./Info/Top3";
import BarCharReducer from "./Info/BarChart";
//Accountant
import GetAllSrReducer from "./Accountant/GetAllSr";
import ArchiveSrOrderReducer from "./Orders/AddSrOrders";
import GetTotalPriceReducer from "./Accountant/GetTotalPrice";
import GetAllTransactionReducer from "./Accountant/GetAllTransactions";
import CollectMoneyReducer from "./Accountant/CollectMoney";
export default configureStore({
  reducer: {
    // Authorization
    login: loginReducer,
    forget: forgetReducer,
    reset: resetReducer,
    update: updateReducer,
    // Users
    addUser: addUserReducer,
    allUsers: allUsersReducer,
    deleteUser: deleteUserReducer,
    // Products
    getProduct: getProductReducer,
    allProducts: allProductsReducer,
    deleteProduct: deleteProductReducer,
    addProduct: addProductReducer,
    updateProduct: updateProductReducer,
    // Orders
    allOrders: allOrdersReducer,
    archiveOrder: archiveOrderReducer,
    //Sr Orders
    allSrOrders: allSrOrdersReducer,
    // Settings
    settings: settingsReducer,
    // Report
    getReport: getReportReducer,
    deleteReport: deleteReportReducer,
    //Dashboard
    Top3: Top3Reducer,
    BarChar: BarCharReducer,
    //Accountant
    GetAllSr: GetAllSrReducer,
    ArchiveSrOrder: ArchiveSrOrderReducer,
    GetTotalPrice: GetTotalPriceReducer,
    GetAllTransaction: GetAllTransactionReducer,
    CollectMoney: CollectMoneyReducer,
  },
});
