import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Modal } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";
import { Experience } from "./components/Experience";
import Navbar from "./components/Navbar";
import { SocketManager } from "./components/SocketManager";
import { UI, shopModeAtom } from "./components/UI";
import StoreWalls from "./components/walls/Storewalls";
import StoreWalls2 from "./components/walls/Storewalls2";
import StoreWalls3 from "./components/walls/Storewalls3";
import StoreWalls4 from "./components/walls/Storewalls4";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@campnetwork/origin/react";
import { buyArt, contractABI, contractAddress, getBidders, getMaxBid, likeArt, placeBid, toggleAuction } from "./utils/utils";

function App() {
  const [shopMode] = useAtom(shopModeAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");
  const [likes, setLikes] = useState(0);

  const showModal = (id, price, likes, title, by) => {
    setId(id);
    console.log(id);
    setPrice(price);
    setLikes(likes);
    setIsModalVisible(true);
    setTitle(title);
    setOwner(by);
  };

  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [bid, setBid] = useState(null);
  const [title, setTitle] = useState(null);
  const [owner, setOwner] = useState("");
  const {origin} = useAuth();


  const handleBuy = async (id, price) => {
    try {
      // Ensure that state.contract is availabl

      // Parse the price from Ether to Wei
      const tx = await origin.callContractMethod(contractAddress, contractABI, buyArt, [id], {value: price});

      console.log("Bought Successfully!!", tx);
    } catch (error) {
      console.error("Error buying art:", error);
    }
  };
  const handleBid = async (id, bid) => {
    try {
      const tx = await origin.callContractMethod(contractAddress, contractABI, placeBid, [id], {value: BigInt(bid * 1e18)});
      console.log("Bid Successfully!!", tx);
    } catch (error) {
      console.log(error);
    }
  };
  const handleToggle = async (id) => {
    try {
      const tx = await origin.callContractMethod(contractAddress, contractABI, toggleAuction, [id]);
      console.log("Auction Toggled", tx);
    } catch (error) {
      console.log(error);
    }
  };
  const [bidders, setBidders] = useState([]);
  const [isBiddersModalVisible, setIsBiddersModalVisible] = useState(false); // Control the visibility of bidders modal

  const handleGetBidders = async (id) => {
    try {
      const fetchedBidders = await origin.callContractMethod(contractAddress, contractABI, getBidders, [id]);
      setBidders(fetchedBidders);
      setIsBiddersModalVisible(true);

      console.log("Bidders fetched", fetchedBidders);
    } catch (error) {
      console.log(error);
    }
  };
  const [maxBid, setMaxBid] = useState(null); // To store the maximum bid
  const [isMaxBidModalVisible, setIsMaxBidModalVisible] = useState(false); // Control the visibility of max bid modal
  const handleGetMaxBid = async (id) => {
    try {
      const maxBidInWei = await origin.callContractMethod(contractAddress, contractABI, getMaxBid, [id]);

      // After fetching, store the max bid and open the modal
      setMaxBid(maxBidInWei);
      setIsMaxBidModalVisible(true);

      console.log("Max bid fetched:", maxBidInWei);
    } catch (error) {
      console.error("Error fetching max bid:", error);
    }
  };
  const handleLike = async (id) => {
    try {
      const tx = await origin.callContractMethod(contractAddress, contractABI, likeArt, [id]);
      console.log("Art liked successfully!", tx);

      // Optionally, fetch the updated number of likes
    } catch (error) {
      console.error("Error liking art:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
  <Modal
        title={null} // Remove default title to avoid visibility issues
        open={isModalVisible}
        onCancel={handleCancel}
        className="professional-dark-modal"
        footer={null}
        width={520}
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
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">Art Details</h1>
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

          {/* Art Information */}
          <div className="p-6 border-b border-gray-700">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{title}</h2>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-xs text-gray-400 uppercase tracking-wider block">Current Price</span>
                  <span className="text-2xl font-bold text-white">{price} ETH</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Owner</span>
                  <div className="bg-gray-900 px-3 py-2 rounded-lg border border-gray-700">
                    <span className="font-mono text-sm text-gray-200">
                      {owner?.slice(0, 8)}...{owner?.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Place Your Bid</h3>
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full h-12 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="Enter bid amount (ETH)"
                  onChange={(e) => setBid(e.target.value)}
                />
              </div>
              <button
                className="h-12 bg-white hover:bg-gray-100 text-black font-semibold px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 min-w-[100px] justify-center"
                onClick={() => handleBid(id, bid)}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Bid</span>
              </button>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>
            
            {/* Buy Now - Primary Action */}
            <button
              className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
              onClick={() => handleBuy(id, price)}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              <span>Buy Now - {price} ETH</span>
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className="h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200 border border-gray-600 flex items-center justify-center space-x-2"
                onClick={() => handleToggle(id)}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>Toggle Auction</span>
              </button>

              <button
                className="h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200 border border-gray-600 flex items-center justify-center space-x-2"
                onClick={() => handleGetBidders(id)}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <span>View Bidders</span>
              </button>
            </div>

            {/* Max Bid Info */}
            <button
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200 border border-gray-600 flex items-center justify-between px-4"
              onClick={() => handleGetMaxBid(id)}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Highest Bid</span>
              </div>
              <span className="font-bold text-white">
                {maxBid ? `${maxBid} ETH` : "Click to View"}
              </span>
            </button>

            {/* Like Section */}
            <div className="pt-2 border-t border-gray-700">
              <button
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200 border border-gray-600 flex items-center justify-center space-x-3"
                onClick={() => handleLike(id)}
              >
                <svg
                  className="w-5 h-5 fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="font-semibold">{likes} Likes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Professional Bidders Modal */}
        <Modal
          title={null}
          open={isBiddersModalVisible}
          onOk={() => setIsBiddersModalVisible(false)}
          onCancel={() => setIsBiddersModalVisible(false)}
          footer={null}
          width={480}
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
            {/* Custom Bidders Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">Bidders List</h1>
              </div>
              <button 
                onClick={() => setIsBiddersModalVisible(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Art Info */}
              <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-semibold text-white">Art ID: {id}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Active Bidders ({bidders.length})
                </h4>
                
                {bidders.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {bidders.map((bidder, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-mono text-sm text-gray-200 flex-1">{bidder}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p className="text-gray-300 font-medium text-lg">No bidders yet</p>
                    <p className="text-gray-500 text-sm mt-2">Be the first to place a bid!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      </Modal>

      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }}>
        <StoreWalls />
        <StoreWalls2 />
        <StoreWalls3 />
        <StoreWalls4 />
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={shopMode ? 4 : 0}>
          <Experience
            onFrameClick={showModal}
          />
        </ScrollControls>
      </Canvas>
      <UI/>
    </>
  );
}

export default App;
