

import React, { Component } from "react";

import img1 from "../../resources/images/exchange/exchangeAdmin.png"

class exchangeReservation extends Component {

    componentDidMount(){
        
    }
    ddalert(){
        
    }
    render() {
        return (
            <div onClick={()=>alert('select * from exchange; ')} style={{width:"100%", height:'100%'}}>
                <img
                    src={img1}
                    style={{margin:'auto'}}
                    width="1500"
                    height="100%"
                />
            </div>
        )
    }

}

export default exchangeReservation;

