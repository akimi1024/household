import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../calender.css"
import { EventContentArg } from '@fullcalendar/core'
import { balance, CalenderContent, Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formantCurrency } from '../utils/formatting'

interface CalenderProps {
  monthlyTransactions: Transaction[]
}

const Calender = ({monthlyTransactions}: CalenderProps) => {
  const events = [
    {title: "Meeting", start: new Date(), income: 300, expense: 200, balance: 100 }
  ]

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

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView='dayGridMonth'
      events={calenderEvents}
      eventContent={renderEventContent}
    />
  )
}

export default Calender