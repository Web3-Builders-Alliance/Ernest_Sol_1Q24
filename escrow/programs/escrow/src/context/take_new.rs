use anchor_lang::prelude::*;
use std::str::FromStr;

use solana_program::sysvar::instructions::{
  self,
  load_current_index_checked, 
  load_instruction_at_checked
};

use crate::{constants::*, errors::EscrowError};

#[derive(Accounts)]
pub struct TakeNew<'info> {
  #[account(mut)]
  buyer: Signer<'info>,

  #[account(address = instructions::ID)]
  /// CHECK: InstructionsSysvar account
  instructions: UncheckedAccount<'info>,
}

impl<'info> TakeNew<'info> {
  pub fn log_signer(&self) -> Result<()> {

    let ixs = self.instructions.to_account_info();
    let current_index = load_current_index_checked(&ixs)? as usize;
    // let signature_ix = load_instruction_at_checked(current_index - 1, &ixs)?;
    
    match load_instruction_at_checked(current_index - 1, &ixs) {
        Ok(signature_ix ) => {
            require_eq!(Pubkey::from_str(ED25519_PROGRAM_ID).unwrap(), signature_ix.program_id, EscrowError::MyError);  

            // Ensure a strict instruction header format: 
            // require!([0x01, 0x00, 0x30, 0x00, 0xff, 0xff, 0x10, 0x00, 0xff, 0xff, 0x70, 0x00, 0x48, 0x00, 0xff, 0xff].eq(&signature_ix.data[0..16]), BonkPawsError::SignatureHeaderMismatch);

            // Ensure signing authority is correct
            require!(signing_authority::ID.to_bytes().eq(&signature_ix.data[16..48]), EscrowError::SignatureAuthorityMismatch);

            let mut message_data: [u8;4] = [0u8;4]; 
            message_data.copy_from_slice(&signature_ix.data[112..116]);
            let message = u32::from_le_bytes(message_data);

            msg!("All was good. The message is: {}", message);
        },
        Err(_) => {
          msg!("Couldn't load the previous instruction");
        }
    }

    Ok(())
  }
}

