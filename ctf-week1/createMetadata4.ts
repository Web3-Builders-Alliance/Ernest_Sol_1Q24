import { Commitment, Connection, Keypair, Transaction, sendAndConfirmTransaction, PublicKey, Signer } from "@solana/web3.js"
import wallet from "./wallet/wba-wallet.json"
import {collectionDetails, createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { publicKey, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer, string } from '@metaplex-foundation/umi/serializers';
import { base58 } from "@metaplex-foundation/umi/serializers";


//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

//Create a Umi instance
const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signerKeypair = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signerKeypair));

const mint =  publicKey('AicNsWmrmLAhm9e9m8bbBndoxMagC5VpaSSuMFf8wvzd')
const tokenMetadataProgramId = publicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

const seeds = 
  [string({ size: 'variable' }).serialize('metadata'),
  publicKeySerializer().serialize(tokenMetadataProgramId),
  publicKeySerializer().serialize(mint),
];
const metadata_pda = umi.eddsa.findPda(tokenMetadataProgramId, seeds);

(async () => {

    let tx = createMetadataAccountV3(
      umi,
      {
          ...{
            metadata: publicKey(metadata_pda),
            mint: publicKey(mint.toString()),
            mintAuthority: signerKeypair,
            payer: undefined,
            updateAuthority: keypair.publicKey,
            systemProgram: undefined,
            rent: undefined,   
        },
          ...{ 
          data: {
            name: "WBA",
            symbol: "WBA",
            uri: "test.com",
            sellerFeeBasisPoints: 0,
            collection: null,
            creators: null,
            uses: null
        },
        isMutable: false,
        collectionDetails: null
      }
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.deserialize(result.signature);

    console.log(`Succesfully Minted!. Transaction Here: https://solana.fm/tx/${signature[0]}?cluster=devnet`) 
    
})();

// https://solana.fm/tx/d4m8uSYLf2huvkgGre92c9WxZBaYLB4ev12smFnkCcAsHe7bzMoJgUN7YgH4zH67vuxyyLPi5fGGQ9DdZWiU8U3?cluster=devnet