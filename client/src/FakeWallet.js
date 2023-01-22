import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export const WALLETS = [
  {
    publicKey:
      "0403c9d7a8b5ecf43223092bc7268121a65d2c8d100dbc4d080806822f3f4e014b413d282f5d073a830c950b6abffa90b4b20fb398b9c9d9d8a4b96e518113f4a7",
    privateKey:
      "0dfcf9e615f93b9ce0f8b9113213d8c8e0816239fb81d6c3e0bfb7f883bb590c",
  },

  {
    publicKey:
      "04cc2c18ea8f0b28076f9317990afcb2d797cd5d210379df3351779aa440115f0c4e54bcfe0ec85263dc9db7a735f040e5d1fe91e63b51e415a7c6de710eee7d65",
    privateKey:
      "1eece5a79b0f38581425b71d4b54534a24adee629c6f4240d2d4b6bd8c900b79",
  },
  {
    publicKey:
      "0485da5de17611c5430867afdfcdf16779074e02e9415094111e2eef4f46db23d091c8c55f6f7ca00433e637972540fcb35d12cb858c8f0560ed1134ff607ff922",
    privateKey:
      "b4c66d6eb6884f50ae7b8589b7aac117a97fcf8e3b317adf2a5aa67ed655aeae",
  },
];

export const ACCOUNTS = WALLETS.map(({ publicKey }) => publicKey);

export const hashMessage = (msg) => {
  return keccak256(utf8ToBytes(msg));
};

export const signMessage = async (message, privateKey) => {
  const hash = hashMessage(message);
  const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
    recovered: true,
  });
  return toHex(new Uint8Array([recoveryBit, ...signature]));
};
