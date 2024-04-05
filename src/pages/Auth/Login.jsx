import {
  Box,
  IconButton,
  TextField,
  Button,
  Link,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { ColorModeContext, tokens } from "./../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import TranslateIcon from "@mui/icons-material/Translate";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { AdminLogin } from "./../../apis/Auth/Login";
import jwt from "jwt-decode";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageContext } from "../../language";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Login = () => {
  // Variables.

  const context = useContext(LanguageContext);
  const theme = useTheme();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const AdminData = useSelector((state) => state.login);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(true);
  const Uschema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(
        context.language === "en"
          ? "Your Email is required."
          : "البريد الالكتروني مطلوب"
      ),
    phone: yup
      .number()
      .positive()
      .integer()
      .required(
        context.language === "en" ? "Phone Required" : "رقم الهاتف مطلوب"
      )
      .typeError("Invalid Phone Number.")
      .test(
        "12345678910",
        "Invalid Number",
        (val) => val.toString().length === 10
      ),
    password: yup
      .string()
      .required(
        context.language === "en"
          ? "Password is Required."
          : "كلمه المرور مطلوبه"
      )
      .min(5),
  });
  // Functions.

  const handleFormSubmit = () => {
    setError("");
    dispatch(
      AdminLogin({ email: email, password: password, phone: phone })
    ).then((res) => {
      if (res.payload) {
        if (res.payload.status === 200) {
          if (
            res.payload.data.role === 5050 ||
            res.payload.data.role === 5000
          ) {
            const decoded = jwt(res.payload.data.token);
            cookies.set("token", res.payload.data.token, {
              expires: new Date(decoded.exp * 1000),
              secure: false,
            });
            cookies.set("username", res.payload.data.username, {
              expires: new Date(decoded.exp * 1000),
            });
            cookies.set("_auth_verify", res.payload.data.username, {
              expires: new Date(decoded.exp * 1000),
            });
            cookies.set("_auth_id", res.payload.data._id, {
              expires: new Date(decoded.exp * 1000),
            });
            cookies.set("_auth_role", res.payload.data.role, {
              expires: new Date(decoded.exp * 1000),
            });
            window.location.reload();
          } else {
            setError("No Access.");
          }
        } else if (res.payload.status === 400) {
          setError("Wrong Credentials.");
        } else {
          setError(res.payload.message);
        }
      } else {
        setError("Server Error.");
      }
    });
  };

  const handleLanguageChange = (newLanguage) => {
    context.setLanguage(newLanguage);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      height="100vh"
      width="100vw"
      justifyContent="center"
    >
      {loading ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <AnimatePresence>
            <motion.img
              width={"300px"}
              src="/assets/logo.png"
              alt="Logo"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </AnimatePresence>
        </Box>
      ) : (
        <Box
          backgroundColor={colors.whiteAccent[900]}
          p="10px 10px 10px 10px"
          width="30%"
          textAlign={context.language === "en" ? "right" : "left"}
        >
          <Box>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton
              onClick={() =>
                handleLanguageChange(context.language === "en" ? "ar" : "en")
              }
            >
              {context.language === "en" ? (
                <TranslateIcon />
              ) : (
                <GTranslateIcon />
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
              <img src="../../assets/logo.png" width="50%" />
            </Box>
            {/* Container */}
            <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={Uschema}
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <motion.form
                  initial={{ opacity: 0, transition: { duration: 0.5 } }}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                  onSubmit={handleSubmit}
                  style={{ margin: "15% 0", width: "100%" }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    gap="20px"
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      placeholder={
                        context.language === "en"
                          ? "Email*"
                          : "البريد الالكتروني*"
                      }
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onChangeCapture={(e) => setEmail(e.target.value)}
                      value={values.email}
                      required
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      sx={{
                        width: "70%",
                        "& .MuiFormHelperText-root":
                          context.language === "en"
                            ? {
                                textAlign: "left",
                                fontSize: "15px",
                              }
                            : { textAlign: "right", fontSize: "15px" },
                      }}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      placeholder={
                        context.language === "en" ? "Phone*" : "رقم الهاتف*"
                      }
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onChangeCapture={(e) => setPhone(e.target.value)}
                      value={values.phone}
                      name="phone"
                      required
                      error={!!touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                      sx={{
                        width: "70%",
                        "& .MuiFormHelperText-root":
                          context.language === "en"
                            ? {
                                textAlign: "left",
                                fontSize: "15px",
                              }
                            : { textAlign: "right", fontSize: "15px" },
                      }}
                    />
                      <TextField
                        
                      fullWidth
                      variant="outlined"
                        type={hidden ? "password" : "text"}
                      placeholder={
                        context.language === "en" ? "Password*" : "كلمه المرور*"
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setHidden(!hidden)}>
                            {hidden ? (
                              <VisibilityOffOutlinedIcon
                                sx={{ color: colors.primary[500] }}
                              />
                            ) : (
                              <VisibilityOutlinedIcon
                                sx={{ color: colors.primary[500] }}
                              />
                            )}
                          </IconButton>
                        ),
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onChangeCapture={(e) => setPassword(e.target.value)}
                      value={values.password}
                      name="password"
                      required
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      sx={{
                        width: "70%",
                        "& .MuiFormHelperText-root":
                          context.language === "en"
                            ? {
                                textAlign: "left",
                                fontSize: "15px",
                              }
                            : { textAlign: "right", fontSize: "15px" },
                      }}
                    />
                    <Button
                      type="submit"
                      sx={{
                        width: "70%",
                        backgroundColor: "#307a59",
                        padding: "10px",
                      }}
                      variant="filled"
                      // onClick={() => setOpen(true)}
                    >
                      {context.language === "en" ? "Sign In" : "تسجيل الدخول"}
                    </Button>
                    {AdminData.loading && (
                      <Backdrop
                        sx={{
                          color: "#fff",
                          zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={AdminData.loading ? true : false}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop>
                    )}

                    <Link
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigator("/forgot")}
                      underline="hover"
                    >
                      {context.language === "en"
                        ? "Forgot Password ?"
                        : "نسيت كلمه المرور؟"}
                    </Link>
                    <Typography sx={{ color: "white" }} variant="h4">
                      {error}
                    </Typography>
                  </Box>
                </motion.form>
              )}
            </Formik>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const initialValues = {
  email: "",
  phone: "",
  password: "",
};

export default Login;
