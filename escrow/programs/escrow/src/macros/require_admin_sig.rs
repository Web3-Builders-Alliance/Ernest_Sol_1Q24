use anchor_lang::prelude::*;

#[macro_export]
macro_rules! require_admin_sig {
    // This version explicitly includes "pub fn" in the pattern to match,
    // ensuring the generated function is public and accepts a Context parameter.
    (pub fn $func_name:ident($ctx:ident: Context<$ctx_type:ty>) -> Result<()> $body:block) => {
      pub fn $func_name($ctx: Context<$ctx_type>) -> Result<()> {
          // Insert pre-function execution checks here.
          // Example: Verify the first account is initialized (details depend on your specific context and needs).
          // Note: This is a placeholder. You'll need to replace it with actual checks relevant to your program.
          let ixs = ctx.instructions.to_account_info();

          // More checks can be added as needed...

          // Original function body after checks
          $body
      }
  };
}