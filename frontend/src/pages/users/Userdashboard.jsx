import React, { useState, useEffect } from "react";
// import { user_data } from "../../data";
import { useHistory } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { BsInfoCircle } from "react-icons/bs";
import { BiRightArrow } from "react-icons/bi";
import "../assets/styles/userdashboard.css";
import axios from 'axios'
import { api } from '../../Api/api'
import { toast, ToastContainer } from 'react-toastify'

function Userdashboard({ match }) {
  const [user_data, setuser_data] = useState({
    "username": localStorage.getItem("username") || '',
    "user_id": localStorage.getItem("user_id") || '',
    "All_Requests": []
  })
  const [search, setsearch] = useState('')
  const [filteredRequests, setfilteredRequests] = useState([])
  const [showRequestForm, setshowRequestForm] = useState(false)
  const [showDetails, setshowDetails] = useState(false)
  const [prodDetails, setprodDetails] = useState({})
  const [blur, setblur] = useState(false)
  const [loading, setloading] = useState(false)
  const [productName, setproductName] = useState('')
  const [productLink, setproductLink] = useState('')
  const [bank, setbank] = useState("ICIC")
  const [update, setupdate] = useState(false)
  const history = useHistory()
  const [prodDet, setprodDet] = useState({})
  const [showpro, setshowpro] = useState(false)
  let admin = false
  if (localStorage.getItem("username") == "admin") {
    admin = true
  }
  const getdetails = (e) => {
    e.preventDefault()
    axios.get(productLink).then(res => setprodDet(res.data))
    setshowpro(true)
    
  }

  const filterFucntion = ({ product_name }) => {
    return product_name.toLowerCase().indexOf(search.toLowerCase().trim()) > -1;
  };

  useEffect(() => {
    if (search === "") {
      setfilteredRequests(user_data.All_Requests);
    }
    setfilteredRequests(user_data.All_Requests.filter(filterFucntion));
  }, [search]);

  useEffect(async () => {
    setloading(true)
    const headers = { "x-access-token": localStorage.getItem("token") || null }
    await axios.get(`${api}product/user`, headers)
      .then((res) => {
        if (res.status == 200) {
          console.log(res)
          let temp_data = user_data
          temp_data.All_Requests = res.data.products
          setuser_data(temp_data)
          setfilteredRequests(res.data.products)
        }
        else {
          toast("some error occured")
        }
        setloading(false)
      })
  }, [update])

  const postProduct = async (e) => {
    e.preventDefault()
    setloading(true)
    const headers = { "x-access-token": localStorage.getItem("token") || null }
    const body = { product_name: productName, product_link: productLink, bank: bank }
    await axios.post(`${api}product/add`, body, headers)
      .then((res) => {
        console.log(res)
        if (res.status == 200) {
          toast("Successfully added")
        }
        else {
          toast("Some error occured")
        }
      })
    setshowRequestForm(false)
    setblur(false)
    setprodDet({});
    setshowpro(false)
    setupdate(!update)
    setloading(false)
  }

  const handleProduct = async (id) => {
    console.log(id)
    const headers = { "x-access-token": localStorage.getItem("token") || null }
    const body = { dealStatus: "success" }
    await axios.put(`${api}product/update/${id}`, headers, body)
      .then((res) => {
        console.log(res)
      })
    setupdate(!update)
  }


  if (loading) {
    return (
      <div>
        loading
      </div>
    )
  }


  return (
    <>
      <div className={`dashboard-main ${blur ? "mkblr" : ""}`}>
        <h1 className="user-name"> Welcome {user_data.username}</h1>
        <div className="dashboard-box">   <div className="filter">
          <input
            type="text"
            placeholder="search by product name"
            onChange={(e) => setsearch(e.target.value)}
            value={search}
          />
          {!admin &&
            <button
              onClick={() => {
                setshowRequestForm(!showRequestForm);
                setblur(!blur);
              }}
            >
              Request a Product
            </button>}
        </div>
          <div className="userData">
            <div className="requests">
              {filteredRequests.length === 0 && (
                <h2 style={{ color: "rgb(100 100 100)", textAlign: "center" }}>
                  No requests found!!!
                </h2>
              )}
              {filteredRequests.map((request) => (
                <div className="request" key={request.id}>
                  <div className="req-detail">
                    <h2>{request.product_name}</h2>
                    <p className="status">
                      status :{" "}
                      <span className={request.dealStatus ? "success" : "fail"}>
                        {request.dealStatus ? "Accepted" : "Pending"}
                      </span>
                    </p>
                  </div>
                  {request.dealStatus && <button
                    className="chat"
                    onClick={() => history.push(`/${match.params.userId}/dashboard/${request.chat_id}`)}
                  >
                    Chat{"   "} <BiRightArrow />
                  </button>}
                  {admin && !request.dealStatus &&
                    <div >
                      <button
                        className="chat"
                        onClick={() => handleProduct(request._id)}
                        datakey={request._id}
                      >
                        Accept{"   "} <BiRightArrow />
                      </button>
                    </div>
                  }
                  <button
                    className="icon"
                    onClick={() => {
                      setshowDetails(!showDetails);
                      setprodDetails(request);
                      setblur(!blur);
                    }}
                  >
                    <BsInfoCircle />
                  </button>
                </div>
              ))}
            </div>
          </div></div>

      </div>
      {
        showRequestForm &&
        <div className="requestForm">
          <div className="form-head">
            <h1>REQUEST FORM</h1>
            <button onClick={() => { setshowRequestForm(!showRequestForm); setblur(!blur);setprodDet({});setshowpro(false) }}><ImCross /></button>
          </div>
          <div className="field">
            <label htmlFor="Name">Product name</label>
            <input type="text" name="Name" placeholder="product name"
              onChange={(e) => { setproductName(e.target.value) }}
              required />
          </div>
          <div className="field">
            <label htmlFor="link">Product link</label>
            <input type="text" name="link" placeholder="product link"
              onChange={(e) => { setproductLink(e.target.value) }}
              required />
            <button onClick={getdetails}>Get Details</button>
          </div>
          {
            showpro &&
            <div className="prodet">
              <div className="desc">

              <img src={prodDet.image} height="auto" width="100vw" alt="product image" />
              <p><h4 style={{display:"inline"}}>Description : </h4>{prodDet.description}</p>
              </div>
              <p><h4 style={{display:"inline"}}>product name : </h4><span>{prodDet.title}</span></p>
              <p><h4 style={{display:"inline"}}>price : </h4><span>{prodDet.price}</span></p>
              <p><h4 style={{display:"inline"}}>category : </h4><span>{prodDet.category}</span></p>
            </div>
          }
          <div className="field">
            <label htmlFor="bank">Bank</label>
            <select name="bank">
              <option value="ICICI">ICICI</option>
              <option value="SBI">SBI</option>
              <option value="AXIS">AXIS</option>
            </select>
          </div>
          <button type="submit" onClick={postProduct} >submit</button>
        </div>
      }
      {showDetails && (
        <div className="prod-details">
          <h1>DETAILS</h1>
          <div className="sub-det">
            <h3>Product name : {prodDetails.product_name}</h3>
            <h3>
              Product link :{" "}
              <a href={prodDetails.product_link} target="_blank">
                product link
              </a>
            </h3>
            <h3>
              Status :{" "}
              <span className={prodDetails.status ? "success" : "fail"}>
                {prodDetails.status ? "Accepted" : "Pending..."}
              </span>
            </h3>
          </div>
          <button
            onClick={() => {
              setshowDetails(!showDetails);
              setblur(!blur);
            }}
          >
            <h2>Close</h2>
          </button>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Userdashboard;
