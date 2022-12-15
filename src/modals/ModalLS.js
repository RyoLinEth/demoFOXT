import React, { useRef } from 'react';
import { ethers } from 'ethers'

const ModalLS = ({ open, onClose, tokencontract, defaultAccount, contractAddress, contract, playVideo }) => {

  const makeApprove = async () => {
    const approveAmount = ethers.BigNumber.from("10000000000000000000000000");
    await tokencontract.approve(contractAddress, approveAmount);
  }

  const checkAllowance = async () => {
    let allowance = await tokencontract.allowance(defaultAccount, contractAddress);
    const approveAmount = ethers.BigNumber.from("1000000000000000000000000");
    if (allowance > approveAmount)
      return true;
    return false;
  }

  const checkResult = async (number, betTime) => {
    console.log("Checking Result...");
    try {
      let result = await contract.viewHistory2(defaultAccount);
      if (result[betTime] === undefined) {
        setTimeout(
          async function () {
            checkResult(number, betTime)
          }, 1000)
        return;
      }
      let winOrLose = result[betTime][5];
      console.log("The bet result is : " + winOrLose);

      if (number === 1) {
        console.log("Your bet is Large!")
        if (winOrLose === 1) {
          /*Todo : Pop a large result wheel : 5-9 */
          playVideo(5)
        }
        else {
          /*Todo : Pop a small result wheel : 0-4 */
          playVideo(0)
        }

      }
      if (number === 0) {
        console.log("Your bet is Small!")
        if (winOrLose === 0) {
          /*Todo : Pop a large result wheel : 5-9 */
          playVideo(5)
        }
        else {
          /*Todo : Pop a small result wheel : 0-4 */
          playVideo(0)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const makeGuessLarge = async (event) => {
    event.preventDefault();
    const betTime = await contract.userInfo(defaultAccount);
    console.log("Bet Time : " + betTime);
    const value = document.getElementById("amount").value;
    if (value.includes(".") || value === "") {
      alert("Invalid number!! You can only bet with integer amount.")
      return;
    }
    let haveApproved = await checkAllowance()
    if (!haveApproved) await makeApprove()
    let result = await contract.makeGuess(value, 1, 1);
    console.log(result)
    setTimeout(
      async function () {
        await checkResult(1, betTime)
      }, 1000)
  }

  const makeGuessSmall = async (event) => {
    event.preventDefault();
    const betTime = await contract.userInfo(defaultAccount);
    console.log("Bet Time : " + betTime);
    const value = document.getElementById("amount").value;
    if (value.includes(".") || value === "") {
      alert("Invalid number!! You can only bet with integer amount.")
      return;
    }
    let haveApproved = await checkAllowance()
    if (!haveApproved) await makeApprove()
    let result = await contract.makeGuess(value, 1, 0);
    setTimeout(
      async function () {
        await checkResult(0, betTime)
      }, 1000)
  }


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
            <form>
              <h4>Make Bet!!</h4><br />

              <input type="number" id="amount" name="amount" placeholder="You can only bet with integer amount" /><br />
            </form>
          </div>
          <div className='btnContainer'>
            <input type="submit" value="Large" className='btnPrimary' onClick={makeGuessLarge} />
            <input type="submit" value="Small" className='btnOutline' onClick={makeGuessSmall} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLS;