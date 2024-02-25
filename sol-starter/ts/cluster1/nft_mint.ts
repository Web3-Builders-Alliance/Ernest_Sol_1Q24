import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = await createNft(umi, {
      mint, 
      name: "Generug",
      uri: "https://arweave.net/xOs9Ns2NtaU1F6MTDY1iRRV6tL-Pi_YscBMHVopH3uk",
      sellerFeeBasisPoints: percentAmount(69),
      symbol: "RRR",
    })
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);  
})();

// https://explorer.solana.com/tx/3UqgivmqWSbeY1LC5aJX5EPHBe9xMvBv7tMDteJBcyQy9h2beX1xR8mFW4Z6EtMQtFQURF9HZVc2VHyXAJ26M1Kh?cluster=devnet
// Mint Address:  3SE3BXgNrereEDDeuBeKBR3pgFdK2aFFNPeifjnkVEAu