import { Box, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import React from 'react'

const MonthSelector = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Button color={"error"} variant="contained">
        先月
      </Button>
      <DatePicker sx={{mx: 2}}/>
      <Button color={"primary"} variant="contained">
        翌月
      </Button>
    </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector