import React, { useState } from 'react';
import { ethers } from 'ethers'

const ModalGame = ({ open, onClose }) => {
    if (!open) return null;
    return (
        <div onClick={onClose} className='overlay'>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className="modalGameContainer"
            >
                <div className='modalRight'>
                    <p className='closeBtn' onClick={() => onClose(null)}>
                        X
                    </p>
                    <h4 align="middle">FOXT</h4><br />
                    <div className='GamebtnContainer'>
                        <input type="submit" value="Large Small" className='btnPrimary' onClick={() => onClose(1)} />
                        <input type="submit" value="Double Single" className='btnOutline' onClick={() => onClose(0)} />
                    </div>
                    <h4 align="middle">FOX</h4><br />
                    <div className='GamebtnContainer'>
                        <input type="submit" value="Large Small" className='btnOutline' onClick={() => onClose(1)} />
                        <input type="submit" value="Double Single" className='btnPrimary' onClick={() => onClose(0)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalGame;