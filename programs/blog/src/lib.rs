use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("CUEAXSePXRdcgdCGcvVpGozSVErdukJ62LWR9R5H4jHW");

#[program]
pub mod blog {
    use super::*;

    pub fn initialize_user(ctx: Context<UserInformation>, bio: String, pseudo: String) -> ProgramResult {
        let user : &mut Account<User> = &mut ctx.accounts.user;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if bio.chars().count() > 255 {
            return Err(ErrorCode::BioTooLong.into())
        }

        if pseudo.chars().count() > 50 {
            return Err(ErrorCode::PseudoTooLong.into())
        }

        user.bio = bio;
        user.created_at = clock.unix_timestamp;
        user.updated_at = clock.unix_timestamp;
        user.author = *author.key;
        user.pseudo = pseudo;

        Ok(())
    }

    pub fn user_information(ctx: Context<MutateUserInformation>, bio: String, pseudo: String) -> ProgramResult {
        let user : &mut Account<User> = &mut ctx.accounts.user;
        let clock: Clock = Clock::get().unwrap();

        user.bio = bio;
        user.updated_at = clock.unix_timestamp;
        user.pseudo = pseudo;

        Ok(())
    }

    pub fn publish_post(ctx: Context<PublishPost>, content : String) -> ProgramResult {
        let post : &mut Account<Post> = &mut ctx.accounts.post;
        let author : &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if content.chars().count() > 930 {
            return Err(ErrorCode::ContentTooLong.into())
        }

        post.author = *author.key;
        post.timestamp = clock.unix_timestamp;
        post.content = content;


        Ok(())
    }

}

#[derive(Accounts)]
pub struct UserInformation<'info> {
    #[account(init, payer = author, space = User::LEN)]
    pub user: Account<'info,User>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct PublishPost<'info> {
    #[account(init, payer = author, space = Post::LEN)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct MutateUserInformation<'info> {
    #[account(mut, has_one=author)]
    pub user: Account<'info,User>,
    pub author: Signer<'info>
}

#[account]
pub struct User {
    pub author : Pubkey,
    pub created_at: i64,
    pub updated_at: i64,
    pub bio: String,
    pub pseudo : String
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub timestamp: i64,
    pub content: String, // 1000 chars max.
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;// Stores the size of the string.
const CONTENT_LENGHT: usize = 930 * 4;
const BIO_LENGHT : usize = 255 * 4;
const PSEUDO_LENGHT: usize = 50 * 4;

impl User {
    const LEN : usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH
        + TIMESTAMP_LENGTH * 2 // created_at and updated_at
        + BIO_LENGHT + STRING_LENGTH_PREFIX
        + PSEUDO_LENGHT + STRING_LENGTH_PREFIX;
}

impl Post {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author
        + TIMESTAMP_LENGTH // timestamp
        + STRING_LENGTH_PREFIX + CONTENT_LENGHT // content
    ;
}


#[error]
pub enum ErrorCode {
    #[msg("The provided content should be 1000 characters long maximum.")]
    ContentTooLong,
    #[msg("The biographie should be 50 characters long maximum.")]
    BioTooLong,
    #[msg("The pseudo provide should be 1000 characters long maximum.")]
    PseudoTooLong,
}