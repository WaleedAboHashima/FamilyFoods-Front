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
import Header from "../../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { fetchAllProducts } from "../../../apis/Products/AllProducts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteProduct } from "../../../apis/Products/DeleteProduct";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { LanguageContext } from "../../../language";

const Products = () => {
  // Vairables
  const context = useContext(LanguageContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [formOpen, setFormOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const productsData = useSelector((state) => state.allProducts.data.Products);
  const state = useSelector((state) => state.allProducts);
  const columns = [
    { field: "id", headerName: "ID" },
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
      field: context.language === "en" ? "name" : "nameAR",
      headerName: context.language === "en" ? "Name" : "الاسم",
      flex: 1,
    },
    {
      field: context.language === "en" ? "flavor" : "flavorAR",
      headerName: context.language === "en" ? "Flavor" : "الطعم",
      flex: 1,
    },

    {
      field: context.language === "en" ? "category" : "categoryAR",
      headerName: context.language === "en" ? "Category" : "الفئه",
    },
    {
      field: "price",
      headerName: context.language === "en" ? "Price" : "السعر",
      flex: 1,
      type: "number",
    },
    {
      field: "quantity",
      headerName: context.language === "en" ? "Quantity" : "الكميه",
      flex: 1,
      type: "number",
    },
    {
      field: "weight",
      headerName: context.language === "en" ? "Weight" : "الوزن",
      flex: 1,
      type: "number",
    },
    {
      field: "validDate",
      headerName:
        context.language === "en" ? "Validation Date" : "تاريخ الانتاج",
      flex: 1,
    },
    {
      field: "expDate",
      headerName:
        context.language === "en" ? "Expiration Date" : "تاريخ الانتهاء",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: context.language === "en" ? "Creation Date" : "تاريخ الأضافه",
      flex: 1,
      valueGetter: ({ row }) => row.createdAt.substring(0, 10),
    },
    {
      field: "updatedAt",
      headerName: context.language === "en" ? "Last Updated" : "اخر تحديث",
      flex: 1,
      valueGetter: ({ row }) => row.updatedAt.substring(0, 10),
    },
    {
      field: "actions",
      headerName: context.language === "en" ? "Actions" : "أجراءات",
      flex: 1,
      renderCell: ({ row: { name, _id } }) => {
        return (
          <Box>
            <Tooltip
              title={context.language === "en" ? "Edit" : "تعديل"}
              placement={context.language === "en" ? "left" : "right"}
            >
              <IconButton onClick={() => navigator(`/products/${_id}`)}>
                <EditIcon sx={{ color: "cyan" }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title={context.language === "en" ? "Delete" : "حذف"}
              placement={context.language === "en" ? "right" : "left"}
            >
              <IconButton
                onClick={() => {
                  setFormOpen(!formOpen);
                  setProductDetails({ name: name, id: _id });
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

  const filteredColumns =
    cookies.get("_auth_role") === "5050"
      ? columns
      : columns.filter((column) => column.field !== "actions");

  /* Functions */
  const handleDeleteProduct = async (_id) => {
    await dispatch(deleteProduct({ _id })).then(() => {
      setFormOpen(!formOpen);
      dispatch(fetchAllProducts());
    });
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={context.language === "en" ? "PRODUCTS" : "المنتجات"}
          subtitle={
            context.language === "en"
              ? "Products are listed below."
              : "المنتجات مرصوصه بالاسفل."
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
        <Dialog
          open={formOpen}
          onClose={() => setFormOpen(!formOpen)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete <span style={{ color: "red" }}>{productDetails.name}?</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this product?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(!formOpen)}>Cancle</Button>
            <Button
              onClick={() => handleDeleteProduct(productDetails.id)}
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

export default Products;
