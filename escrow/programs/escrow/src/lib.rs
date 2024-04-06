use anchor_lang::prelude::*;

mod state;
mod context;

pub mod constants;
pub mod errors;
// pub mod macros;

use context::*;

declare_id!("2AgGoDcsoAqXiVm2YowgjdDYrsegmZjHqyzr5jKBo3nw");

#[program]
pub mod escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seeds: u64, amount: u64) -> Result<()> {
      ctx.accounts.init(&ctx.bumps, amount, seeds)?;

      ctx.accounts.transfer_to_vault(amount)
    } 

    #[require_admin_sig("sdadfa", )]
    pub fn take(ctx: Context<Take>, amount: u64) -> Result<()> {

      ctx.accounts.transfer_from_taker_to_maker(amount)?;

      ctx.accounts.transfer_from_vault_to_taker()
    }

    pub fn take_new(ctx: Context<TakeNew>) -> Result<()> {

      ctx.accounts.log_signer()
    }
}

#[derive(Accounts)]
pub struct Initialize {}
