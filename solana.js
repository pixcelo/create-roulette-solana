const web3=require("@solana/web3.js");

// ウォレットの残高を取得
const getWalletBalance = async (pubk) => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"),　"confirmed");
        const balance = await connection.getBalance(new web3.PublicKey(pubk));
        return balance /web3.LAMPORTS_PER_SOL;
    } catch(err) {
        console.log(err);
    }
}

// SOLのウォレット間の転送
// transferAmt は、トランザクション中に転送される SOL の金額を指す
const transferSOL = async (from, to, transferAmt)=>{
    try {
        // トランザクションオブジェクト
        const connection = new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: new web3.PublicKey(from.publicKey.toString()),
                toPubkey: new web3.PublicKey(to.publicKey.toString()),
                lamports: transferAmt*web3.LAMPORTS_PER_SOL // 送信するlamportsの量。( 1 SOL = 1000000000 lamports ) 
            })
        )
        // トランザクションへの署名
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from] // 署名者(そのトランザクションのすべての署名者のウォレットインスタンス)
        )
        return signature;
    } catch(err) {
        console.log(err);
    }
}

const airDropSol=async (wallet,transferAmt)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        // const walletKeyPair=await web3.Keypair.fromSecretKey(Uint8Array.from())
        const fromAirDropSignature=await connection.requestAirdrop(new web3.PublicKey(wallet.publicKey.toString()),transferAmt*web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirDropSignature);
    }catch(err){
        console.log(err);
    }
}

module.exports={
    getWalletBalance,
    transferSOL,
    airDropSol
}