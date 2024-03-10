use anchor_lang::prelude::*;


#[account]
pub struct Escrow {
  pub maker: Pubkey,
  pub mint_maker: Pubkey,
  pub mint_taker: Pubkey,
  pub amount: u64,
  pub seed: u64,
  pub auth_bump: u8,
  pub escrow_bump: u8,
  pub vault_bump: u8,
}

impl Space for Escrow {
  const INIT_SPACE: usize = 8 + 32 * 3 + 8 * 2 + 1 * 3;
}