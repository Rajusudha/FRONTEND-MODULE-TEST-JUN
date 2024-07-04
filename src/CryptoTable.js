// src/CryptoTable.js
import React, { useState, useEffect } from 'react';
import './CryptoTable.css';

const CryptoTable = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedBy, setSortedBy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataWithThen();
    // Alternatively, use fetchDataWithAsyncAwait();
  }, []);

  const fetchDataWithThen = () => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const fetchDataWithAsyncAwait = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (key) => {
    const sortedData = [...data].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    setData(sortedData);
    setSortedBy(key);
  };

  const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="crypto-table">
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={handleSearch} 
      />
      <button onClick={() => handleSort('market_cap')}>Sort by Market Cap</button>
      <button onClick={() => handleSort('price_change_percentage_24h')}>Sort by % Change</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Current Price</th>
              <th>Total Volume</th>
              <th>Market Cap</th>
              <th>Price Change % (24h)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(coin => (
              <tr key={coin.id}>
                <td><img src={coin.image} alt={coin.name} width="20" /></td>
                <td>{coin.name}</td>
                <td>{coin.symbol}</td>
                <td>${coin.current_price}</td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td>{coin.price_change_percentage_24h.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CryptoTable;
