


import React, {useRef} from 'react'
import { useRouter } from 'next/router'
import { MongoClient, ObjectId } from 'mongodb'
import { toast } from 'react-toastify'

const InvoiceDetails = (props) => {

    const router = useRouter()

    const {data} = props
    const modalRef = useRef(null)

    const goBack = () => router.push('/')

    // update invoice status in database

    const updateStatus = async invoiceId=>{
        const res = await fetch('/api/invoices/${invoiceId}', {
            method:'PUT'
        })
        const data = await res.json()
    }

    //delete invoice from the database

    const deleteInvoice = async invoiceId=> {
        try {
            const res = await fetch('/api/invoices/${invoiceId}', {
                method:'DELETE'
        })

        const data = await res.json()
        toast.success(data.message)
        router.push("/")
    }
    catch (error) {
        toast.error("Something went wrong!")

    }
}

    // open modal

    const modalToggle = () => modalRef.current.classList.toggle("showModal")





  return (
   <div className='main_container'>
    <div className='back_btn'>
        <h6 onClick={goBack}> Go Back</h6>
    </div>

        {/* ====== invoice deteails header ======== */}
        <div className='invoice_details-header'>
            <div className='details_status'>
                <p>Status</p>
                <button 
                className={'${data.status === "paid"? "paid_status": data.status === "pending"? "pending_status" : "draft_status"}'}>{data.status}</button>
            </div>
            <div className='details_btns'>
                <button className='edit_btn' onClick={() => router.push('/edit/${data.id}')}>Edit</button>
                
                {/* === confirm deletion modal start === */}

                <div className='delete_modal' ref={modalRef}>
                    <div className='modal'>
                        <h3> Confirm Deletion</h3>
                        <p>Do you really want to delete the invoice #{data.id.substr(0,6).toUpperCase()}? This action will not be undone.</p>

                        <div className='details_btns modal_btns'>
                            <button className='edit_btn' onClick={modalToggle}>Cancel</button>
                            <button className='delete_btn' onClick={()=>deleteInvoice(data.id)}>Confirm</button>
                        </div>
                    </div>
                </div>




                {/* === confirm deletion modal end === */}
                
                <button className='delete_btn' onClick={modalToggle}>Delete</button>
              
                <button onClick={() => updateStatus(data.id)}  className= {`${
              data.status === "paid" || data.status === "draft" ? "disable" : ""
            }  mark__as-btn`} >Mark as Paid</button>
            </div>
        </div>

           {/* ======= invoice details =========== */}

           <div className='invoice_details'>
            <div className='details_box'>
            <div>
                <h4>{data.id.substr(0,6).toUpperCase()}</h4>
                <p> {data.description}</p>
            </div>
            <div>
            
            <p> {data.senderAddress.street}</p>
            <p> {data.senderAddress.city} </p>
            <p> {data.senderAddress.postalCode} </p>
             <p>{data.senderAddress.country} </p>
            </div>

            </div>
                 {/* ======= details box 2 =========== */}
                 <div className='details_box'>
                    <div>
                        <div className='invoice_created-date'>
                            <p>Invoice Date</p>
                            <h4> {data.createdAt}</h4>
                        </div>
                        <div>
                            <p className='invoice_payment'>Payment Due</p>
                            <h4> {data.paymentDue}</h4>
                        </div>
                    </div>

                            {/* ======= invoice client address =========== */}

                            <div className='invoice_client-address'>
                                <p>Bill to</p>
                                <h4> {data.clientName}</h4>
                                <div> 

                                <p> {data.clientAddress.street} </p>
                                <p> {data.clientAddress.city}</p>
                                <p> {data.clientAddress.postalCode} </p>
                                <p> {data.clientAddress.country}</p>
                                
                                </div>
                               
                            </div>

                            <div>
                                <p>Send To</p>
                                <h4> {data.clientEmail}</h4>
                            </div>

                 </div>

                   {/* ======= invoice items =========== */}
                       
  <div className='invoice_item-box'>

<ul className='list'>
<li className='list_item'>
  <p className='item_iteme-box'>Item Name</p>
  <p className='list_item-box'>Qty</p>
  <p className='list_item-box'>Price</p>
  <p className='list_item-box'>Total</p>
</li>   


{/* ======= invoice items=========== */}

{/* <li className='list_item'>
    <div className='item_name-box'>
        <h5>Ecommerce Website</h5>
    </div>
    <div className='list_item-box'><p>2</p></div>
    <div className='list_item-box'><p>$250</p></div>
    <div className='list_item-box'><h5>$500</h5></div>
</li> */}


{
    data.items?.map((item, index) => (
        <li className='list_item' key={index}>
    <div className='item_name-box'>
        <h5>{item.name}</h5>
    </div>
    <div className='list_item-box'><p>{item.quantity}</p></div>
    <div className='list_item-box'><p>${item.price}</p></div>
    <div className='list_item-box'><h5>${item.total}</h5></div>
</li>
    ))
}
{/* 
<li className='list_item'>
    <div className='item_name-box'>
        <h5>Personal Website</h5>
    </div>
    <div className='list_item-box'><p>2</p></div>
    <div className='list_item-box'><p>$250</p></div>
    <div className='list_item-box'><h5>$500</h5></div>
</li> */}
</ul>
 </div>

 <div className='grand_total'>
    <h5> Grand Total</h5>
    <h2> ${data.total}</h2>
 </div>
</div>
   </div>
  )
}

export default InvoiceDetails;

export async function getStaticPaths(){

    const client = await MongoClient.connect
    ('mongodb+srv://Zack:7k0c3YA24XFGomv8@atlascluster.spvvehc.mongodb.net/invoices2?retryWrites=true&w=majority', {useNewUrlParser: true});
   
    const db = client.db();
    const collection = db.collection("allInvoices");


    const invoices = await collection.find({}, {_id:1}).toArray()

    return {
        fallback: 'blocking',
        paths: invoices.map(invoice => ({
            params: {
                invoiceId: invoice._id.toString(),
            },
        })),
    }

}


export async function getStaticProps(context) {

    const { invoiceId } = context.params;   

    // const invoiceId = ObjectId;



    const client = await MongoClient.connect
    ('mongodb+srv://Zack:7k0c3YA24XFGomv8@atlascluster.spvvehc.mongodb.net/invoices2?retryWrites=true&w=majority', {useNewUrlParser: true});
   
    const db = client.db();
    const collection = db.collection("allInvoices");

    const invoice = await collection.findOne({ _id: ObjectId (invoiceId) })

    // const invoice = await collection.findOne({ _id: invoiceId  })

// I still need to sort ut this String issue (dimmed coded) 
// Whenever i am clicking on any one pending invoice the op one is opening
    return {
        props: {
            data: {
                id:invoice._id.toString(),
                senderAddress: invoice.senderAddress,
                clientAddress: invoice.clientAddress,
                clientName: invoice.clientName,
                clientEmail: invoice.clientEmail,
                description: invoice.description,
                createdAt: invoice.createdAt,
                paymentDue: invoice.paymentDue,
                items: invoice.items,
                total: invoice.total,
                status: invoice.status

            }
        },
        revalidate:1
    }

} 