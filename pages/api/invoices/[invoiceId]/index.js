

import {MongoClient, ObjectId} from 'mongodb'


async function handler(req,res){

    const {invoiceId} = req.query

    const client = await MongoClient.connect
    ('mongodb+srv://Zack:7k0c3YA24XFGomv8@atlascluster.spvvehc.mongodb.net/invoices2?retryWrites=true&w=majority', {useNewUrlParser: true});
   
    const db = client.db();
    const collection = db.collection("allInvoices");

    if(req.method ==='PUT'){

        await collection.updateOne({_id: ObjectId(invoiceId)}, {
            $set:{
                status: 'paid',
            },
        })

        client.close()
            }

            //delete request

            if(req.method ==='DELETE'){
                await collection.deleteOne({ _id: ObjectId(invoiceId) });
                res.status(200).json({message: "Invoice deleted successfully"})
                client.close()

            }




}

export default handler