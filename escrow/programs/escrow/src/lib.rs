use anchor_lang::prelude::*;

mod state;
mod context;

use context::*;

declare_id!("2AgGoDcsoAqXiVm2YowgjdDYrsegmZjHqyzr5jKBo3nw");

#[program]
pub mod escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seeds: u64, amount: u64) -> Result<()> {
      ctx.accounts.init(&ctx.bumps, amount, seeds)?;

      ctx.accounts.transfer_to_vault(amount)
    } 

    pub fn take(ctx: Context<Take>, amount: u64) -> Result<()> {

      ctx.accounts.transfer_from_taker_to_maker(amount)?;

      ctx.accounts.transfer_from_vault_to_taker()
    }
}

#[derive(Accounts)]
pub struct Initialize {}
