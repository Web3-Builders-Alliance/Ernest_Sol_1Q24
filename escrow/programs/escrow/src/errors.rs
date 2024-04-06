use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowError {
  #[msg("Signature authority mismatch")]
  SignatureAuthorityMismatch,

  #[msg("Any Error")]
  MyError,
}