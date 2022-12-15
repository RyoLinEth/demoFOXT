import React, { useState } from 'react';

const HistoryCard = ({ data }) => {
    let WhatGame = "";
    let HowMany = 0;
    let result = "";
    let GuessID = 0;

    const readData = async () => {
        let game = data[0].toNumber()
        let option = data[1].toNumber();
        let amount = data[2].toNumber();
        let time = data[3].toNumber();
        let personalGuessID = data[4].toNumber();
        let winOrLose = data[5].toNumber();

        if (game === 0) {
            if (option === 0) WhatGame = "Double"
            else WhatGame = "Single"
        }
        if (game === 1) {
            if (option === 0) WhatGame = "Small"
            else WhatGame = "Large"
        }

        if (winOrLose === 0)
            result = "Win"
        else result = "Lose"
        HowMany = amount/Math.pow(10,6).toFixed(0);
        GuessID = personalGuessID
    }

    readData();

    return (
        <div className='historyBox'>
            <div className="HistorySameRow" id='HistoryRow'>
                <div className="HistorySameRow1"></div>
                <div className="HistorySameRow1">
                    <span><h5 align="left">ID </h5><h5 align="left">{GuessID}</h5></span>
                </div>
                <div className="HistorySameRow2">
                    <span><h5 align="left">Bet </h5><h5 align="left">{WhatGame}</h5></span>
                </div>
                <div className="HistorySameRow3">
                    <span><h5 align="left">Amount </h5><h5 align="left">{HowMany}</h5></span>
                </div>
                <div className="HistorySameRow4">
                    <span><h5 align="left">Result </h5><h5 align="left">{result}</h5></span>
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;