
import React, { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import ExchangeSidebar from "./ExchangeSidebar";
import Calculator from '../exchange/ExchangeCalculator'
import Record from '../exchange/ExchangeRecord'
import Request from '../exchange/ExchangeRequest'
import Reservation from '../exchange/ExchangeReservation'
import Realtime from '../exchange/RealtimeExchange'


function ExchangeContent() {

    return (
        <div className='bankContent'>

            <div>
                <ExchangeSidebar />
            </div>
            <div style={{ minHeight: '50rem' }}>


                <Routes>
                    <Route path="/calculator" exact={true} element={<Calculator/>} />
                    <Route path="/record" exact={true} element={<Record/>} />
                    <Route path="/request" exact={true} element={<Request/>} />
                    <Route path="/reservation" exact={true} element={<Reservation/>} />
                    <Route path="/realtime" exact={true} element={<Realtime/>} />
                </Routes>


            </div>

        </div>
    )
}

export default ExchangeContent;