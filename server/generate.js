const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const private = toHex(secp.utils.randomPrivateKey());
console.log("private: ", private);

const public = toHex(secp.getPublicKey(private));
console.log("public: ", public);
