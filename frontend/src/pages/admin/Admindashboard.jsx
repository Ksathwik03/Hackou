import React,{useState,useEffect} from 'react'
import {admin_data} from '../../data'
import {useHistory} from 'react-router-dom'
import {BsInfoCircle} from 'react-icons/bs'
import {BiRightArrow} from 'react-icons/bi'
import '../assets/styles/userdashboard.css'

function Admindashboard({match}) {
    const [search, setsearch] = useState('')
    const [filteredRequests, setfilteredRequests] = useState(admin_data.requests)
    const [showDetails, setshowDetails] = useState(false)
    const [prodDetails, setprodDetails] = useState({})
    const [blur, setblur] = useState(false)

    const history = useHistory()
    const handleChat = (e) => {
        const chatId = e.target.getAttribute("datakey")
        history.push(`/admin/${match.params.adminId}/dashboard/${chatId}`)
    }

    const filterFucntion = ({product_name}) => {
        return product_name.toLowerCase().indexOf(search.toLowerCase().trim()) > -1
    }

    useEffect(() => {
        if(search === ''){
            setfilteredRequests(admin_data.requests);
        }
        setfilteredRequests(admin_data.requests.filter(filterFucntion))
    }, [search])
    return (
        <>
        <div className={`dashboard-main ${blur ? "mkblr":''}`} >
            <h1 className="user-name"> Welcome {admin_data.admin_name},</h1>
        <div className="filter">
            <input type="text" placeholder="search by product name" onChange={(e) => setsearch(e.target.value)} value={search} />
        </div>
        <div className="userData">
            <div className="requests">
                { (filteredRequests.length === 0) && <h2 style={{color:"rgb(180 180 180)",textAlign:"center"}}>No requests found!!!</h2> }
                {
                    filteredRequests.map(request =>  (
                        <div className="request" key={request.user_id}>
                            <div className="req-detail">
                                <h2>{request.product_name}</h2>
                                <p className="status">status : <span className={request.status?"success":"fail"}>{request.status?"Accepted":"Pending..."}</span></p>
                            </div>
                            {
                                request.status && 
                                <button className="chat" onClick={handleChat} datakey={request.chat_id}>Chat{'   '} <BiRightArrow /></button>
                            }
                            {
                                !request.status &&
                                <button className="success" style={{backgroundColor:'#007BFF',color:'white',padding:'2px',borderRadius:'2px'}} datakey={request.chat_id}>Approve Request</button>
                            }
                            <button className="icon" onClick={() => {setshowDetails(!showDetails);setprodDetails(request);setblur(!blur)}}><BsInfoCircle /></button>
                        </div>
                    ))
                }
            </div>
        </div>
        </div>
        {
            showDetails && 
            <div className="prod-details">
                <h1>DETAILS</h1>
                <div className="sub-det">
                    <h3>Product name : {prodDetails.product_name}</h3>
                    <h3>Product link : <a href={prodDetails.product_link} target='_blank'>product link</a></h3>
                    <h3>Status : <span className={prodDetails.status?"success":"fail"}>{prodDetails.status?"Accepted":"Pending..."}</span></h3>
                </div>
                <button onClick={()=> {setshowDetails(!showDetails);setblur(!blur)}}><h2>Close</h2></button>
                
            </div>
        }
        </>
    )
}

export default Admindashboard
