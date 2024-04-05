import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./../../../components/Header";
import { fetchAddUser } from "./../../../apis/Users/AddUser";
import * as yup from "yup";
import LockResetIcon from "@mui/icons-material/LockReset";
const AddUsers = () => {
  //Variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState("Admin");
  const State = useSelector((state) => state.addUser);

  const dispatch = useDispatch();

  //Functions

  const handleAddUserSubmit = () => {
    dispatch(fetchAddUser({ email, phone, password, permission, username }));
  };

  const handleFetchInfo = () => {
    console.log(State);
    if (State.status === 201) {
      window.location.pathname = "/users";
    } else {
      console.log(State.error);
    }
  };

  const handleGenerate = () => {
    const length = 6;
    const charset =
      // "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newPassword = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(newPassword);
  };

  useEffect(() => {
    handleFetchInfo();
  }, [State]);

  return (
    <Box m="20px">
      <Header title="Add Users" subtitle="Add Users Below" />
      <Box display="flex" justifyContent="center" alignItems="center" my={20}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleAddUserSubmit}
          validationSchema={validateSchema}
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
            <form
              onSubmit={handleSubmit}
              onReset={handleReset}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px  ",
                width: "50%",
              }}
            >
              <TextField
                name="username"
                label="Username"
                error={!!touched.username && !!errors.username}
                onBlur={handleBlur}
                onChange={handleChange}
                onChangeCapture={(e) => setUsername(e.target.value)}
                required
                value={values.username}
                helperText={touched.username && errors.username}
              />
              <TextField
                name="email"
                label="Email"
                error={!!touched.email && !!errors.email}
                onBlur={handleBlur}
                onChange={handleChange}
                onChangeCapture={(e) => setEmail(e.target.value)}
                required
                value={values.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                name="phone"
                label="Phone"
                error={!!touched.phone && !!errors.phone}
                onBlur={handleBlur}
                onChange={handleChange}
                onChangeCapture={(e) => setPhone(e.target.value)}
                required
                value={values.phone}
                helperText={touched.phone && errors.phone}
              />

              <TextField
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                required
                placeholder="Generate your password."
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={"Generate"}>
                        <IconButton onClick={handleGenerate}>
                          <LockResetIcon sx={{ color: "#307a59", fontSize: 30 }} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl>
                <Select
                  defaultChecked={"Admin"}
                  name="permission"
                  value={values.permission}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem
                    id="Admin"
                    onClick={(e) => setPermission(e.currentTarget.textContent)}
                    value={"Admin"}
                  >
                    Admin
                  </MenuItem>
                  <MenuItem
                    id="Accountant"
                    onClick={(e) => setPermission(e.currentTarget.textContent)}
                    value={"Accountant"}
                  >
                    Accountant
                  </MenuItem>
                  <MenuItem
                    id="SR"
                    onClick={(e) => setPermission(e.currentTarget.textContent)}
                    value={"SR"}
                  >
                    SR
                  </MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" type="submit">
                submit
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const initialValues = {
  username: "",
  email: "",
  permission: "Admin",
  phone: "",
};

const validateSchema = yup.object().shape({
  username: yup.string().required("Required Field."),
  email: yup.string().required("Required Field."),
  permission: yup.string().required("Required Field."),
});

export default AddUsers;
