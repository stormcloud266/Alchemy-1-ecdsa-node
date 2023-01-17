import { useState } from "react";
import server from "./server";
import { ACCOUNTS, WALLETS, signMessage } from "./FakeWallet";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const signature = await signMessage(
      "sending",
      WALLETS.find(({ publicKey }) => publicKey === address).privateKey
    );
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <select onChange={setValue(setRecipient)}>
          <option value="">Please choose an account</option>
          {ACCOUNTS.map((publicKey) => (
            <option value={publicKey} key={publicKey}>
              {publicKey.slice(0, 8)}
            </option>
          ))}
        </select>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
