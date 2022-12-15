import React from 'react';
import HistoryContainer from '../history/HistoryContainer';

const ModalHistory = ({ open, onClose, data, totalBet }) => {

    if (!open) return null;
    return (
        <div onClick={onClose} className='overlay'>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="modalContainer"
            >

                <div className='modalRight'>
                    <p className='closeBtn' onClick={onClose}>
                        X
                    </p>
                    <div className='content'>
                        <div className='HistoryContent'>
                            Personal History | Total Bets : {totalBet}
                            <HistoryContainer
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalHistory;