import { TextField, Button, Box, ThemeProvider, createTheme, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import {useNavigate} from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import axios from 'axios';
import { Email } from '@mui/icons-material';
import jwt_decode from "jwt-decode"

const {palette} = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const themeForButton = createTheme({
  palette: {
    nice: createColor('#37474f'),
    button: createColor('#E8AA42'),
  },
});

const FormLogin = (props) => {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleCallbackResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    setUser(userObject);

    // Check the structure of the response object to access the email
    var idToken = response.credential.id_token;
    //var decodedToken = jwt_decode(idToken);
    //var email = decodedToken.email;

    console.log(userObject.email);
    setEmail(userObject.email); // Store the email in the component's state
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/logintoken',
      data: {
        email: userObject.email // Include the email in the POST request
      }
    })
      .then(function (response) {
        console.log(response);
        props.setToken(response.data.access_token);
        alert('התחברת בהצלחה');
        localStorage.setItem('email', userObject.email);
        console.log(response.data);
        navigate('/bullboard');
      })
      .catch(function (error) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
        if (error.response && error.response.status === 401) {
          setErrorMessage('הפרטים שהוזנו שגויים');
        }
      });

    setEmail('');
    setPassword('');
  };

  const initializeGoogleSignIn = () => {
    if (typeof window.google !== 'undefined' && typeof window.google.accounts !== 'undefined') {
      window.google.accounts.id.initialize({
        client_id: '814952910063-shd06kmdd43a83r3etfpq73gqi0ddf5m.apps.googleusercontent.com',
        callback: handleCallbackResponse
      });

      window.google.accounts.id.renderButton(document.getElementById('signInDiv'), {
        theme: 'outline',
        size: 'large'
      });
    }
  };

  useEffect(() => {
    initializeGoogleSignIn();
  }, []);
  // If we have no user: sign in button
  //If we have a user: show the logout button

  return (
    <ThemeProvider theme={themeForButton}>
    <div dir="rtl">
    {/*<button onClick={ (e) => handleSignOut(e)}>Sign Out</button>  GOOGLE SIGNOUT BUTTON, incomplete. needs to adapt to regular signout  */ }
    { user &&
    <div>
      {/*<img src={user.picture}></img> !!!----OPTIONAL - farmers image shown in login----!!!
      <h3>{user.name}</h3> */}
      </div>
    }
        <form autoComplete="off" /*onSubmit={handleSubmit}*/>
        <Box marginTop={6.1}>
      <Box
        margin="auto"
        marginBottom={11}
        marginTop={5}
        bgcolor="#f7f1e5"
        boxShadow={0}
        borderRadius={2}
        border={2}
        display="flex"
        flexDirection="column"
        width={580}
        height={200}
        alignItems="center"
        justifyContent="center"
        mt={4}
        padding={20}
        sx={{ border: '1.5px solid #f7f1e5' }}
      >
        <Typography
          color="#37474f"
          fontFamily="aleph"
          fontWeight="bold"
          fontSize={50}
          marginBottom="0px"
          variant="h3"
          textAlign="center"
        >
          התחברות חקלאי
        </Typography>
        <Box marginTop={5}>
          <form> 
            <Box>
            <div id="signInDiv" style={{marginRight:'0%', paddingTop: '25px'}}></div>
            </Box>
          </form>
          {errorMessage && (
            <Box
              mt={1}
              fontSize={13}
              color="red"
              textAlign="center"
              sx={{
                fontFamily: 'aleph',
                marginRight: '-4rem' // Add a right margin to move the error message to the right
              }}
            >
              {errorMessage}
            </Box>
          )}
          <Box mt={1} marginRight={-20}>
          <Button
            variant="text"
            size="medium"
            sx={{
              marginRight: '9.3rem',
              fontFamily: 'aleph',
              mt: 4,
              borderRadius: 4,
              '&:hover': { textDecoration: 'none' },
            }}
            color="nice"
          >
            שחזור סיסמה
          </Button>
          <a href="/signup">
            <Button
              variant="text"
              size="medium"
              sx={{
                marginRight: '2rem',
                fontFamily: 'aleph',
                mt: 4,
                borderRadius: 4,
              }}
              color="nice"
            >
              מעבר להרשמה
            </Button>
          </a>
          </Box>
        </Box>
      </Box>
    </Box>
        </form>
    </div>
    </ThemeProvider>

  )
}

export default FormLogin