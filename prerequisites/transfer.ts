import { Transaction, SystemProgram, Connection, Keypair,
  LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from
  "@solana/web3.js"

  import wallet from "./dev-wallet.json"

  const from = Keypair.fromSecretKey(new Uint8Array(wallet));

  const to = new PublicKey("FexVSkWTomAziTdHs2E4FyDougLbCEZXjHLn4vaPhmiB");

  const connection = new Connection("https://api.devnet.solana.com");

//   (async () => {
//     try {
//     const transaction = new Transaction().add(
//     SystemProgram.transfer({
//     fromPubkey: from.publicKey,
//     toPubkey: to,
//     lamports: LAMPORTS_PER_SOL/100,
//     })
//     );
//     transaction.recentBlockhash = (await
    
//     connection.getLatestBlockhash('confirmed')).blockhash;
    
//     transaction.feePayer = from.publicKey;
//     // Sign transaction, broadcast, and confirm
//     const signature = await sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [from]
    
//     );
//     console.log(`Success! Check out your TX here:
//     https://explorer.solana.com/tx/${signature}?cluster=devnet`);
//     } catch(e) {
//     console.error(`Oops, something went wrong: ${e}`)
//     }
// })();

(async () => {
try {
// Get balance of dev wallet
const balance = await connection.getBalance(from.publicKey)
// Create a test transaction to calculate fees
const transaction = new Transaction().add(
SystemProgram.transfer({
fromPubkey: from.publicKey,
toPubkey: to,
lamports: balance,
})
);
transaction.recentBlockhash = (await

connection.getLatestBlockhash('confirmed')).blockhash;

transaction.feePayer = from.publicKey;
// Calculate exact fee rate to transfer entire SOL amount out of account minus fees

const fee = (await

connection.getFeeForMessage(transaction.compileMessage(),
'confirmed')).value || 0;

// Remove our transfer instruction to replace it
transaction.instructions.pop();
// Now add the instruction back with correct amount of lamports

transaction.add(
SystemProgram.transfer({
fromPubkey: from.publicKey,
toPubkey: to,
lamports: balance - fee,
})
);
// Sign transaction, broadcast, and confirm
const signature = await sendAndConfirmTransaction(
connection,
transaction,
[from]
);
console.log(`Success! Check out your TX here:
https://explorer.solana.com/tx/${signature}?cluster=devnet`)
} catch(e) {
console.error(`Oops, something went wrong: ${e}`)
}
})();

(async () => {
  try {
  // Get balance of dev wallet
  const balance = await connection.getBalance(from.publicKey)
  // Create a test transaction to calculate fees
  const transaction = new Transaction().add(
  SystemProgram.transfer({
  fromPubkey: from.publicKey,
  toPubkey: to,
  lamports: balance,
  })
  );
  transaction.recentBlockhash = (await
  
  connection.getLatestBlockhash('confirmed')).blockhash;
  
  transaction.feePayer = from.publicKey;

  // Calculate exact fee rate to transfer entire SOL amount out of account minus fees

  const fee = (await

    connection.getFeeForMessage(transaction.compileMessage(),
    'confirmed')).value || 0;
    
    // Remove our transfer instruction to replace it
    transaction.instructions.pop();
    // Now add the instruction back with correct amount of lamports
    
    transaction.add(
    SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports: balance - fee,
    })
    );
    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
    );
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch(e) {
    console.error(`Oops, something went wrong: ${e}`)
    }
    })();


//     https://explorer.solana.com/tx/3xeYEj4MQfKELJpLYR9itjagbqa3tzXwi4Du46FcuUBPsqbbyyhNNJuox1TZNjmkpf8e1kVy2uSFB9zMUZhNzgbf?cluster=devnet

// https://explorer.solana.com/tx/3xeYEj4MQfKELJpLYR9itjagbqa3tzXwi4Du46FcuUBPsqbbyyhNNJuox1TZNjmkpf8e1kVy2uSFB9zMUZhNzgbf?cluster=devnet

// https://explorer.solana.com/tx/5SLGnidXGkjvUwcV7ownJdYMjsVmyRkqZdcd3vpwAdJjx9Th9sUQuyrE84uq5fPXev2bWPQQy2EakwH6tcMwuDcj?cluster=devnet

// https://explorer.solana.com/tx/2vz915akTyaK4s8zMAvupvtqsiJ7hJgq4kigSQJtpBsk5v6wCpcRM5nbETaU9iSUN6SkrCeMK92rEUU9gVE9ErcK?cluster=devnet


// send all sol
// https://explorer.solana.com/tx/4rQWDa4vdRQkDdrbjFsKnaeJizFHFYoYXcBP3rCm8tgTV96JN8BPtUUjNw7xnfqtGc1ZTuFCKQ2Mj7KZ8sieYLMG?cluster=devnet