# zohopay-upi-transaction-app
UPI Transaction Application with frontend and backend

# ZohoPay - UPI Transaction App

# UPI Transaction Application

## Overview
This project is a simple UPI Transaction system that implements the following features:
- Enable/Disable UPI for a phone number (10 digits)
- Transfer money to another UPI number
- Check account balance
- Add money to the UPI number

### Constraints
- Maximum account balance: ₹100,000
- Maximum 3 transfers per day per phone number
- Maximum transfer amount: ₹20,000 per transaction
- Maximum daily transfer limit: ₹50,000

## Technologies Used
- **Frontend:** React.js
- **Backend:** Spring Boot
- **Database:** MySQL

## Features
- UPI enable/disable functionality
- Money transfer with validations (amount limits, daily limits, UPI status)
- Balance checking
- Adding money with max balance constraint
- Modular and clean database design
- JWT-based authentication (optional)
- Responsive UI design for easy interaction

## Database Design
- **User Table:** Stores phone number, UPI status, balance, daily transfer counts, and limits
- **Transaction Table:** Stores transaction details like sender, receiver, amount, timestamp

## How to Run
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/upi-transaction-app.git

2.Import the project into your IDE (e.g., IntelliJ, VS Code)

3.Setup your MySQL database and update connection properties in application.properties

4.Run the backend server

5.Navigate to the frontend folder and run: 

     npm install
      npm start
      
 6.Open the UI in your browser at http://localhost:3000


Code Explanation

* Backend REST APIs cover enable/disable UPI, money transfer, balance check, and adding money

* Business logic validates max balance, transfer limits, daily counts

* Transactions are logged with timestamps to enforce daily limits

* Passwords are hashed with BCrypt (if authentication is implemented)

* JWT tokens are used for secure API access (if implemented)

* Frontend uses React.js with Axios to consume backend APIs

Screenshots
(Add screenshots here if available)
![image](https://github.com/user-attachments/assets/3d2e001c-3ab3-42a9-b2e3-af52ba4c5ea0)

![image](https://github.com/user-attachments/assets/5e8c02f3-e532-41c1-81eb-4e89fb81ca3c)




Author
balaji S
Email:balajikrish268@gmail.com
LinkedIn: https://www.linkedin.com/in/balaji268/

License
This project is licensed under the MIT License.

If you want, I can help you format or customize it further! Just tell me.










 


