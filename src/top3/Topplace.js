import React from 'react'

import FirstPlaceImage from '../image/win1.png';
import SecondPlaceImage from '../image/win2.png';
import ThirdPlaceImage from '../image/win3.png';

const Topplace = ({ top, top2, top3, day }) => {
    let theDay = "Yesterday";
    const checkDay = () => {
        if (day === 1) {
            theDay = "Today"
        }
    }
    checkDay()
    return (
        <div>
            <div className="FirstThreeTable_Title">
                <div className="titlespan"></div>
                <h5 className="FirstThreeTable_TitleContent">Top Three {theDay}</h5>
                <h5 className="FirstThreeTable_Rule" align="right">Rule</h5>
            </div>
            <div className="FirstThreeTable_Content">
                <div className="FirstThreeTable_Picture">
                    <div className="FirstThreeTable_SecondPlace">
                        <img src={SecondPlaceImage} id="SecondPlaceImage" />
                        <h5 align="middle">{top2}</h5>
                    </div>
                    <div className="FirstThreeTable_FirstPlace">
                        <img src={FirstPlaceImage} id="FirstPlaceImage" />
                        <h5 align="middle">{top}</h5>
                    </div>
                    <div className="FirstThreeTable_ThridPlace">
                        <img src={ThirdPlaceImage} id="ThirdPlaceImage" />
                        <h5>{top3}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Topplace
