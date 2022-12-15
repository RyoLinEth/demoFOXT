import React from 'react';
import { ethers } from 'ethers'

const ModalSD = ({ open, onClose, tokencontract, defaultAccount, contractAddress, contract, playVideo }) => {

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
        console.log("Your bet is Single!")
        if (winOrLose === 1) {
          /*Todo : Pop a single result wheel : 1 3 5 7 9 */
          playVideo(1)
        }
        else {
          /*Todo : Pop a small result wheel : 0 2 4 6 8 */
          playVideo(2)
        }

      }
      if (number === 0) {
        console.log("Your bet is Double!")
        if (winOrLose === 0) {
          /*Todo : Pop a single result wheel : 1 3 5 7 9 */
          playVideo(1)
        }
        else {
          /*Todo : Pop a small result wheel : 0 2 4 6 8 */
          playVideo(2)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const makeApprove = async () => {

    const approveAmount = ethers.BigNumber.from("10000000000000000000000000");
    let result = await tokencontract.approve(contractAddress, approveAmount);

    console.log(result);
  }

  const checkAllowance = async () => {
    let allowance = await tokencontract.allowance(defaultAccount, contractAddress);
    console.log(allowance)

    const approveAmount = ethers.BigNumber.from("1000000000000000000000000");
    if (allowance > approveAmount)
      return true;
    return false;
  }

  const makeGuessSingle = async (event) => {
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

    let result = await contract.makeGuess(value, 0, 1);

    setTimeout(
      async function () {
        await checkResult(1, betTime)
      }, 1000)
  }

  const makeGuessDouble = async (event) => {
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

    let result = await contract.makeGuess(value, 0, 0);

    setTimeout(
      async function () {
        await checkResult(1, betTime)
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
              <input type="text" id="amount" name="amount" placeholder="You can only bet with integer amount" /><br />
            </form>
          </div>
          <div className='btnContainer'>
            <input type="submit" value="Single" className='btnPrimary' onClick={makeGuessSingle} />
            <input type="submit" value="Double" className='btnOutline' onClick={makeGuessDouble} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSD;