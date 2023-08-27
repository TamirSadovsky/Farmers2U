import React, { useState, useEffect } from 'react';
import {
    TextField,
    Card,
    CardContent,
    Grid,
    Button,
    Box,
    ThemeProvider,
    createTheme,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Work from '../../components/days/work.jsx';
import dayjs from 'dayjs';
import './Forms.css';


const theme = createTheme({
  typography: {
    fontFamily: 'aleph',
  },
});



const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const themeForButton = createTheme({
    palette: {
        nice: createColor('#37474f'),
        button: createColor('#E8AA42')
    }
});

const FormSummary = ({ values , props, isFormValid }) => {
    const modalTextStyle = {
      fontSize: 'larger', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      //flexWrap: 'wrap', 
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: "5%",
  };
  const modalTextSmallStyle = {
    ...modalTextStyle,
    fontSize: 'smaller', 
  };
    const navigate = useNavigate();
    let shipping
    let km
    let concatenatedNamesProducts = "" 
    let concatenatedNamesFarm = ""
    let logoName = "" 
    if (values.is_shipping){
        shipping = "כן"
        km = values.shipping_distance
    }
    else{
        shipping = "לא"
        km = ""
    }
    if (values.logo_picture){
        logoName = values.logo_picture[0].name
    }
    if (values.products_pictures){
        let fileNamesProducts = Array.from(values.products_pictures).map(file => file.name);
        concatenatedNamesProducts = fileNamesProducts.join(', ');
    }
    if (values.farm_pictures){
        let fileNamesFarm = Array.from(values.farm_pictures).map(file => file.name);
        concatenatedNamesFarm = fileNamesFarm.join(', ');
    }
    function addZero(val) {
        const ret = val < 10 ? "0" + val : val;
        return ret;
    }

    function hoursFormat(start, end) {
        if (start === "none" || end === "none") {
            return "סגור";
        }
        else {
            return addZero(dayjs(end).hour()) + ":" + addZero(dayjs(end).minute()) + " - " + addZero(dayjs(start).hour()) + ":" + addZero(dayjs(start).minute())
        }
    }
    //let openingHours2 = "none,none,none,none,none,none,none"
    //let closingHours2 = "none,none,none,none,none,none,none"
    /*if (values.opening_hours != "") {
        const opening_hours = values.opening_hours.map(p => {
            return p && p !== "none" ? p.format() : "none";
        });
    }
    if (values.closing_hours != "") {
        const closing_hours = values.closing_hours.map(p => {
            return p && p !== "none" ? p.format() : "none";
        });
    }*/
    let opening_hours2 = ["none","none","none","none","none","none","none"]
    let closing_hours2 = ["none","none","none","none","none","none","none"]
    if (values.opening_hours != "") {
        opening_hours2 = values.opening_hours.map(p => {
            return p && p !== "none" ? p.format() : "none";
        });
        //opening_hours2 = opening_hours2.join(",");
        //alert(opening_hours2)
    }
    if (values.closing_hours != "") {
        closing_hours2 = values.closing_hours.map(p => {
            return p && p !== "none" ? p.format() : "none";
        });
        //closing_hours2 = closing_hours2.join(",");
        //alert(closing_hours2)
    }
    const sunday = hoursFormat(opening_hours2[0], closing_hours2[0])
    const monday = hoursFormat(opening_hours2[1], closing_hours2[1])
    const tuesday = hoursFormat(opening_hours2[2], closing_hours2[2])
    const wednesday = hoursFormat(opening_hours2[3], closing_hours2[3])
    const thursday = hoursFormat(opening_hours2[4], closing_hours2[4])
    const friday = hoursFormat(opening_hours2[5], closing_hours2[5])
    const saturday = hoursFormat(opening_hours2[6], closing_hours2[6])

    const days = {
        sunday: sunday,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday
    }
    const { farm_name, /*email,*/ google_profile_picture, google_name, google_family_name,
        shipping_distance, is_shipping, opening_hours, closing_hours, logo_picture, products_pictures, types_of_products,
        farm_pictures, phone_number_official, phone_number_whatsapp, phone_number_telegram, about, address,
        farmer_name, delivery_details, products, farm_site, facebook, instagram
    } = values
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {   
        window.scrollTo(0, 0); // Scroll to the top of the page
        if (showSuccessMessage) {
          const timer = setTimeout(() => {
            setShowSuccessMessage(false);
            navigate('/bullboard');
          }, 6500);
    
          return () => clearTimeout(timer);
        }
      }, [showSuccessMessage, navigate]);



    const submitHandler = (e) => {
        e.preventDefault();
        let openingHours = "none,none,none,none,none,none,none"
        let closingHours = "none,none,none,none,none,none,none"
        if (values.opening_hours != "") {
            const opening_hours = values.opening_hours.map(p => {
                return p && p !== "none" ? p.format() : "none";
            });
            openingHours = opening_hours.join(",");
        }
        if (values.closing_hours != "") {
            const closing_hours = values.closing_hours.map(p => {
                return p && p !== "none" ? p.format() : "none";
            });
            closingHours = closing_hours.join(",");
        }
        const data = new FormData();
        if (values.is_shipping == false) {
            values.shipping_distance = 0
        }

        data.append("jsonData", JSON.stringify({
            //email: "golan@gmail.com",
            email: values.email,
            google_name: values.google_name,
            google_family_name: values.google_family_name,
            google_profile_picture: values.google_profile_picture,
            shipping_distance: values.shipping_distance,
            is_shipping: values.is_shipping,
            opening_hours: openingHours,
            closing_hours: closingHours,
            farm_name: values.farm_name,
            about: values.about,
            phone_number_official: values.phone_number_official,
            phone_number_whatsapp: values.phone_number_whatsapp,
            phone_number_telegram: "0",
            address: values.address,
            types_of_products: values.types_of_products,
            farmer_name: values.farmer_name,
            delivery_details: values.delivery_details,
            products: values.products,
            farm_site: values.farm_site,
            facebook: values.facebook,
            instagram: values.instagram

        }))
        if (values.logo_picture) {
            for (let i = 0; i < values.logo_picture.length; i++) {
                data.append("files[]", values.logo_picture[i]);
                data.append("labels[]", "1");
            }
        }
        if (values.products_pictures) {
            for (let i = 0; i < values.products_pictures.length; i++) {
                data.append("files[]", values.products_pictures[i]);
                data.append("labels[]", "2");
            }
        }
        if (values.farm_pictures) {
            for (let i = 0; i < values.farm_pictures.length; i++) {
                data.append("files[]", values.farm_pictures[i]);
                data.append("labels[]", "3");
            }
        }
        //console.log(image)
        //console.log(productsImages)
        //console.log(farmImages)


        axios.post("http://127.0.0.1:5000/signup", data)
            .then(function (response) {
                localStorage.setItem('profilePicture', response.data.logo_picture);
                //handle success
                //setShowSuccessMessage(true);
                axios({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/logintoken',
                    data: {
                        email: values.email
                    }
                })
                    .then(function (response) {
                        props.setToken(response.data.access_token);
                        localStorage.setItem('email', values.email);
                        localStorage.setItem('farmName', values.farm_name)
                        setShowSuccessMessage(true);

                        //alert('נרשמת בהצלחה. מיד תועבר לאתר.');
                        
                        //navigate('/bullboard');
                    })
                    .catch(function (error) {
                        if (error.response && error.response.status === 409) {
                            alert('הפרטים שהוזנו שגויים');
                        }
                    });

                //alert('המשתמש נוסף בהצלחה.');  
                //window.location.href = '/';

            })
            .catch(function (error) {
                //handle error
                if (error.response && error.response.status === 409) {
                    alert("שגיאה");
                    alert("המייל שאיתו ביקשתם להירשם כבר רשום במערכת.");
                }
                if (error.response && error.response.status === 405) {
                    alert("שגיאה");
                    alert("יש להירשם עם כתובת גוגל תקינה בעמוד הראשון.");
                }

            });
    };

    return (

        <form autoComplete="off" >
          <ThemeProvider theme={theme}>
            {!showSuccessMessage && (
                <Box bgcolor="#f7f1e5" boxShadow={0} borderRadius={2} mr={2.3} mt={0.1} border={2} display="flex" flexDirection={"column"} width={580} alignItems={"center"} justifyContent={"center"} paddingBottom={3} paddingX={5} paddingTop={20} sx={{ border: '1.5px solid #f7f1e5'}}  >
                <Box>
                <Typography color="#37474f" fontFamily="aleph" fontWeight={'bold'} fontSize={50} marginTop="-9.2rem" variant='h3' textAlign={"center"}> הרשמת חקלאי </Typography>
                <Typography color="#37474f" fontFamily="aleph" minHeight={45} fontWeight={'bold'} fontSize={22}  mr={-1} marginTop={3} variant='h2'  textAlign={"center"}>שלב 7 - אישור והרשמה</Typography>
                <Typography color="#37474f" fontFamily="aleph" minHeight={45} fontWeight={'bold'} fontSize={16}  mr={-1} variant='h2'  textAlign={"center"}>הפרטים ניתנים לשינוי גם לאחר סיום הליך ההרשמה</Typography>
                </Box>
                <>
                <Grid container direction="column" spacing={2} dir="rtl" style={{ fontFamily: "aleph" }}>
                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            שם העסק:
                        </Typography>
                        <Typography maxWidth={580} variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.farm_name || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            שם איש הקשר:
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.farmer_name || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            כתובת:
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.address || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            מספר טלפון של העסק:
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.phone_number_official || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            מספר וואטסאפ:
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.phone_number_whatsapp || "לא הוגדר"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            שעות פתיחה:
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           ראשון - {days.sunday}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           שני - {days.monday}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           שלישי - {days.tuesday}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           רביעי - {days.wednesday}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           חמישי - {days.thursday}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           שישי - {days.friday}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                           שבת - {days.saturday}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            העסק עושה משלוחים?
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                            {shipping}
                        </Typography>
                    </Grid>

                    {shipping == "כן" && (
                        <Grid item>
                            <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                                טווח המשלוח:
                            </Typography>
                            <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                                עד {km} ק"מ מ{values.address}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            מדיניות הזמנות ומשלוחים:
                        </Typography>
                        <Typography style={{ maxWidth: '580px', wordWrap: 'break-word'}} variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.delivery_details || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            סוגי מוצרים:
                        </Typography>
                        <Typography variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.types_of_products.replace(/,/g, ', ') || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            מחירון:
                        </Typography>
                        <Typography style={{ maxWidth: '580px', wordWrap: 'break-word'}} variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.products || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            אתר העסק:
                        </Typography>
                        <Typography maxWidth={580} variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.farm_site || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            פייסבוק:
                        </Typography>
                        <Typography maxWidth={580} variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.facebook || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            אינסטגרם:
                        </Typography>
                        <Typography maxWidth={580} variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.instagram || "לא הוגדר"}
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" color="textSecondary" textAlign={"center"} sx={{textDecoration: 'underline'}}>
                            ספרו על עצמכם:
                        </Typography>
                        <Typography style={{ 
                                maxWidth: '580px', 
                                wordWrap: 'break-word'
                            }}  variant="body2" color="textPrimary" textAlign={"center"}>
                            {values.about || "לא הוגדר"}
                        </Typography>
                    </Grid>

                </Grid>

                </>

            </Box>)}


            {showSuccessMessage && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000 // to ensure the modal is on top
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',       // Increased padding for larger appearance
              borderRadius: '10px',
              fontSize: '40px',      // Increased font size
              width: '800px',
              height: "300px",        // Set a width
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              border: '3px solid #ffb74d'   // Added a subtle shadow for depth
            }}>
            {/* This is the animated welcome message */}
            <div dir='rtl' style={modalTextStyle}>
                {`שלום ${values.farm_name.length > 25 ? values.farm_name.slice(0,26) + "..." : values.farm_name}!`.replace(/\s/g, '\u00A0').split('').map((char, index) => (
                    <span key={index} style={{animationDelay: `${index * 0.05}s` }} className={char === ' ' ? '' : "fade-in"}>
                        {char}
                    </span>
                ))}
            </div>
            <div dir='rtl' style={modalTextStyle}>
                {`כיף שהצטרפתם אלינו ל - U2sremraF!`.replace(/\s/g, '\u00A0').split('').map((char, index) => (
                    <span key={index} style={{animationDelay: `${(index + `שלום ${values.farm_name.length > 25 ? values.farm_name.slice(0,26) + "..." : values.farm_name}!`.length) * 0.05}s` }} className={char === ' ' ? '' : "fade-in"}>
                        {char}
                    </span>
                ))}
            </div>
            <div dir='rtl' style={modalTextSmallStyle}>
                {`מיד תועברו ללוח המודעות`.replace(/\s/g, '\u00A0').split('').map((char, index) => (
                    <span key={index} style={{animationDelay: `${(index + `שלום ${values.farm_name.length > 25 ? values.farm_name.slice(0,26) + "..." : values.farm_name}!`.length + `כיף שהצטרפתם אלינו ל - U2sremraF!`.length) * 0.05}s` }} className={char === ' ' ? '' : "fade-in"}>
                        {char}
                    </span>
                ))}
            </div>
        </div>
    </div>
)}

            </ThemeProvider>
            <Button style={{
                        borderWidth: '1px', minWidth: "30px", backgroundColor: "#ffb74d", 
                        marginTop: '0px',
                        marginLeft: "27%", fontFamily: "aleph", fontSize: 16,
                        color: "#212121",
                    }} disabled={!isFormValid} variant="outlined" sx={{ borderColor: 'black' }} onClick={submitHandler} > אישור ושליחה 
                    </Button>
        </form>
    );
};

export default FormSummary;