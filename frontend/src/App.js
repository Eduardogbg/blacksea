import React, { useState } from 'react';
import './App.css';
import Orders from './Orders';
import { ethers } from 'ethers';

const contractAddress = 'your_contract_address_here';
const contractABI = your_contract_ABI_here;  // Import ABI as a JSON object

function App() {
  const [orders, setOrders] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState(null);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setUserAddress(await signer.getAddress());
        const network = await provider.getNetwork();

        if (network.chainId === 23295) {  // Replace with actual chainId for Sapphire
          setNetworkName('Oasis Sapphire Testnet');
          const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(contractInstance);
          fetchOrders(contractInstance); // Fetch orders after setting the contract
        } else {
          setNetworkName('Wrong network');
        }
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else {
      console.log('MetaMask is not installed.');
    }
  };

  const fetchOrders = async (contract) => {
    try {
      const fetchedOrders = await contract.getAuthorOrders();
      setOrders(fetchedOrders.map(order => ({
        id: order.id,
        fromToken: order.sellToken,
        fromAmount: ethers.utils.formatEther(order.sellQuantity),
        toToken: order.buyToken,
        toAmount: ethers.utils.formatEther(order.buyQuantity),
        status: order.status
      })));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleCreateOrder = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const sellToken = formData.get('fromToken');
    const sellQuantity = formData.get('fromAmount');
    const buyToken = formData.get('toToken');
    const buyQuantity = formData.get('toAmount');

    try {
      const order = { 
        sellToken, 
        sellQuantity: ethers.utils.parseEther(sellQuantity.toString()), 
        buyToken, 
        buyQuantity: ethers.utils.parseEther(buyQuantity.toString()), 
        status: 'Open' 
      };
      await contract.placeOrder(sellToken, order);
      fetchOrders(contract);  // Refresh the orders after placing a new one
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BLACKSEA</h1>
        <button onClick={handleConnectWallet}>
          {userAddress ? 'Connected' : 'Connect Wallet'}
        </button>
        {userAddress && <p>Connected to: {networkName}</p>}
      </header>
      <main>
        <form className="trading-engine" onSubmit={handleCreateOrder}>
          <input name="fromToken" type="text" placeholder="Enter sell token symbol" />
          <input name="fromAmount" type="number" placeholder="Sell amount" />
          <input name="toToken" type="text" placeholder="Enter buy token symbol" />
          <input name="toAmount" type="number" placeholder="Buy amount" />
          <button type="submit">Create Order</button>
        </form>
        <Orders orders={orders} />
      </main>
    </div>
  );
}

export default App;
