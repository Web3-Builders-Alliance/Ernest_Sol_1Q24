import wallet from "./wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey"
import * as anchor from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js";


const TOKEN_METADATA_PROGRAM_ID = publicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

// Define our Mint address
const mint = publicKey("DTQahtnEjT7Jwb1kG6CTjHrpNyNCBZsGrtsXYVZTJSyN")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

const metadataSeeds = [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()] 
// const seeds = [
//   string({ size: "variable" }).serialize("metadata"),
//   publicKeySerializer().serialize(tokenMetadataProgramId),
//   publicKeySerializer().serialize(mint),
// ];
const metadata: PublicKey = findProgramAddressSync(metadataSeeds, TOKEN_METADATA_PROGRAM_ID)

const pda = umi.eddsa.findPda(programId, seeds);

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata, mint, keypair, keypair.publicKey, 
        }

        // let data: DataV2Args = {
        //     ???
        // }

        // let args: CreateMetadataAccountV3InstructionArgs = {
        //     ???
        // }

        // let tx = createMetadataAccountV3(
        //     umi,
        //     {
        //         ...accounts,
        //         ...args
        //     }
        // )

        // let result = await tx.sendAndConfirm(umi).then(r => r.signature.toString());
        // console.log(result);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();