import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Header from "./../../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUpdateProduct } from "./../../../apis/Products/UpdateProduct";
import { fetchGetProduct } from "./../../../apis/Products/GetProduct";

const EditProduct = () => {
  // Variables
  const [productImage, setProductImage] = useState();
  const [productName, setProductName] = useState();
  const [productNameAR, setProductNameAR] = useState();
  const [productFlavor, setProductFlavor] = useState();
  const [productFlavorAR, setProductFlavorAR] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productWeight, setProductWeight] = useState();
  const [productQuantity, setProductQuantity] = useState();
  const [productValid, setProductValid] = useState();
  const [productExpire, setProductExpire] = useState();
  const [category, setCategory] = useState();
  const [categoryAR, setCategoryAR] = useState();
  // Other variables
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const State = useSelector((state) => state.getProduct);
  const UpdateState = useSelector((state) => state.updateProduct);
  const [productImgPreview, setProductImgPreview] = useState();
  // Functions
  //Image
  const handleImagePreview = (e) => {
    setProductImgPreview({
      file: URL.createObjectURL(e.target.files[0]),
    });
  };
  const handleState = () => {
    if (UpdateState.status === 201) {
      window.location.pathname = "/products";
    } else if (State.status === 409) {
      console.log("Error");
    } else {
      console.log("Error v2");
    }
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("productImg", productImage);
    formData.append("name", productName);
    formData.append("nameAR", productNameAR);
    formData.append("flavor", productFlavor);
    formData.append("flavorAR", productFlavorAR);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("weight", productWeight);
    formData.append("validDate", productValid);
    formData.append("expDate", productExpire);
    formData.append("category", category);
    formData.append("categoryAR", categoryAR);
    dispatch(fetchUpdateProduct({ _id: productId, formData: formData }));
  };

  useEffect(() => {
    handleState();
    dispatch(fetchGetProduct({ _id: productId }));
  }, [dispatch]);
  console.log(State)
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Edit Product" subtitle="Edit Product Below." />
      </Box>
      {State.data.product ? (
        <Box marginTop="10px" display="flex">
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            width="100%"
            gap="50px"
          >
            <img
              width="25%"
              height="auto"
              filter="brightness(200)"
              src={
                productImgPreview
                  ? productImgPreview.file
                  : State.data.product.img
              }
              alt="Product Img"
            />
            <Button
              variant="contained"
              component="label"
              sx={{ width: "30%", backgroundColor: "#307a59" }}
            >
              Change Image
              <input
                onChange={(e) => {
                  handleImagePreview(e);
                  setProductImage(e.currentTarget.files[0]);
                }}
                hidden
                accept="image/*"
                multiple
                type="file"
              />
            </Button>
          </Box>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validateSchema={validateSchema}
          >
            {({
              values,
              errors,
              touched,
              handleReset,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} onBlur={handleBlur}>
                <TextField
                  required
                  margin="dense"
                  id="name"
                  onChange={handleChange}
                  onChangeCapture={(e) => setProductName(e.target.value)}
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  value={values.name}
                  placeholder={State.data.product.name}
                />
                <TextField
                  required
                  margin="dense"
                  onChange={handleChange}
                  id="nameAR"
                  onChangeCapture={(e) => setProductNameAR(e.target.value)}
                  label="Name AR"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.nameAR && !!errors.nameAR}
                  helperText={touched.nameAR && errors.nameAR}
                  value={values.nameAR}
                  placeholder={State.data.product.nameAR}
                />
                <TextField
                  required
                  margin="dense"
                  onChange={handleChange}
                  id="flavor"
                  onChangeCapture={(e) => setProductFlavor(e.target.value)}
                  label="Flavor"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.flavor && !!errors.flavor}
                  helperText={touched.flavor && errors.flavor}
                  value={values.flavor}
                  placeholder={State.data.product.flavor}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="flavorAR"
                  onChangeCapture={(e) => setProductFlavorAR(e.target.value)}
                  label="Flavor AR"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.flavorAR && !!errors.flavorAR}
                  helperText={touched.flavorAR && errors.flavorAR}
                  value={values.flavorAR}
                  placeholder={State.data.product.flavorAR}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="price"
                  onChangeCapture={(e) => setProductPrice(e.target.value)}
                  label="Price"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                  value={values.price}
                  placeholder={State.data.product.price}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="quantity"
                  onChangeCapture={(e) => setProductQuantity(e.target.value)}
                  label={State.data.product.quantity}
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!touched.quantity && !!errors.quantity}
                  helperText={touched.quantity && errors.quantity}
                  value={values.quantity}
                  placeholder={State.data.product.quantity}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="weight"
                  onChangeCapture={(e) => setProductWeight(e.target.value)}
                  label="Weight"
                  type="number"
                  fullWidth
                  variant="outlined"
                  error={!!touched.weight && !!errors.weight}
                  helperText={touched.weight && errors.weight}
                  value={values.weight}
                  placeholder={State.data.product.weight}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="validDate"
                  onChangeCapture={(e) => setProductValid(e.target.value)}
                  label="Validation Date"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.validDate && !!errors.validDate}
                  helperText={touched.validDate && errors.validDate}
                  value={values.validDate}
                  placeholder={State.data.product.validDate}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="expDate"
                  onChangeCapture={(e) => setProductExpire(e.target.value)}
                  label="Expiration Date"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.expDate && !!errors.expDate}
                  helperText={touched.expDate && errors.expDate}
                  value={values.expDate}
                  placeholder={State.data.product.expDate}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="category"
                  onChangeCapture={(e) => setCategory(e.target.value)}
                  label="Category"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.category && !!errors.category}
                  helperText={touched.category && errors.category}
                  value={values.category}
                />
                <TextField
                  required
                  onChange={handleChange}
                  margin="dense"
                  id="categoryAR"
                  onChangeCapture={(e) => setCategoryAR(e.target.value)}
                  label="CategoryAR"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!touched.categoryAR && !!errors.categoryAR}
                  helperText={touched.categoryAR && errors.categoryAR}
                  value={values.categoryAR}
                />
                <Box
                  gap="20px"
                  marginTop="20px"
                  display="flex"
                  justifyContent="right"
                  alignItems="right"
                >
                  <Button
                    variant="filled"
                    onClick={() => {
                      handleReset();
                      setProductImgPreview("");
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="filled"
                    onClick={() => navigator("/products")}
                  >
                    Cancel
                  </Button>
                  <Button variant="filled" type="submit">
                    Edit
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      ) : (
        <Box>None</Box>
      )}
    </Box>
  );
};

const initialValues = {
  img: "",
  name: "",
  nameAR: "",
  flavor: "",
  flavorAR: "",
  price: "",
  quantity: "",
  weight: "",
  validDate: "",
  expDate: "",
  category: "",
  categoryAR: "",
};

const validateSchema = yup.object().shape({
  name: yup.string().required("Required Field."),
  nameAR: yup.string().required("Required Field."),
  flavor: yup.string().required("Required Field."),
  flavorAR: yup.string().required("Required Field."),
  price: yup
    .number()
    .positive()
    .integer()
    .required("Required Field.")
    .typeError("Invalid Price."),
  quantity: yup
    .number()
    .positive()
    .integer()
    .required("Price Required")
    .typeError("Invalid Quantity."),
  validDate: yup.string().required("Requred Field."),
  expDate: yup.string().required("Requred Field."),
});

export default EditProduct;
