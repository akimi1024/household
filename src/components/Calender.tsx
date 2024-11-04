import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../calender.css"
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import { balance, CalenderContent, Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formantCurrency } from '../utils/formatting'

interface CalenderProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const Calender = ({monthlyTransactions, setCurrentMonth}: CalenderProps) => {

  // 日付ごとの収支を計算
  const dailyBalances = calculateDailyBalances(monthlyTransactions)

  /**
   * fullcalendar用のイベントを生成
   * @param dailyBalances
   * @returns
   */
  const createCalenderEvents = (dailyBalances: Record<string,balance>): CalenderContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const {income, expense, balance} = dailyBalances[date]
      return  {
        start: date,
        income: formantCurrency(income),
        expense: formantCurrency(expense),
        balance: formantCurrency(balance)
      }
    })
  }

  const calenderEvents = createCalenderEvents(dailyBalances)


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

  const handleDateSet = (dateSetInfo: DatesSetArg) => {
    setCurrentMonth(dateSetInfo.view.currentStart)
  }

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView='dayGridMonth'
      events={calenderEvents}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
    />
  )
}

export default Calender