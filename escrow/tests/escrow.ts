import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Escrow } from "../target/types/escrow";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Account, TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, AccountLayout } from "@solana/spl-token";
import { randomBytes } from "crypto";
import { assert } from "chai";


describe("escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Escrow as Program<Escrow>;

  const connection = anchor.getProvider().connection;
  
  const maker = Keypair.generate();
  const taker = Keypair.generate();

  let mintMaker: anchor.web3.PublicKey;
  let mintTaker: anchor.web3.PublicKey;
  let makerSendAta: anchor.web3.PublicKey;
  let makerReceiveAta: anchor.web3.PublicKey;
  let takerSendAta: anchor.web3.PublicKey;
  let takerReceiveAta: anchor.web3.PublicKey;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  it("Airdrop", async () => {
    await connection
      .requestAirdrop(maker.publicKey, LAMPORTS_PER_SOL * 10)
      .then(confirm)
      .then(log);
    await connection
      .requestAirdrop(taker.publicKey, LAMPORTS_PER_SOL * 10)
      .then(confirm)
      .then(log);
  });

  const authPda = PublicKey.findProgramAddressSync([Buffer.from("authority")], program.programId)[0];

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  const seed = new anchor.BN(randomBytes(8));

  const escrow = PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow"),
      maker.publicKey.toBuffer(),
      seed.toBuffer('le', 8)
    ],
    program.programId,
  )[0];

  const vault = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      escrow.toBuffer(),
    ],
    program.programId,
  )[0];

  it("CreateMint", async () => {
    mintMaker = await createMint(
      connection, maker, maker.publicKey, maker.publicKey, 14
    );

    console.log(`mintMaker :: ${mintMaker} `)

    mintTaker = await createMint(
      connection, taker, taker.publicKey, taker.publicKey, 14
    );

    console.log(`mintTaker :: ${mintTaker} `)
  });

  it("Make", async () => {

    makerSendAta = (await getOrCreateAssociatedTokenAccount(
      connection, maker, mintMaker, maker.publicKey
    )).address;

    console.log(`ownerAta :: ${makerSendAta} `)

    await mintTo(
      connection,
      maker,
      mintMaker,
      makerSendAta, 
      maker.publicKey,
      1000
    ).then(confirm)

    const amountToDeposit = new BN(5)

    // Add your test here.
    const tx = await program.methods.make(seed, amountToDeposit).accounts({
      maker: maker.publicKey,
      mintMaker: mintMaker,
      mintTaker: mintTaker,
      makerAta: makerSendAta,
      auth: authPda,
      vault: vault,
      escrow: escrow,
      systemProgram: anchor.web3.SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([maker])
    .rpc()
    .then(confirm)
    .then(log);

    const accountInfo = await connection.getAccountInfo(vault);
    const data = Buffer.from(accountInfo.data);
    const tokenAccountInfo = AccountLayout.decode(data);

    // Assert the escrow account has the correct deposit amount
    assert.equal(
      tokenAccountInfo.amount.toString(),
      amountToDeposit.toString(),
      "Escrow vault account should have the correct deposit amount"
    );
  });

  it("Take", async () => {

    takerSendAta = (await getOrCreateAssociatedTokenAccount(
      connection, taker, mintTaker, taker.publicKey
    )).address;

    takerReceiveAta = (await getOrCreateAssociatedTokenAccount(
      connection, taker, mintMaker, taker.publicKey
    )).address;

    makerReceiveAta = (await getOrCreateAssociatedTokenAccount(
      connection, taker, mintTaker, maker.publicKey
    )).address;

    console.log(`takerSendAta :: ${takerSendAta} `)

    await mintTo(
      connection,
      taker,
      mintTaker,
      takerSendAta, 
      taker.publicKey,
      1000
    ).then(confirm)

    const amountToSendFromTaker = new BN(10)

    // Add your test here.
    const tx = await program.methods.take(amountToSendFromTaker).accounts({
      taker: taker.publicKey,
      maker: maker.publicKey,
      mintMaker: mintMaker,
      mintTaker: mintTaker,
      takerReceiveAta: takerReceiveAta,
      makerReceiveAta: makerReceiveAta,
      takerSendAta: takerSendAta,
      auth: authPda,
      vault: vault,
      escrow: escrow,
      systemProgram: anchor.web3.SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([taker])
    .rpc()
    .then(confirm)
    .catch(e => console.error(e))
    // .then(log);

    const accountInfo = await connection.getAccountInfo(vault);
    const data = Buffer.from(accountInfo.data);
    const tokenAccountInfo = AccountLayout.decode(data);

    // Assert the escrow account has the correct deposit amount
  //   assert.equal(
  //     tokenAccountInfo.amount.toString(),
  //     amountToDeposit.toString(),
  //     "Escrow vault account should have the correct deposit amount"
  // );
  });
});
