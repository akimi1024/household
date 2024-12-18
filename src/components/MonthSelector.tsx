import { Box, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { addMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useAppContext } from '../context/AppContext'

const MonthSelector = () => {

  const {currentMonth, setCurrentMonth} = useAppContext()

  // 先月押下時のセット処理
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1)
    setCurrentMonth(previousMonth)
  }

  // 翌月押下時のセット処理
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1)
    setCurrentMonth(nextMonth)
  }

  const handleDateChange = (newDate: Date | null) => {
    if(newDate){
      setCurrentMonth(newDate)
    }
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
    >
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Button onClick={handlePreviousMonth}  color={"error"} variant="contained">
        先月
      </Button>
      <DatePicker
        onChange={handleDateChange}
        value={currentMonth}
        label="年月を選択"
        sx={{mx: 2, background: "white"}}
        views={["year", "month"]}
        format='yyyy/MM'
        slotProps={{
          calendarHeader: {
            format: "yyyy年MM月"
          },
          toolbar: {
            toolbarFormat: "yyyy年MM月"
          }
        }}
      />
      <Button onClick={handleNextMonth} color={"primary"} variant="contained">
        翌月
      </Button>
    </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector