import { Connection, Keypair, SystemProgram, PublicKey, ConfirmOptions, Commitment } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { Week1, IDL } from "./programs/week1";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

import wallet from "./wallet/wba-wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "finalized"});

// Create our program
const program = new Program<Week1>(IDL, "ctf1VWeMtgxa24zZevsXqDg6xvcMVy4FbP3cxLCpGha" as Address, provider);

// Use the PDA for our CTF-Week1 profile
const profilePda = PublicKey.findProgramAddressSync([Buffer.from("profile"), keypair.publicKey.toBuffer()], program.programId)[0];

// Paste here the mint address for challenge1 token
const mint = new PublicKey("APZ2xjCg26vNZ44k8yxao9Ge9uQYZcaw8sDcgfCidUy2");

// Create the PDA for the Challenge1 Vault
const vault = PublicKey.findProgramAddressSync([Buffer.from("vault1"), keypair.publicKey.toBuffer(), mint.toBuffer()], program.programId)[0];

(async () => {
    try {

      const confirmOptions : ConfirmOptions = { commitment: 'finalized' }
      const commitment : Commitment ='finalized' 

        // NB if you get TokenAccountNotFoundError, wait a few seconds and try again!

        // Create the ATA for your Wallet
        const ownerAta = getOrCreateAssociatedTokenAccount(
            connection, keypair, mint, keypair.publicKey, undefined, commitment, confirmOptions 
        );

        console.log(`Your ata is: ${(await ownerAta).address.toBase58()}`);

        // Mint some tokens!
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            (await ownerAta).address, 
            keypair.publicKey,
            1
        )
        
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${mintTx}?cluster=devnet`);
        
        // Complete the Challenge!
        const completeTx = await program.methods
        .completeChallenge1(new BN(1))
        .accounts({
            owner: keypair.publicKey,
            ata: (await ownerAta).address,
            profile: profilePda,
            vault: vault,
            mint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId
        })
        .signers([
            keypair
        ]).rpc();

        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${completeTx}?cluster=devnet`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();

// https://explorer.solana.com/tx/TiFC7waw8Bqcvjyjr2urJP2pU5kP32C3D1XCHPG4RYxz1TBeFa3TAaKaCHWdvaut7pAqyZA3Ds7RoL8wcgfRMgd?cluster=devnet