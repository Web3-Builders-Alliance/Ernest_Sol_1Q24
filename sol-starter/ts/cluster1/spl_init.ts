import { Keypair, Connection, Commitment, ConfirmOptions } from "@solana/web3.js";
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import wallet from "./wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
      // connection.requestAirdrop(keypair.publicKey, 2 * 1000000000);
        // Start here
        const confirmation: ConfirmOptions = {    /** disable transaction verification step */
        skipPreflight: false,
        /** desired commitment level */
        commitment: 'finalized',
        /** preflight commitment level */
        preflightCommitment: commitment,
        /** Maximum number of times for the RPC node to retry sending the transaction to the leader. */
        maxRetries: 2,
        /** The minimum slot that the request can be evaluated at */
        minContextSlot: 1
      }; 
        const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
        console.log(mint);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
