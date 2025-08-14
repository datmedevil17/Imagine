import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { socket,mapAtom } from "./SocketManager";
import { Modal, Button ,Input} from "antd"; // Import Ant Design Modal and Button
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "@campnetwork/origin/react";
import { contractABI, contractAddress, getAllPosts, pinataApi, pinataSecret, setCoordinates, totalPosts, uploadArt } from "../utils/utils";

// Atoms
export const buildModeAtom = atom(false);
export const shopModeAtom = atom(false);
export const draggedItemAtom = atom(null);
export const draggedItemRotationAtom = atom(0);

export const UI = () => {
  const [map] = useAtom(mapAtom);
  const [inputLink, setInputLink] = useState(""); // State for storing the input link
  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(
    draggedItemRotationAtom
  );
  const [avatarMode, setAvatarMode] = useState(false);

  // State for controlling the Ant Design modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title,setTitle] = useState(null)
  const [price,setPrice] = useState(null)
  const [img,setImg] = useState(null)
  const [uri,setURI] = useState(null)
  const [artPieces,setArtPieces] = useState([])
  const {origin} = useAuth();
  // Functions to show and hide modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    try {
      // Prepare the data for IPFS upload
      const data = JSON.stringify({ title, price, img });
      console.log("Uploading data to IPFS:", data);
  
      // Pin JSON to IPFS using Pinata API
      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: pinataApi,
          pinata_secret_api_key: pinataSecret,
          "Content-Type": "application/json",
        },
      });
  
      const resData = await res.data;
      console.log("IPFS Upload Success:", resData);
  
      // Set the URI for the uploaded art
      const ipfsURI = `https://ipfs.io/ipfs/${resData.IpfsHash}`;
      setURI(ipfsURI);
      console.log(ipfsURI)
  
      // Interact with the smart contract
      console.log("Calling contract to mint/upload art...");
      const tx = await origin.callContractMethod(contractAddress, contractABI, uploadArt, [ipfsURI])
      console.log("Transaction Success:", tx);
      const count = await origin.callContractMethod(contractAddress, contractABI, totalPosts, [])
      console.log("Total Posts:", count);
      const vals = generateFramePos(Number(count));
      console.log(vals)
      const tx2 = await origin.callContractMethod(contractAddress, contractABI, setCoordinates, [Number(count), vals.x, vals.y, vals.rotation])
      console.log("Transaction Success:", tx2);
      fetchArtPieces()

  
      // Create a new item for the map
      // const newItem = {
      //   name: "frame",
      //   size: [1, 4],
      //   gridPosition: [0, 0],
      //   tmp: true,
      //   link: img,
      //   by: localStorage.getItem("address"),
      // };

      const newItem = {
        name: 'frame',
        size: [ 1, 4 ],
        gridPosition: [ vals.x, vals.y ],
        by: localStorage.getItem("address"),
        likes: 0,
        rotation: vals.rotation,
        link: img,
        title: title,
        price: price,
        auctionActive: false,
        sold: false,
        maxBidder: '0x0000000000000000000000000000000000000000',
        currentBid: 0,
        id :Number(count)
      }
      // Update map items
      const temp = [...map.items];
      temp.push(newItem);
      console.log("Updated map items:", temp);
  
      // Emit updated items to the server
      socket.emit("itemsUpdate", temp);
  
      // Close the modal
      toast.success("Successfully added new Art");
      setIsModalVisible(false);
  
    } catch (error) {
      console.error("Error during the submission process:", error);
      // window.alert("Minting error: " + error.message || "Unknown error occurred");
      toast.error("Error during the submission process");
    }
  };

  function generateFramePos(total) {
    let totalRotations = Math.floor((total*5) / 30);
    let left = 30 - ((total*5) % 30);
    let currentRotation = totalRotations;
    if (left < 4) {
      currentRotation += 1;
      left = 30;
    }
    let toUse = 30- left;
    switch (currentRotation) {
      case 0:
        return { x:0, y:toUse, rotation: 0 };
      case 1:
        return { x:toUse, y:29, rotation: 1 };
      case 2:
        return { x:29, y:30-toUse, rotation: 2 };
      case 3:
        return { x:30-toUse, y:0, rotation: 3 };
      default:
        toast.info("No more frames can be added");
        return { x: 0, y: 0, rotation: 0 }; //
    }
  }
  // function getRandomNumber(arr) {
  //   return arr[Math.floor(Math.random() * arr.length)];
  // }
  
  // function getFirstConsecutiveNumbers(set) {
  //   const sortedArray = Array.from(set).sort((a, b) => a - b);
  //   let firstNumbers = new Set();

  //   for (let i = 0; i < sortedArray.length - 3; i++) {
  //     if (
  //       sortedArray[i + 1] === sortedArray[i] + 1 &&
  //       sortedArray[i + 2] === sortedArray[i] + 2 &&
  //       sortedArray[i + 3] === sortedArray[i] + 3
  //     ) {
  //       firstNumbers.add(sortedArray[i]);
  //     }
  //   }

  //   return firstNumbers;
  // }
  
  
  const handleImageChange =async (e) => {
    e.preventDefault()
    const file = e.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        // console.log(formData)
        const res = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: pinataApi,
            pinata_secret_api_key: pinataSecret,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res);
        const resData = await res.data;
        setImg(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
      } catch (error) {
        window.alert(error);
      }
    }

  }
  const fetchArtPieces = async () => {
    try {
      if(origin == null) return;
      // Call the contract's getAllPosts function
      const artPieces = await origin.callContractMethod(contractAddress, contractABI, getAllPosts, [])
      setArtPieces(artPieces)
      console.log("Fetched Art Pieces:", artPieces);
    } catch (error) {
      console.error("Error fetching art pieces:", error);
      throw new Error("Failed to fetch art pieces.");
    }
  };
  useEffect(()=>{
    fetchArtPieces()
  },[origin])
  

  return (
    <>
      {/* Avatar Creator */}
      {avatarMode && (
        <AvatarCreator
          subdomain="wawa-sensei-tutorial"
          className="fixed top-0 left-0 z-10 w-screen h-screen"
          onAvatarExported={(event) => {
            socket.emit("characterAvatarUpdate", event.data.url,null);
            toast.success("Successfully updated avatar");
            setAvatarMode(false);
          }}
        />
      )}


      {/* Ant Design Modal */}
<Modal
  title={null} // Remove default title for custom header
  open={isModalVisible}
  onCancel={handleCancel}
  footer={null}
  width={500}
  styles={{
    mask: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
    content: { 
      backgroundColor: '#000000', 
      border: 'none',
      borderRadius: '12px',
      padding: 0
    }
  }}
>
  <div className="bg-black text-white rounded-lg overflow-hidden">
    {/* Custom Header */}
    <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Create New NFT</h1>
      </div>
      <button 
        onClick={handleCancel}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Form Content */}
    <div className="p-6 space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>NFT Title</span>
        </label>
        <Input
          placeholder="Enter a catchy title for your NFT"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-12 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-gray-500"
          styles={{
            input: { 
              backgroundColor: '#111827', 
              borderColor: '#4B5563', 
              color: '#ffffff' 
            }
          }}
        />
      </div>

      {/* Price Field */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
          </svg>
          <span>Price (ETH)</span>
        </label>
        <Input
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full h-12 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-gray-500"
          styles={{
            input: { 
              backgroundColor: '#111827', 
              borderColor: '#4B5563', 
              color: '#ffffff' 
            }
          }}
        />
      </div>

      {/* Image Upload Field */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-white font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span>Upload Artwork</span>
        </label>
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full h-12 bg-gray-900 border border-gray-600 text-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
            styles={{
              input: { 
                backgroundColor: '#111827', 
                borderColor: '#4B5563', 
                color: '#ffffff' 
              }
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Supported formats: JPG, PNG, GIF, SVG. Max size: 10MB
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-700">
        <Button
          type="primary"
          onClick={handleSubmit}
          className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-lg border-none"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
            color: '#000000'
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Create NFT</span>
        </Button>
      </div>
    </div>
  </div>
</Modal>

      <div className="fixed inset-4 flex items-end justify-center pointer-events-none">
        <div className="flex items-center space-x-4 pointer-events-auto">
          
          {(buildMode || shopMode) && draggedItem === null && (
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => {
                shopMode ? setShopMode(false) : setBuildMode(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </button>
          )}
          {/* AVATAR Button */}
          {!buildMode && !shopMode && (
            <>
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => {
                showModal();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.436 3h13.127a1.5 1.5 0 011.118.44l2.08 1.189a3.004 3.004 0 01-.621 4.72"
                />
              </svg>
            </button>
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setAvatarMode(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button></>
          )}
          {/* DANCE Button */}
          {!buildMode && !shopMode && (
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => socket.emit("dance")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                />
              </svg>
            </button>
          )}
          {/* BUILD Button */}
          {!buildMode && !shopMode && (
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setBuildMode(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </button>
          )}
          {buildMode && !shopMode && draggedItem !== null && (
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() =>
                setDraggedItemRotation(
                  draggedItemRotation === 3 ? 0 : draggedItemRotation + 1
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          )}
          {/* CANCEL */}
          {buildMode && !shopMode && draggedItem !== null && (
            <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setDraggedItem(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};