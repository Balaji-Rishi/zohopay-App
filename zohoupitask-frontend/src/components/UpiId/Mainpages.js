import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Tab, Tabs } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Card, Badge } from 'react-bootstrap';



function MainPages() {
  const [phone, setPhone] = useState(localStorage.getItem('lastUsedPhone') || '');
  const [toPhone, setToPhone] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [upiStatus, setUpiStatus] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [senderPhone, setSenderPhone] = useState('');


  const baseUrl = 'http://localhost:8080/upi';
  const API_ENDPOINTS = {
    ENABLE: '/enable',
    DISABLE: '/disable',
    BALANCE: '/balance',
    ADD_MONEY: '/add-money',
    TRANSFER: '/transfer',
    HISTORY: '/transactions',
  };


  useEffect(() => {
    if (phone.length === 10) {
      localStorage.setItem('lastUsedPhone', phone);
      fetchTransactionHistory();
    } else {
      setUpiStatus(null); // Reset UPI status when phone becomes invalid
    }
  }, [phone]);


  const fetchTransactionHistory = async () => {
    try {
      const token = localStorage.getItem('token');  // get token from storage
      const res = await axios.get(`${baseUrl}${API_ENDPOINTS.HISTORY}/${phone}`, {
        headers: {
          Authorization: `Bearer ${token}`, // add token here
        },
      });
      setTransactions(res.data || []);
    } catch (error) {
      console.error('Error fetching transaction history', error);
      toast.error('Failed to fetch transaction history');
    }
  };


  const handleApiCall = async (endpoint, method = 'post', params = {}) => {
    if (!phone || phone.length !== 10) {
      toast.error('Enter a valid 10-digit phone number');
      return;
    }

    if (params.amount !== undefined) {
      const amount = Number(params.amount);
      if (!amount || amount <= 0) {
        toast.error('Enter a valid amount greater than 0');
        return;
      }
    }

    if (endpoint.includes(API_ENDPOINTS.TRANSFER)) {
      if (!toPhone || toPhone.length !== 10) {
        toast.error('Enter a valid 10-digit receiver phone number');
        return;
      }
      if (params.amount > 20000) {
        toast.error('Transfer failed: Maximum allowed per transaction is ₹20,000.');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Get token from localStorage or any other place you store it
      const token = localStorage.getItem('token');

      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        params,
        headers: {
          Authorization: `Bearer ${token}`,  // <-- Add this header
          'Content-Type': 'application/json',
        },
      });

      let messageToShow = '';
      if (endpoint.includes('balance')) {
        messageToShow = `Your current account balance is ₹${response.data}`;
      } else {
        messageToShow = response.data || 'Success';
      }

      setMessage(messageToShow);
      toast.success(messageToShow);

      if (endpoint.includes('enable')) setUpiStatus('enabled');
      if (endpoint.includes('disable')) setUpiStatus('disabled');

      fetchTransactionHistory();

      if (endpoint === API_ENDPOINTS.ADD_MONEY) setAddAmount('');
      if (endpoint === API_ENDPOINTS.TRANSFER) {
        setTransferAmount('');
        setToPhone('');
      }

    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Something went wrong';

      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const savedPhone = localStorage.getItem('senderPhone');
    if (savedPhone) {
      setSenderPhone(savedPhone);
    }
  }, []);




  const handleInputChange = (e, setter) => {
    setter(e.target.value.replace(/[^0-9]/g, ''));
  };

  return (
    <motion.div className="container mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ToastContainer position="bottom-center" />
      <h2 className="text-center mb-4">💸 Zohopay App</h2>

      <Tabs defaultActiveKey="upi" id="upi-tabs" className="mb-4">
        {/* UPI Management */}
        <Tab eventKey="upi" title="UPI Management">
          <div className="card p-4 mb-3 shadow-sm">
            <h5>🏦 UPI Management</h5>

            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phone}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => handleInputChange(e, setPhone)}
              margin="normal"
            />

            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className={`badge ${upiStatus === 'enabled' ? 'bg-success' : 'bg-secondary'}`}>
                UPI: {phone.length === 10 ? (upiStatus || 'unknown') : 'unknown'}
              </span>
            </div>

            <div className="mt-3 d-flex gap-2 flex-wrap">
              <button className="btn btn-success" onClick={() => handleApiCall(`${API_ENDPOINTS.ENABLE}/${phone}`)} disabled={isLoading}>
                Enable UPI
              </button>
              <button className="btn btn-danger" onClick={() => handleApiCall(`${API_ENDPOINTS.DISABLE}/${phone}`)} disabled={isLoading}>
                Disable UPI
              </button>
              <button className="btn btn-primary" onClick={() => handleApiCall(`${API_ENDPOINTS.BALANCE}/${phone}`, 'get')} disabled={isLoading}>
                Check Balance
              </button>
            </div>
          </div>
        </Tab>

        {/* Add Money */}
        <Tab eventKey="add" title="Add Money">
          <form
            className="card p-4 mb-3 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              handleApiCall(API_ENDPOINTS.ADD_MONEY, 'post', { phone, amount: addAmount });
            }}
          >
            <h5>🪙  Add Money</h5>

            {/* New phone number and UPI status display */}
            <Card className="mb-4 shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <PhoneAndroidIcon color="action" />
                  <strong>Your Phone Number:</strong> <span>{phone}</span>

                </div>

                <div>
                  <strong>UPI Status:</strong>{' '}
                  <Badge
                    bg={
                      upiStatus === 'enabled'
                        ? 'success'
                        : upiStatus === 'disabled'
                          ? 'danger'
                          : 'secondary'
                    }
                    className="text-uppercase"
                  >
                    {upiStatus || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </Card>


            <TextField
              label="Amount"
              variant="outlined"
              fullWidth
              value={addAmount}
              onChange={(e) => handleInputChange(e, setAddAmount)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />

            <div className="mt-3 d-flex gap-2 flex-wrap">
              <button type="submit" className="btn btn-warning" disabled={isLoading}>
                Add Money
              </button>
              <button className="btn btn-primary" onClick={() => handleApiCall(`${API_ENDPOINTS.BALANCE}/${phone}`, 'get')} disabled={isLoading}>
                Check Balance
              </button>
            </div>
          </form>
        </Tab>

        {/* Transfer Money */}
        <Tab eventKey="transfer" title="Transfer Money">
          <form
            className="card p-4 mb-3 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              handleApiCall(API_ENDPOINTS.TRANSFER, 'post', {
                from: phone,
                to: toPhone,
                amount: transferAmount,
              });
            }}
          >
            <h5>🔁 Transfer Money</h5>

            {/* Sender Phone Number Input */}
            <TextField
              label="Sender Phone Number"
              variant="outlined"
              fullWidth
              value={phone} // ✅ directly use the already-loaded phone
              disabled
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />


            {/* Beneficiary Phone Number Input */}
            <TextField
              label="Beneficiary Phone Number"
              variant="outlined"
              fullWidth
              value={toPhone}
              onChange={(e) => handleInputChange(e, setToPhone)}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroidIcon />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />

            <TextField
              label="Amount"
              variant="outlined"
              fullWidth
              value={transferAmount}
              onChange={(e) => handleInputChange(e, setTransferAmount)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />

            <div className="mt-3 d-flex gap-2 flex-wrap">
              <button type="submit" className="btn btn-info" disabled={isLoading}>
                Transfer Money
              </button>
            </div>
          </form>
        </Tab>

        {/* Transaction History */}
        <Tab eventKey="history" title="Transaction History">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">📜 Recent Transactions</h5>
            {transactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <ul className="list-group">
                {transactions.map((tx, index) => (
                  <div key={index} className="card p-3 mb-2 shadow-sm">
                    <p><strong>From:</strong> {tx.sender}</p>
                    <p><strong>To:</strong> {tx.receiver}</p>
                    <p><strong>Amount:</strong> ₹{tx.amount}</p>
                    <p><strong>Date:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </Tab>
      </Tabs>
    </motion.div>
  );
}

export default MainPages;
