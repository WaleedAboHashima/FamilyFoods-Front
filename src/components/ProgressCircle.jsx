import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = "0.75", size = "40" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.whiteAccent[900]} 55%, transparent 56%), 
            conic-gradient(transparent 0deg ${angle}deg, ${colors.grey[200]} ${angle}deg 360deg),
            ${colors.primary[500]}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
