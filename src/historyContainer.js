import React from 'react'
import MyHistory from './myHistory'

const historyContainer = ({ totalBet, defaultAccount, contract }) => {
    return (
        <div>
            {totalBet.map((index) => {
                return < MyHistory
                    guessing={index}
                    defaultAccount={defaultAccount}
                    contract={contract}
                />
            })
            }
        </div>
    )
}

export default historyContainer
