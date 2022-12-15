import React from 'react'
import HistoryCard from './HistoryCard'

const divStyle = {
    overflow :"hidden"
}

const HistoryContainer = ({ data }) => {
  return (
    <div className="historyContainer" style = {divStyle}>
      {data.map((data, index) => {
        return <HistoryCard data={data} key={index} />
      })}
    </div>
  )
}

export default HistoryContainer