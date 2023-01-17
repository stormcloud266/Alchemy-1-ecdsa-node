import server from "./server";
import { ACCOUNTS } from "./FakeWallet";

function Wallet({ setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <select onChange={onChange}>
          <option value="">Please choose an account</option>
          {ACCOUNTS.map((publicKey) => (
            <option value={publicKey} key={publicKey}>
              {publicKey.slice(0, 8)}
            </option>
          ))}
        </select>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
