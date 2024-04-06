extern crate proc_macro;

use anchor_lang::prelude::*;

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn, LitStr, parse::Parse, parse::ParseStream, Token, Ident};

const ED25519_PROGRAM_ID: &str = "Ed25519SigVerify111111111111111111111111111";

struct MacroAttributes {
  admin_signer_key: LitStr,
  account_info_ident: Ident,
}

impl Parse for MacroAttributes {
  fn parse(input: ParseStream) -> syn::Result<Self> {
      let admin_signer_key = input.parse()?;
      input.parse::<Token![,]>()?;
      let account_info_ident: Ident = input.parse()?;
      Ok(Self { admin_signer_key, account_info_ident})
  }
}

#[proc_macro_attribute]
pub fn before_execute(attr: TokenStream, item: TokenStream) -> TokenStream {
    let input_fn = parse_macro_input!(item as ItemFn);
    let attr_args = parse_macro_input!(attr as MacroAttributes);

    let fn_name = &input_fn.sig.ident;
    let fn_inputs = &input_fn.sig.inputs;
    let fn_block = &input_fn.block;
    let fn_output = &input_fn.sig.output;

    let admin_signer_key = &attr_args.admin_signer_key;
    let account_info_ident = &attr_args.account_info_ident;
    // let ixs: AccountInfo<'_> = #account_info_ident;


    // let ixs = self.instructions.to_account_info();
    // let current_index = load_current_index_checked(&ixs)? as usize;

    // let message = ;

    let gen = quote! {
        fn #fn_name(#fn_inputs, ctx: &solana_program::account_info::AccountInfo) #fn_output {


          

            let prefix = #admin_signer_key;
            #fn_block
        }
    };

    gen.into()
}