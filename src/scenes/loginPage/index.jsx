import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import logo from "./../../assets/archIntell-icon.svg"
import { styled } from '@mui/system';

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const GradientText = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(to left, ${theme.palette.primary.main}, #EA23FB)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }));
  return (
    <Box>
      <Box display="flex" width="100%" backgroundColor={theme.palette.background.alt} alignContent="center" justifyContent="center" p="1rem 6%" alignItems="center">
        <img src={logo} alt="logo" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
        <GradientText fontWeight="bold" fontSize="32px">
          ArchIntell
        </GradientText>
      </Box>
      {/* <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          <img src={logo} alt="photo" width="20px" height="20px" /> ArchIntell
        </Typography>
      </Box> */}

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Socipedia, the Social Media for Sociopaths!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
