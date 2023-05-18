import  env from 'dotenv' 
env.config()
import { Connection, Keypair, Transaction, clusterApiUrl, sendAndConfirmTransaction,PublicKey, TransactionInstruction, SendTransactionError, LAMPORTS_PER_SOL} from '@solana/web3.js'


const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

const PRIVATE_KEY = process.env.PRIVATE_KEY??''

async function main(){
    const payer = initializeKeypair()
    const connection = new Connection(clusterApiUrl('devnet'))
    await pingProgram(connection,payer)
    // await connection.requestAirdrop(payer.publicKey,LAMPORTS_PER_SOL*.2)
    await connection.getBalance(payer.publicKey).then((res)=>{
        console.log('balance: '+res/LAMPORTS_PER_SOL +' sol') 
        console.log('sender: '+payer.publicKey.toBase58())
    })
}

function initializeKeypair(){
    const secret = JSON.parse(PRIVATE_KEY)as number[]
    const secretKey  = Uint8Array.from(secret)
    const keypairFromSecretKey = Keypair.fromSecretKey(secretKey)
    return keypairFromSecretKey 
}

async function pingProgram(connection:Connection,payer:Keypair) {

    
    const transaction = new Transaction()

    const programId = new PublicKey(PROGRAM_ADDRESS)
    const programDataPubkey = new PublicKey(PROGRAM_DATA_ADDRESS)
    const instruction = new TransactionInstruction({
            keys:[
                {
                    pubkey:programDataPubkey,
                    isSigner:false,
                    isWritable:true
                },
            ],
            programId
        })
        transaction.add(instruction)

        const signature = sendAndConfirmTransaction(
            connection,
            transaction,
            [payer]
        )
        console.log('signature: '+await signature) 
    }
main().then(()=>{
    console.log('finished successfully')
}).catch((e)=>{console.log(e);
})
