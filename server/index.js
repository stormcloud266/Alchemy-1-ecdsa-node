const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {
  utf8ToBytes,
  hexToBytes,
  toHex,
} = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const hashMessage = (msg) => keccak256(utf8ToBytes(msg));

async function recoverKey(message, signature) {
  const hash = hashMessage(message);
  const signatureBytes = hexToBytes(signature);
  const publicKey = await secp.recoverPublicKey(
    hash,
    signatureBytes.slice(1),
    signatureBytes[0]
  );

  return toHex(publicKey);
}

const balances = {
  "0403c9d7a8b5ecf43223092bc7268121a65d2c8d100dbc4d080806822f3f4e014b413d282f5d073a830c950b6abffa90b4b20fb398b9c9d9d8a4b96e518113f4a7": 100,
  "04cc2c18ea8f0b28076f9317990afcb2d797cd5d210379df3351779aa440115f0c4e54bcfe0ec85263dc9db7a735f040e5d1fe91e63b51e415a7c6de710eee7d65": 50,
  "0485da5de17611c5430867afdfcdf16779074e02e9415094111e2eef4f46db23d091c8c55f6f7ca00433e637972540fcb35d12cb858c8f0560ed1134ff607ff922": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { recipient, amount, signature } = req.body;

  const sender = await recoverKey("sending", signature);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
