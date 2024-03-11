use anchor_lang::prelude::*;

use anchor_spl:: {
  associated_token::AssociatedToken,
  token::{Transfer, transfer, Mint, Token, TokenAccount}
};

use crate::state::*;

#[derive(Accounts)]
pub struct Take<'info> {
  
  #[account(mut)]
  pub taker: Signer<'info>,

  #[account(mut)]
  pub maker: SystemAccount<'info>,

  pub mint_maker: Account<'info, Mint>,

  pub mint_taker: Account<'info, Mint>,

  #[account(
    init_if_needed, 
    payer = taker,
    associated_token::mint = mint_maker,
    associated_token::authority = taker,
  )]
  pub taker_receive_ata: Account<'info, TokenAccount>,

  #[account(
    init_if_needed, 
    payer = taker,
    associated_token::mint = mint_taker,
    associated_token::authority = maker,
  )]
  pub maker_receive_ata: Account<'info, TokenAccount>,

  #[account(
    mut, 
    associated_token::mint = mint_taker,
    associated_token::authority = taker,
  )]
  pub taker_send_ata: Account<'info, TokenAccount>,

  #[account(
    seeds = [b"authority"], 
    bump = escrow.auth_bump
  )]
  ///CHECK: This is Safe
  pub auth: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"vault", escrow.key().as_ref()],
    bump = escrow.vault_bump,
    token::mint = mint_maker,
    token::authority = escrow
  )]
  pub vault: Account<'info, TokenAccount>,

  #[account(
    mut,
    seeds = [b"escrow", maker.key.as_ref(), escrow.seed.to_le_bytes().as_ref()],
    bump = escrow.escrow_bump
  )]
  pub escrow: Account<'info, Escrow>,

  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>
}

impl<'info> Take<'info> {

  pub fn transfer_from_taker_to_maker(
    & self,
    amount: u64
  ) -> Result<()> {
    let cpi_accounts = Transfer {
      from: self.taker_send_ata.to_account_info(),
      to: self.maker_receive_ata.to_account_info(),
      authority: self.taker.to_account_info()
    };

    let ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

    transfer(ctx, amount)
  }

  pub fn transfer_from_vault_to_taker(
    & self
  ) -> Result<()> {
    // Create signer seeds
    let signer_seeds: [&[&[u8]];1] = [
        &[
            b"escrow", 
            self.maker.to_account_info().key.as_ref(), 
            &self.escrow.seed.to_le_bytes()[..],
            &[self.escrow.escrow_bump]
        ]
    ];

    let cpi_accounts = Transfer {
      from: self.vault.to_account_info(),
      to: self.taker_receive_ata.to_account_info(),
      authority: self.escrow.to_account_info()
    };

    let ctx = CpiContext::new_with_signer(self.token_program.to_account_info(), cpi_accounts, &signer_seeds);

    transfer(ctx, self.escrow.amount)
  }
}