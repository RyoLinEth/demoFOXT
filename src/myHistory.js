import React, { useState } from 'react';
import nft from './nft.jpg';
import { ethers } from 'ethers'

const MyHistory = ({ guessing, defaultAccount, contract }) => {
  const [ID, setID] = useState("0")
  const [GuessAmount, setGuessAmount] = useState("0")
  const [GuessTime, setGuessTime] = useState("0")
  const [GuessResult, setGuessResult] = useState("")

  const getHistory = async (index) => {
    let result = await contract.viewGuessHistory(defaultAccount, index)
    console.log(result);
    let realtime = await timeConvert(result.IDToGuessTime.toNumber())

    let amount = await result.IDToGuessAmount.toNumber()
    let guessResult = await result.IDToGuessResult

    setID(index)
    setGuessAmount(amount)
    setGuessTime(realtime)

    if (guessResult === true)
      setGuessResult("Win")
    else
      setGuessResult("Lose")
  }

  const timeConvert = async (index) => {
    var date = new Date(index * 1000);
    console.log(date);
    var RealTime = `${year}-${month + 1}-${realDate} ${hour}`
    var year = date.getFullYear()
    var month = date.getMonth()
    var realDate = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()

    var RealTime = `${year}-${month + 1}-${realDate} | ${hour}:${minute}`
    return RealTime;
  }

  getHistory(0);

  return (
    <div className='historyBox'>
      <div className="HistorySameRow" id='HistoryRow'>
        <div className="HistorySameRow1">
          <span><h5 align="left">ID : </h5><h5 align="left">{ID}</h5></span>
        </div>
        <div className="HistorySameRow2">
          <span><h5 align="left">Time : </h5><h5 align="left">{GuessTime}</h5></span>
        </div>
        <div className="HistorySameRow3">
          <span><h5 align="left">Amount : </h5><h5 align="left">{GuessAmount}</h5></span>
        </div>
        <div className="HistorySameRow4">
          <span><h5 align="left">Result : </h5><h5 align="left">{GuessResult}</h5></span>
        </div>
      </div>
    </div>
  );
};

export default MyHistory;