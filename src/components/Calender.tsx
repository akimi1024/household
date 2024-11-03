import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocale from "@fullcalendar/core/locales/ja"
import "../calender.css"
import { EventContentArg } from '@fullcalendar/core'
import { Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'

interface CalenderProps {
  monthlyTransactions: Transaction[]
}

const Calender = ({monthlyTransactions}: CalenderProps) => {
  const events = [
    {title: "Meeting", start: new Date(), income: 300, expense: 200, balance: 100 }
  ]

  const dailyBalances = calculateDailyBalances(monthlyTransactions)

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
      events={events}
      eventContent={renderEventContent}
    />
  )
}

export default Calender