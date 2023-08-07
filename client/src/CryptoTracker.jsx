import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { FiSun, FiMoon } from "react-icons/fi";
import Loading from "./Loading";

const COINS_QUERY = gql`
  query Coin {
    coins {
      id
      name
      price
      symbol
    }
  }
`;

const CryptoTracker = () => {
  const { loading, error, data, refetch } = useQuery(COINS_QUERY);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 2000); // Fetch data every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCoins = data.coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}>
      {/* Header */}
      <div
        className={
          darkMode ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-row items-center justify-between">
          <h1 className="text-5xl font-bold ">Crypto Tracker</h1>
          <div className=" flex items-center ">
            <input
              type="text"
              placeholder="Search"
              size={30}
              value={searchTerm}
              onChange={handleSearch}
              className="block text-sm font-bold px-4 py-2 mt-4 text-black "
            />
            <button
              className="ml-4 rounded-md px-4 py-2"
              onClick={toggleDarkMode}
            >
              {darkMode ? <FiSun size={40} /> : <FiMoon size={40} />}
            </button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <table
          className={
            darkMode
              ? "table-auto w-full bg-gray-800 border-gray-600"
              : "table-auto w-full bg-white border border-gray-200"
          }
        >
          <thead
            className={
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-600"
            }
          >
            <tr>
              <th className="py-3 px-4 text-left font-bold text-sm">#</th>
              <th className="py-3 px-4 text-left font-medium text-sm">Name</th>
              <th className="py-3 px-4 text-left font-medium text-sm">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCoins.map((coin) => (
              <tr
                key={coin.id}
                className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
              >
                <td className="py-3 px-4 text-left text-sm">{coin.id}</td>
                <td className="py-3 px-4 text-left text-sm">
                  <span className="font-medium">{coin.name}</span>{" "}
                  <span className="text-gray-500">({coin.symbol})</span>
                </td>
                <td className="py-3 px-4 text-left text-sm font-semibold">
                  $
                  {coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTracker;
