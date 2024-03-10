use anchor_lang::prelude::*;
use anchor_spl:: {
  associated_token::AssociatedToken,
  token::{Transfer, transfer, Mint, Token, TokenAccount}
};

use crate::state::*;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Make<'info> {
  
  #[account(mut)]
  pub maker: Signer<'info>,

  pub mint_maker: Account<'info, Mint>,

  #[account(
    mut, 
    associated_token::mint = mint_maker,
    associated_token::authority = maker,
  )]
  pub maker_ata: Account<'info, TokenAccount>,

  pub mint_taker: Account<'info, Mint>,

  #[account(
    seeds = [b"authority"], 
    bump
  )]
  ///CHECK: This is Safe
  pub auth: UncheckedAccount<'info>,

  #[account(
    init, 
    payer = maker,
    seeds = [b"vault", escrow.key().as_ref()],
    bump,
    token::mint = mint_maker,
    token::authority = auth
  )]
  pub vault: Account<'info, TokenAccount>,

  #[account(
    init,
    payer = maker,
    seeds = [b"escrow", maker.key.as_ref(), seed.to_le_bytes().as_ref()],
    bump,
    space = Escrow::INIT_SPACE
  )]
  pub escrow: Account<'info, Escrow>,

  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>
}

impl<'info> Make<'info> {
  pub fn init(
    &mut self,
    bumps: &MakeBumps,
    amount: u64,
    seeds: u64
  ) -> Result<()> {
    let escrow = &mut self.escrow;

    escrow.maker = *self.maker.key;
    escrow.mint_maker = *self.mint_maker.to_account_info().key;
    escrow.mint_taker = *self.mint_taker.to_account_info().key;
    escrow.amount = amount;
    escrow.seed = seeds;
    escrow.auth_bump = bumps.auth;
    escrow.vault_bump = bumps.vault;
    escrow.escrow_bump = bumps.escrow;

    Ok(())
  }

  pub fn transfer_to_vault(
    & self,
    amount: u64
  ) -> Result<()> {

    let cpi_accounts = Transfer {
      from: self.maker_ata.to_account_info(),
      to: self.vault.to_account_info(),
      authority: self.maker.to_account_info()
    };

    let ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

    transfer(ctx, amount)
  }
}
