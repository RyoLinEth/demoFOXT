import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers'
import contractABI from './contractabi/contractabi.json'
import tokenABI from './contractabi/tokenabi.json'

import RatVideo from './rat.mp4';

import ModalSD from './modals/ModalSD';
import ModalLS from './modals/ModalLS';
import ModalHistory from './modals/ModalHistory';
import ModalGame from './modals/ModalGame';

import HistoryContainer from './history/HistoryContainer';
import BannerImage from './image/FOXTBanner3.png';
import FirstPlaceImage from './image/win1.png';
import SecondPlaceImage from './image/win2.png';
import ThirdPlaceImage from './image/win3.png';
import Topplace from './top3/Topplace';
import LotteryImage from './image/FOXTLottery.png'

// const Web3 = require('web3');
// let BSCMainnetProvider = 'https://mainnet-rpc.hashbit.org';
// const web3 = new Web3(new Web3.providers.HttpProvider(BSCMainnetProvider));

const contractAddress = "0x8e0252c087C42eE739029d3071180a4d17b6EE1f";   //LotteryCA
const tokenAddress = "0xBD00642B89958c11c0f5c8B470aB767B84cb353d";      //TokenCA

function App() {
  /*
    預先設定的參數
  */

  const [modalGameIsOpen, setModalGameIsOpen] = useState(false);
  const [modalSDIsOpen, setModalSDIsOpen] = useState(false);
  const [modalLSIsOpen, setModalLSIsOpen] = useState(false);
  const [modalHistoryIsOpen, setModalHistoryIsOpen] = useState(false);

  const [totalBet, setTotalBet] = useState("0");
  const [data, setData] = useState([])


  const [FOXTBalance, setFOXTBalance] = useState('0')
  const [tokendecimal, setTokenDecimal] = useState('0')
  const [amount, setAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [connectButtonText, setConnectButtonText] = useState('Connect Wallet')
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokencontract, setTokenContract] = useState(null);
  const [copied, setCopied] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(null);

  const [top, setTop] = useState("0x00...0000")
  const [top2, setTop2] = useState("0x00...0000")
  const [top3, setTop3] = useState("0x00...0000")

  const [Todaytop, setTodayTop] = useState("0x00...0000")
  const [Todaytop2, setTodayTop2] = useState("0x00...0000")
  const [Todaytop3, setTodayTop3] = useState("0x00...0000")



  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    let videoID = document.getElementById("vid");
    videoID.hidden = true;
  };

  const playVideo = (value) => {
    setModalGameIsOpen(false)
    setModalLSIsOpen(false);
    setModalSDIsOpen(false);

    let videoID = document.getElementById("vid");
    videoID.hidden = false;
    if (value === 5)
      console.log("value is 5")
    if (value === 0)
      console.log("value is 0")
    if (value === 1)
      console.log("value is 1")
    if (value === 2)
      console.log("value is 2")
    else
      console.log(value);

    if (videoRef.current) {
      // videoRef.current.requestFullscreen();
      videoRef.current.play();
    }
  };

  const handleGameModalClose = (value) => {
    console.log("Handling game modal close : " + value)
    if (value === 3) {

    }

    if (value === 2) {

    }

    if (value === 1) {
      setModalLSIsOpen(true)
      setModalGameIsOpen(false)
    }

    if (value === 0) {
      setModalSDIsOpen(true)
      setModalGameIsOpen(false)
    }

    if (value === null)
      setModalGameIsOpen(false)
  }

  async function changingAccount() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        connectWalletHandler()
      })
    }
  }

  useEffect(() => {
    changingAccount()
    setTimeout(
      async function () {
        await getStatus()
        await getHistoryData()
        await getTopThreeData()
      }, 1000)
  }, [defaultAccount])

  /*
    ==========================================
    ==========================================
    
      ***  Functions for All project   ***
    
    ==========================================
    ==========================================
  */
  const connectWalletHandler = async () => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(async (result) => {
          await accountChangeHandler(result[0]);
          setConnectButtonText(`${result[0].slice(0, 4)}...${result[0].slice(-4)}`);
        })
    } else {
      setErrorMessage('Need to install MetaMask!')
    }
  }

  //設定預設地址 以及 個人邀請連結
  const accountChangeHandler = async (newAccount) => {
    checkCorrectNetwork();
    setDefaultAccount(newAccount);
    window.sessionStorage.setItem('account', newAccount)

    await updateEthers();
  }

  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner)
    setContract(tempContract);

    let tempTokenContract = new ethers.Contract(tokenAddress, tokenABI, tempSigner)
    setTokenContract(tempTokenContract);
  }

  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const netWorkID = '0x2b6f'

    if (chainId !== netWorkID) {
      setCorrectNetwork(false)
      alert("请连接到正确网络")
    } else {
      setCorrectNetwork(true)
    }
  }


  /*
    ==========================================
    ==========================================
    
      ***  Functions for this project   ***
    
    ==========================================
    ==========================================
  */

  const getStatus = async () => {
    try {
      let decimal = await tokencontract.decimals();
      if (decimal === null) return;
      setTokenDecimal(decimal);

      let tempBalance = await tokencontract.balanceOf(defaultAccount);
      if (tempBalance === null) return;

      await getBetInformation()

      let tempBalanceDividedByDecimal = (tempBalance / Math.pow(10, decimal)).toFixed(2);

      setFOXTBalance(tempBalanceDividedByDecimal);
    } catch { }
  }

  const getBetInformation = async () => {
    let result = await contract.userInfo(defaultAccount)
    if (result === null) return;
    setTotalBet(result.toString());
  }

  const getHistoryData = async () => {
    if (!defaultAccount) return;
    try {
      let result = await contract.viewHistory2(defaultAccount);
      setData(result);
    } catch (err) {
      console.log(err);
    }
  }

  const getDay = async () => {
    let day = await contract.viewDay();
    if (day !== null)
      return day
    else
      setTimeout(await getDay(),1000);
      return;
  }
  
  const getTopThreeData = async () => {
    try {
      let day = await getDay();
      
      let FirstThree = await contract.viewFirstThreePlace(day - 1);

      let topAddr = `${FirstThree[0].slice(0, 4)}...${FirstThree[0].slice(-4)}`
      let topAddr2 = `${FirstThree[1].slice(0, 4)}...${FirstThree[1].slice(-4)}`
      let topAddr3 = `${FirstThree[2].slice(0, 4)}...${FirstThree[2].slice(-4)}`
      setTop(topAddr)
      setTop2(topAddr2)
      setTop3(topAddr3)

      let TodayFirstThree = await contract.viewFirstThreePlace(day);

      let TodaytopAddr = `${TodayFirstThree[0].slice(0, 4)}...${TodayFirstThree[0].slice(-4)}`
      let TodaytopAddr2 = `${TodayFirstThree[1].slice(0, 4)}...${TodayFirstThree[1].slice(-4)}`
      let TodaytopAddr3 = `${TodayFirstThree[2].slice(0, 4)}...${TodayFirstThree[2].slice(-4)}`
      setTop(TodaytopAddr)
      setTop2(TodaytopAddr2)
      setTop3(TodaytopAddr3)
    } catch (err) { console.log(err) }
  }

  return (
    <div className="App">
      <div className="App-header">
        <button onClick={connectWalletHandler} id="ConnectButton" >{connectButtonText}</button>
      </div>

      <div className="App-body">
        <video ref={videoRef} src={RatVideo} id="vid" onEnded={handleVideoEnded} hidden />

        <div className="BannerDiv">
          <span>
            <img src={BannerImage} id="BannerImage" />
          </span>
        </div>

        <h5 align="right">FOXT Balance : {FOXTBalance}</h5>

        <div className="BannerDiv">
          <span>
            <img src={LotteryImage} id="LotteryImage" onClick={() => setModalGameIsOpen(true)} />
          </span>
        </div>

        <div className="GuessDiv">
          <div className="Modal">

            <ModalGame
              open={modalGameIsOpen}
              onClose={handleGameModalClose}
              tokencontract={tokencontract}
              defaultAccount={defaultAccount}
              contractAddress={contractAddress}
              contract={contract}
            />

            <ModalSD
              open={modalSDIsOpen}
              onClose={() => setModalSDIsOpen(false)}
              tokencontract={tokencontract}
              defaultAccount={defaultAccount}
              contractAddress={contractAddress}
              contract={contract}
              playVideo={playVideo}
            />

            <ModalLS
              open={modalLSIsOpen}
              onClose={() => setModalLSIsOpen(false)}
              tokencontract={tokencontract}
              defaultAccount={defaultAccount}
              contractAddress={contractAddress}
              contract={contract}
              playVideo={playVideo}
            />

            <ModalHistory
              open={modalHistoryIsOpen}
              onClose={() => setModalHistoryIsOpen(false)}
              data={data}
              totalBet={totalBet}
            />
          </div>
        </div>

        <div className="FirstThreeTable">
          <br />
          <Topplace
            top={top}
            top2={top2}
            top3={top3}
            day={0}
          />
        </div>

        <div className="FirstThreeTable">
          <br />
          <Topplace
            top={Todaytop}
            top2={Todaytop2}
            top3={Todaytop3}
            day={1}
          />
        </div>

        <div className="StatusTable">
          <div className="TableTop">Personal History | Total Bets : {totalBet}</div>
          <HistoryContainer
            data={data}
          />
        </div>

      </div>
    </div>
  );
}

export default App;
