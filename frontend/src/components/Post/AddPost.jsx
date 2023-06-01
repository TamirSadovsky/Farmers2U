import styled from '@emotion/styled'
import { Add, AddPhotoAlternate } from '@mui/icons-material'
import { Avatar, Box, Button, 
    Fab, FormControlLabel, 
    FormLabel, IconButton, 
    Modal, Radio, RadioGroup, 
    TextField, Tooltip, Typography, ThemeProvider, createTheme, useTheme 
} from '@mui/material'
import { DatePicker, LocalizationProvider, 
    TimeField } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useState, useRef } from 'react'

const StyledModal = styled(Modal)({
  direction: 'rtl',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const UserBox = styled(Box)({
  direction: 'rtl',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '10px'
})

const {palette} = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const themeForButton = createTheme({
  palette: {
    button: createColor('#E8AA42'),
  },
});


const AddPost = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(dayjs().startOf('day'));
  const [value2, setValue2] = useState(dayjs('2022-04-17T15:30'));
  const [value3, setValue3] = useState(dayjs('2022-04-17T15:30'));
  const [postData, setPostData] = useState({});
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);
  const storedEmail = localStorage.getItem('email');



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;
    if (name === 'row-radio-buttons-group') {
      if (value === "בש&quot;ח לק&quot;ג") {
        updatedValue = true;
      } else {
        updatedValue = false;
      }
      setPostData({
        ...postData,
        priceType: updatedValue,
      });
    } else {
      setPostData({
        ...postData,
        [name]: value,
      });
    }
  };


  const handlePost = () => { /* The actual object to extract to the backend */

    const imageData = {};

    if (image) {
      imageData = {image: image}
    }
    const handleRequest = () => {
        axios({
          method: "POST",
          url: "http://127.0.0.1:5000/api/posts",
          data:{
          text: postData.text,
          location: postData.location,
          date: value.format('YYYY-MM-DD'),
          startTime: value2.format('HH:mm'),
          endTime: value3.format('HH:mm'),
          lowPrice: postData.lowPrice,
          highPrice: postData.highPrice,
          ...imageData,
          email: storedEmail,
          }
        })
        .then((response) => {
            console.log(response.data)
            window.location.reload()
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            const errorMessage = error.response.data.error;
            window.alert(errorMessage);
          } else {
            console.error(error);
          }
        })
    }
    handleRequest()
  }


  return (
    <div>
      <ThemeProvider theme={themeForButton}>
      <Tooltip onClick={() => setOpen(true)} title="פרסום מודעה" 
      sx={{ position: 'fixed', bottom: 20, left: 40 }}>
        <Fab color="button" aria-label="add">
          <Add />
        </Fab>
      </Tooltip>
      <StyledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box width={400} height={530} bgcolor="white" p={3} borderRadius={1} 
        sx={{ direction: 'ltr', overflowY: 'scroll' }}>
          <Typography variant="h6" color="gray" textAlign="center">
            ערכו מודעה
          </Typography>
          <UserBox>
            <Avatar src="/Board_images/farmer1.jpg" sx={{ width: 30, height: 30 }} />
            <Typography fontWeight={500} variant="span">
              דוד כהן
            </Typography>
          </UserBox>
          <TextField
            sx={{ width: '100%', direction: 'rtl' }}
            id="standard-multiline-static"
            multiline
            rows={4}
            placeholder="מה תרצו לפרסם?"
            variant="standard"
            name="text"
            value={postData.text || ''}
            onChange={handleChange}
          />
          <TextField
            placeholder="כתובת/מיקום"
            sx={{ width: '100%', paddingTop: '15px', direction: 'rtl' }}
            name="location"
            value={postData.location || ''}
            onChange={handleChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" paddingTop={2} justifyContent="center">
              <DatePicker label={'תאריך '} views={['day']} 
              value={value} onChange={(newValue) => setValue(newValue)} />
            </Box>
            <Box display="flex" gap={2} paddingTop={2}>
              <TimeField label="שעת התחלה" format="HH:mm" value={value2} 
              onChange={(newValue) => setValue2(newValue)} />
              <TimeField label="שעת סיום" format="HH:mm" value={value3} 
              onChange={(newValue) => setValue3(newValue)} />
            </Box>
          </LocalizationProvider>
          <Box display="flex" gap={3} paddingTop={2} sx={{ direction: 'rtl' }}>
            <TextField type="number" inputProps={{ step: 1, min: 0 }} 
            placeholder="מחיר" helperText="המחיר הנמוך ביותר בטווח"
            name="lowPrice"
            value={postData.lowPrice || ''}
            onChange={handleChange}
           />
            <TextField type="number" inputProps={{ step: 1, min: 0 }} 
            placeholder="מחיר" helperText="המחיר הגבוה ביותר בטווח" 
            name="highPrice"
            value={postData.highPrice || ''}
            onChange={handleChange}
           />
          </Box>
          <FormLabel id="radio-buttons-group-label" sx={{ display: 'flex', justifyContent: 'center' }}>
            :המחירים הינם
          </FormLabel>
          <Box display="flex" sx={{ direction: 'rtl', justifyContent: 'center', right: '500px' }}>
            <RadioGroup
              row
              aria-labelledby="radio-buttons-group-label"
              defaultValue="בש&quot;ח לק&quot;ג"
              name="row-radio-buttons-group"
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
              onChange={handleChange}
            >
              <FormControlLabel value="בש&quot;ח" control={<Radio />} label="בש&quot;ח" />
              <FormControlLabel value="בש&quot;ח לק&quot;ג" 
              control={<Radio />} label="בש&quot;ח לק&quot;ג" />
            </RadioGroup>
          </Box>
          <Box display="flex" paddingTop={2} gap={15} sx={{ direction: 'rtl' }}>
            <input type="file" 
            onChange={handleImageChange}
            style={{display: 'none'}}
            ref={inputRef} />
            <IconButton aria-label="העלה תמונה" color="primary"
            onClick={() => inputRef.current.click()}>
              <AddPhotoAlternate />
            </IconButton>
            <Button variant="contained" 
            sx={{ direction: 'rtl' }} onClick={handlePost}>
              פרסמו
            </Button>
          </Box>
        </Box>
      </StyledModal>
      </ThemeProvider>
    </div>
  )
}

export default AddPost


