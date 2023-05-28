import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Button, useMediaQuery, ThemeProvider, createTheme, useTheme, Box } from '@mui/material';
import Farmers2ULogo from '../../assets/farmers2u_logo.svg'
import DrawerComp from './DrawerComp';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const themeForButton = createTheme({
  palette: {
    button: createColor('#64b5f6'),
  },
});

  const NavbarElements = ({ token, removeToken }) => {
  const navigate = useNavigate();
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  const handleProfileClick = () => {
    navigate('/profile');
  };
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('lg'));
  const { pathname } = useLocation();

  const logMeOut = () => {
    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/logout",
    })
      .then((response) => {
        removeToken();
        localStorage.removeItem('email');
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const logged = localStorage.getItem('email');

  const pages = [
    { label: 'שאלות נפוצות', href: 'faq' },
    { label: 'על האתר', href: 'about' },
    { label: 'החקלאים שלנו', href: 'ourfarmers' },
    { label: 'לוח המודעות', href: 'bullboard' },
    { label: 'דף הבית', href: 'home' }
  ];

  const [value, setValue] = useState(() => {
    // Find the index of the page whose href matches the current pathname
    const pageIndex = pages.findIndex((page) => page.href === pathname.slice(1));
    return pageIndex === -1 ? -1 : pageIndex;
  });

  return (
    <ThemeProvider theme={themeForButton}>
      <React.Fragment>
        <AppBar position="static" sx={{ background: '#F5FDFF' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isMatch ? (
              <>
                <img src={Farmers2ULogo} alt="Farmers2ULogo" style={{ width: '65px', height: '65px' }} />
                <DrawerComp />
              </>
            ) : (
              <>
                {!token && (
                  <>
                    <Button href="login" color='button' sx={{ fontFamily: "aleph", marginRight: 'auto', marginLeft: 3, '&:hover': { color: 'white' } }} variant="contained">
                      כניסת משתמש{' '}
                    </Button>
                    <Button href="signup" color="button" sx={{ fontFamily: "aleph", marginRight: 'auto', marginLeft: '4rem', '&:hover': { color: 'white' } }} variant="contained">
                      יצירת משתמש{' '}
                    </Button>
                  </>
                )}
                {token && (
                  <>
                    <button className="btn btn-outline-danger" type="submit" onClick={logMeOut}>התנתקות</button>
                    <button className="btn btn-outline-danger" type="submit" onClick={handleSettingsClick}>הגדרות</button>
                    <button className="btn btn-outline-danger" type="submit" onClick={handleProfileClick}>פרופיל</button>
                  </>
                )}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                  <Tabs
                    sx={{ color: '#0062E2' }}
                    textColor="inherit"
                    value={value}
                    indicatorColor="none"
                  >
                    {pages.map((page, index) => (
                      <Tab
                        key={index}
                        label={page.label}
                        href={page.href}
                        sx={{ marginRight: 'auto', marginLeft: "45px", fontFamily: "aleph", fontSize: '18.5px', '&:hover': { textDecoration: 'none' } }}
                        value={index}
                      />
                    ))}
                  </Tabs>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={Farmers2ULogo}
                    alt="Farmers2ULogo"
                    style={{ width: '65px', height: '65px', marginRight: 'auto' }}
                  />
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default NavbarElements;