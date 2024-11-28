import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../calender.css"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { balance, CalenderContent } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formantCurrency } from '../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'
import useMonthlyTransactions from '../hooks/useMonthlyTransactions'
import { useAppContext } from '../context/AppContext'

interface CalenderProps {
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>,
  currentDay: string,
  today: string,
  onDateClick: (dateInfo: DateClickArg) => void
}

const Calender =
  ({
    setCurrentDay,
    currentDay,
    today,
    onDateClick
  }: CalenderProps) => {
    const monthlyTransactions = useMonthlyTransactions()
    const { setCurrentMonth } = useAppContext()

    const theme = useTheme()

    // 日付ごとの収支を計算
    const dailyBalances = calculateDailyBalances(monthlyTransactions)

    /**
     * fullcalendar用のイベントを生成
     * @param dailyBalances
     * @returns
     */
    const createCalenderEvents = (dailyBalances: Record<string, balance>): CalenderContent[] => {
      return Object.keys(dailyBalances).map((date) => {
        const { income, expense, balance } = dailyBalances[date]
        return {
          start: date,
          income: formantCurrency(income),
          expense: formantCurrency(expense),
          balance: formantCurrency(balance)
        }
      })
    }

    const calenderEvents = createCalenderEvents(dailyBalances)

    const backgroundEvent = {
      start: currentDay,
      display: "background",
      backgroundColor: theme.palette.incomeColor.light
    }

    const renderEventContent = (eventInfo: EventContentArg) => {
      return (
        <div>
          <div className='money' id="event-income">
            {eventInfo.event.extendedProps.income}
          </div>
          <div className='money' id="event-expense">
            {eventInfo.event.extendedProps.expense}
          </div>
          <div className='money' id="event-balance">
            {eventInfo.event.extendedProps.balance}
          </div>
        </div>
      )
    }

    /**
     * 月の日付を取得
     * @param dateSetInfo
     */
    const handleDateSet = (dateSetInfo: DatesSetArg) => {
      const currentMonth = dateSetInfo.view.currentStart
      setCurrentMonth(currentMonth)
      const toDate = new Date()
      if (isSameMonth(toDate, currentMonth)) {
        setCurrentDay(today)
      }
    }

    return (
      <FullCalendar
        locale={jaLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={[...calenderEvents, backgroundEvent]}
        eventContent={renderEventContent}
        datesSet={handleDateSet}
        dateClick={onDateClick}
      />
    )
  }

export default Calender