import * as anchor from '@project-serum/anchor';
import {Program} from '@project-serum/anchor';
import {Blog} from '../target/types/blog';
import * as assert from "assert";

describe('blog', () => {

    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());
    const program = anchor.workspace.Blog as Program<Blog>;

    it('create a user ', async () => {
        const user = anchor.web3.Keypair.generate();
        await program.rpc.initializeUser('bio', 'pseudo', {
            accounts: {
                user: user.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [user],
        });

        const userAccount = await program.account.user.fetch(user.publicKey);

        // Ensure it has the right data.
        assert.equal(userAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(userAccount.bio, 'bio');
        assert.equal(userAccount.pseudo, 'pseudo');
        assert.ok(userAccount.createdAt);
        assert.ok(userAccount.updatedAt);
    });

    it('can mutate it\'s profile ', async () => {
        const user = anchor.web3.Keypair.generate();
        await program.rpc.initializeUser('bio', 'pseudo', {
            accounts: {
                user: user.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [user],
        });


        await program.rpc.userInformation("bio 2", "pseudo 2", {
            accounts: {
                user: user.publicKey,
                author: program.provider.wallet.publicKey,
            }
        });

        const userAccount = await program.account.user.fetch(user.publicKey);

        // Ensure it has the right data.
        assert.equal(userAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(userAccount.bio, 'bio 2');
        assert.equal(userAccount.pseudo, 'pseudo 2');
        assert.ok(userAccount.createdAt);
        assert.ok(userAccount.updatedAt);
    });

    it('mutate it\'s profile failed', async () => {
        const user = anchor.web3.Keypair.generate();
        await program.rpc.initializeUser('bio', 'pseudo', {
            accounts: {
                user: user.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [user],
        });


        await program.rpc.userInformation("bio 2", "pseudo 2", {
            accounts: {
                user: user.publicKey,
                author: program.provider.wallet.publicKey,
            },
        });

        const userAccount = await program.account.user.fetch(user.publicKey);

        // Ensure it has the right data.
        assert.equal(userAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.notEqual(userAccount.bio, 'bio');
        assert.notEqual(userAccount.pseudo, 'pseudo');
        assert.ok(userAccount.createdAt);
        assert.ok(userAccount.updatedAt);
    });

    it('create a post ', async () => {
        const post = anchor.web3.Keypair.generate();
        const contentWith900Chars = 'x'.repeat(900);
        await program.rpc.publishPost(contentWith900Chars, {
            accounts: {
                post: post.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [post],
        });

        const postAccount = await program.account.post.fetch(post.publicKey);

        // Ensure it has the right data.
        assert.equal(postAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(postAccount.content, contentWith900Chars);
        assert.ok(postAccount.timestamp);
    });


});
