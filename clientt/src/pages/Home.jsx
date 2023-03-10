import React, { useState, useEffect, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import { MdDashboard } from "react-icons/md";
import { FcSettings } from "react-icons/fc";
import { RiLoginBoxLine } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { BiArrowBack, BiHelpCircle } from "react-icons/bi";
import { BsWalletFill } from "react-icons/bs";
import { FcMoneyTransfer } from "react-icons/fc";
import Footer from "../components/Footer";
import Dashboard from "../Dashboard/scenes/dashboard";
import Typography from "@mui/material/Typography";

import Pricing from "../components/Pricing";
import { UserContext } from "../UserContext";

import ProgressCircle from "../Dashboard/components/ProgressCircle";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [link, setLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const { getUser, referrer } = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [code, setCode] = useState("");
  const [cryptoHoldings, setCryptoHoldings] = useState([
    { name: "Bitcoin", symbol: "BTC", amount: 2.5, value: 125000 },
    { name: "Ethereum", symbol: "ETH", amount: 10, value: 30000 },
    { name: "Dogecoin", symbol: "DOGE", amount: 10000, value: 1000 },
  ]);

  const [totalBalance, setTotalBalance] = useState(157000);
  const [availableBalance, setAvailableBalance] = useState(60000);
  const [tradeFormData, setTradeFormData] = useState({
    symbol: "",
    amount: "",
    type: "buy",
  });
  const [linkDone, setLinkDone] = useState(false);
  useEffect(() => {
    const fetchBalance = async () => {
      const response = await getUser();
      if (response.status === 200) {
        setUsername(response.data.username);
      }
    };
    fetchBalance();
  }, [getUser]);

  const handleAccounts = () => {
    navigate("/deposit");
  };
  const handleWallet = () => {
    navigate("/wallet");
  };
  const handleSpinning = () => {
    navigate("/spin");
  };
  const handleLoans = () => {
    navigate("/loans");
  };

  const Menus = [
    {
      title: "Dashboard",
      icon: (
        <MdDashboard className="w-8 h-8 text-lightergray rounded-full hover:bg-gray-100 text-3xl" />
      ),
    },

    {
      title: "Inbox",
      icon: (
        <RiLoginBoxLine className="w-8 h-8 text-lightergray rounded-full hover:bg-gray-100 text-3xl" />
      ),
    },
    {
      title: "Accounts",
      icon: (
        <MdAccountCircle className="w-8 h-8 text-lightergray rounded-full hover:bg-gray-100 text-3xl" />
      ),
      handleClick: handleAccounts,
    },
    {
      title: "Wheel Spinning",
      icon: (
        // <BsWalletFill className="w-8 h-8 text-lightergray  hover:bg-gray-100 text-3xl" />
        <ProgressCircle />
      ),

      handleClick: handleSpinning,
    },
    {
      title: "Loans",
      icon: (
        <FcMoneyTransfer className="w-8 h-8 text-lightergray  hover:bg-gray-100 text-3xl" />
      ),

      handleClick: handleLoans,
    },
    {
      title: "My Wallet",
      icon: (
        <BsWalletFill className="w-8 h-8 text-lightergray  hover:bg-gray-100 text-3xl" />
      ),
      handleClick: handleWallet,
    },

    {
      title: "Settings",
      icon: (
        <FcSettings className="w-8 h-8 text-lightergray rounded-full hover:bg-gray-100 text-3xl" />
      ),
    },
    {
      title: "Help",
      icon: (
        <BiHelpCircle className="w-8 h-8 text-lightergray rounded-full hover:bg-gray-100 text-3xl" />
      ),
    },
  ];

  const handleTradeFormChange = (e) => {
    setTradeFormData({
      ...tradeFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitTrade = (e) => {
    e.preventDefault();

    const { symbol, amount, type } = tradeFormData;
    const price = 50000; // replace with API call to get current price

    const value = price * parseFloat(amount);

    if (type === "buy" && value > availableBalance) {
      alert("Insufficient funds!");
      return;
    }

    const updatedCryptoHoldings = cryptoHoldings.map((crypto) => {
      if (crypto.symbol === symbol) {
        if (type === "buy") {
          return {
            ...crypto,
            amount: crypto.amount + parseFloat(amount),
            value: crypto.value + value,
          };
        } else {
          return {
            ...crypto,
            amount: crypto.amount - parseFloat(amount),
            value: crypto.value - value,
          };
        }
      } else {
        return crypto;
      }
    });

    const updatedTotalBalance =
      type === "buy" ? totalBalance - value : totalBalance + value;

    const updatedAvailableBalance =
      type === "buy" ? availableBalance - value : availableBalance + value;

    setCryptoHoldings(updatedCryptoHoldings);
    setTotalBalance(updatedTotalBalance);
    setAvailableBalance(updatedAvailableBalance);
    setTradeFormData({ symbol: "", amount: "", type: "buy" });
  };
  const options = ["Option 1", "Option 2", "Option 3"];

  const generateLink = () => {
    let baseUrl = window.location.protocol + "//" + window.location.host;

    // link = link + "?" + "invitedby" + { username };
    const referalLink = `${baseUrl}/register?invitedby=${username}`;
    setLinkDone(true);
    setLink(referalLink);
  };

  function handleCopy(e) {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopySuccess("Copied!");
      })
      .catch((err) => {
        setCopySuccess("Failed to copy");
      });
  }

  const handleFormChange = (e) => {
    e.preventDefault();
    console.log(code);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  return (
    <div className="flex relative">
      <aside
        className={`sticky ${open ? "w-64" : "w-24 "}  
         bg-primary  top-0 h-screen p-5  pt-8  duration-300`}
      >
        <BiArrowBack
          className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 
           border-2 rounded-full text-white bg-secondary ${
             !open && "rotate-180"
           }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4  items-center">
          <MdDashboard className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-100 text-3xl text-lightergray duration-500" />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Rashel
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              <div
                className="hover:bg-divbg   items-center  w-full p-1.5 rounded-md flex "
                onClick={Menu.handleClick}
              >
                {" "}
                {Menu.icon}
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  <h1 className="text-white font-medium ml-2 mr-2 text-xl">
                    {Menu.title}
                  </h1>
                </span>
                {Menu.title === "Inbox" ? (
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                  </span>
                ) : (
                  ""
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <div className="bg-lightgray flex-1  w-full">
        <div className="flex">
          <span className="text-secondary text-2xl  font-mono font-bold">
            {" "}
            Hello {username}, Welcome.
          </span>

          <div className="ml-auto  mt-10 mr-10 ">
            <button
              className="bg-sky-500 p-2 hover:bg-sky-700 rounded-md text-white"
              onClick={generateLink}
            >
              generate link
            </button>
            {linkDone ? (
              <div>
                <button
                  className="bg-sky-500 p-2 mt-2 hover:bg-sky-700 rounded-md text-white"
                  onClick={handleCopy}
                >
                  {" "}
                  copy
                </button>{" "}
                <span className="text-linkColor ">
                  <span className="text-gray">Your link is:</span> {link}{" "}
                </span>{" "}
              </div>
            ) : (
              ""
            )}

            <h5 className="text-green-600">{copySuccess} </h5>
          </div>
        </div>
        <div className="flex">
          <div className="bg-secondary rounded-md ml-auto mr-10 mt-2 shadow-lg">
            <div className="m-2">
              <Typography
                component="h4"
                variant="h5"
                sx={{ p: 2 }}
                color="common.white"
              >
                {" "}
                Paybill Number: 756756
              </Typography>
              <Typography
                component="h4"
                variant="h5"
                sx={{ px: 2 }}
                color="common.white"
              >
                {" "}
                Account Number: 39870
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="ml-auto mr-10 mt-2">
            <form onSubmit={handleFormChange}>
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-1 text-secondary"
              >
                Enter Mpesa Reference code below:
              </label>
              <input
                type="text"
                Placeholder="Enter Mpesa Reference Code"
                className="border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded mr-2 p-1.5"
                onChange={handleCodeChange}
              />

              <button
                type="submit"
                className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Done
              </button>
            </form>
          </div>
        </div>
        {/* <Chart /> */}

        {/* <SpinningWheel options={options} /> */}
        <Pricing />
        <Dashboard />
        <div className="bg-primary mt-16 w-full">
          <Footer />
        </div>
        {/* <Deposits className=" ml-auto" /> */}
      </div>
    </div>
  );
}

export default Home;
