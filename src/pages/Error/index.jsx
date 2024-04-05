import { Box } from '@mui/material'
import Header from "../../components/Header";

const ErrorPage = () => {
    return (
        <Box m="20px">
        <Box display="flex" justifyContent='space-between' alignItems='center'>
          <Header title="ERROR 404" subtitle="Page Not Found." />
        </Box>
      </Box>
    )
}

export default ErrorPage;