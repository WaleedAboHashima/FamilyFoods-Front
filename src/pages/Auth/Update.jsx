import { useTheme } from "@emotion/react";
import { Box, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "./../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Formik } from "formik";
import { motion } from "framer-motion";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AdminUpdate } from "./../../apis/Auth/UpdatePassword";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
const Update = () => {
  // Variables
  const theme = useTheme();
  const navigator = useNavigate();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const State = useSelector((state) => state.update);
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [newPassword, setnewPassword] = useState();
  const [confirmNewPassword, setconfirmNewPassword] = useState();
  // Functions
  const handleForm = () => {
    dispatch(AdminUpdate({ newPassword, confirmNewPassword }));
  };

  const handleUpdate = () => {
    if (State.status === 200) {
      cookies.remove("userId");
      navigator("/");
    } else if (State.status === 403) {
      console.log("Error");
    } else {
      console.log("Server Error");
    }
  };

  useEffect(() => {
    handleUpdate();
  }, [State.status]);
  return (
    <Box
      display="flex"
      alignItems="center"
      height="100vh"
      width="100vw"
      justifyContent="center"
    >
      <Box
        backgroundColor={colors.whiteAccent[900]}
        height="668px"
        p="10px 10px 10px 10px"
        width="30%"
      >
        <Box textAlign="right">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Box width="100%" height="auto" textAlign="center">
            <img src="../../assets/logo.png" width="50%" alt="logo" />
          </Box>
          {/* Container */}
          <Formik
            onSubmit={handleForm}
            initialValues={{ newPassword: "", cofirmPassword: "" }}
            validationSchema={AdminSchema}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              handleBlur,
              handleChange,
            }) => (
              <motion.form
                initial={{ opacity: 0, transition: { duration: 0.5 } }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                onSubmit={handleSubmit}
                style={{ width: "100%", margin: "25% 0" }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  gap="20px"
                >
                  <TextField
                    variant="outlined"
                    title="newPassword"
                    name="newPassword"
                    label="New Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setnewPassword(e.target.value)}
                    error={!!touched.newPassword && !!errors.newPassword}
                    value={values.newPassword}
                    required
                    helperText={touched.newPassword && errors.newPassword}
                    sx={{ width: "75%" }}
                  />
                  <TextField
                    variant="outlined"
                    title="cofirmPassword"
                    name="cofirmPassword"
                    label="Confirm New Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onChangeCapture={(e) => setconfirmNewPassword(e.target.value)}
                    error={!!touched.cofirmPassword && !!errors.cofirmPassword}
                    value={values.cofirmPassword}
                    required
                    helperText={touched.cofirmPassword && errors.cofirmPassword}
                    sx={{ width: "75%" }}
                  />
                  <Button
                    type="submit"
                    variant="filled"
                    sx={{ backgroundColor: "#307a59", width: "75%" }}
                  >
                    {State.loading === true ? (
                      <CircularProgress sx={{ color: "white" }} size={21} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Box>
              </motion.form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

const AdminSchema = yup.object().shape({
  newPassword: yup.string().required("Your New Password is required."),
  cofirmPassword: yup
    .string()
    .required("Field Required")
    .oneOf([yup.ref("newPassword"), null], "Password Doesn't Match"),
});

export default Update;
