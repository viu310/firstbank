import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./css/bank.css"
import styles from './css/bank.module.css'
import ts from './css/transfer.module.css'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BankApiService from '../../BankApiService';

export default function BankCalenlar() {
  const sampleId = "111111-11-111066";
  const [detail, setDetail] = useState([]);


  BankApiService.findAutoiList(sampleId)
    .then(res => {
      const list = res.data;
      console.log(">>>" + list[0]);

    })
    .catch(err => {
      console.log('자동이체 조회Error', err);
    });

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={[
        { title: 'Event 1', date: '2024-03-20' },
        { title: 'Event 2', date: '2024-03-21' }
      ]}
    />
  );
}
