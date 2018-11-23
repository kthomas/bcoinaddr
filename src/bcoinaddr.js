const secp256k1 = require('bcrypto/lib/secp256k1');
const ripemd160 = require('bcrypto/lib/ripemd160');
const sha256 = require('bcrypto/lib/sha256');
const { base58 } = require('bstring');

// Generate a bcoin address (public key) using the given hex representation
// of a secp256k1 private key; see http://bcoin.io/guides/generate-address.html
//
// This package was created for the purposes of offline, cross-platform keypair
// discovery leveraging existing community tooling. An initial implementation
// using this package has been created for iOS using Swift.
const bcoinaddr = (privateKey) => {
    // 0 - Having a private ECDSA key
    let privkey = Buffer.from(privateKey, "hex")

    // 1 - Take the corresponding public key generated with it (65 bytes, 1 byte 0x04, 32 bytes corresponding to X coordinate, 32 bytes corresponding to Y coordinate)
    let pubkey = secp256k1.publicKeyCreate(privkey, false)

    // 2 - Perform SHA-256 hashing on the public key
    let step2 = sha256.digest(pubkey)

    // 3 - Perform RIPEMD-160 hashing on the result of SHA-256
    let step3 = ripemd160.digest(step2)

    // 4 - Add version byte in front of RIPEMD-160 hash (0x00 for Main Network)
    let step4 = Buffer.concat([Buffer.alloc(1), step3])

    // 5 - Perform SHA-256 hash on the extended RIPEMD-160 result
    let step5 = sha256.digest(step4)

    // 6 - Perform SHA-256 hash on the result of the previous SHA-256 hash
    let step6 = sha256.digest(step5)

    // 7 - Take the first 4 bytes of the second SHA-256 hash. This is the address checksum
    let step7 = step6.slice(0, 4)

    // 8 - Add the 4 checksum bytes from stage 7 at the end of extended RIPEMD-160 hash from stage 4. This is the 25-byte binary Bitcoin Address.
    let step8 = Buffer.concat([step4, step7])

    // 9 - Convert the result from a byte string into a base58 string using Base58Check encoding. This is the most commonly used Bitcoin Address format
    return base58.encode(step8)
}

export default main

if (privateKey && typeof(publicKey) != undefined) {
    publicKey = main(privateKey)
}
