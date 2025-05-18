package com.zoho.UPITask.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zoho.UPITask.model.Transaction;
import com.zoho.UPITask.model.User;
import com.zoho.UPITask.repository.TransactionRepository;
import com.zoho.UPITask.repository.UserRepository;

import com.zoho.UPITask.exception.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@Service
public class UpiService {
	

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TransactionRepository txnRepo;
    
    private static final Logger logger = LoggerFactory.getLogger(UpiService.class);



    public String enableUpi(String phone) {
        User user = userRepo.findById(phone).orElse(new User(phone, true, 0.0, 0, 0.0));
        user.setUpiEnabled(true);
        userRepo.save(user);
        
//        logger.info("UPI enabled for user: {}", phone);
        return "UPI successfully enabled for your number";
    }

    public String disableUpi(String phone) {
//    	logger.info("Disabling UPI for phone: {}", phone);
    	User user = userRepo.findById(phone).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setUpiEnabled(false);
        userRepo.save(user);
        
//        logger.info("UPI disabled for user: {}", phone);
        return "UPI successfully disabled for your number";
    }

    public double checkBalance(String phone) {
        return userRepo.findById(phone).orElseThrow(() -> new UserNotFoundException("User not found")).getBalance();
    }

    public String addMoney(String phone, double amount) {    
        User user = userRepo.findById(phone).orElseThrow(() -> new UserNotFoundException("User not found"));
        
        if (user.getBalance() + amount > 100000) {
            // ✅ Updated part: throw custom exception instead of RuntimeException
            throw new MaxBalanceExceededException("Cannot add money. Account balance cannot exceed ₹100,000. Please check your current balance before trying to add more funds");
        }

        user.setBalance(user.getBalance() + amount);
        userRepo.save(user);
        return "Money added";
    }


    public String transfer(String from, String to, double amount) {        
        User sender = userRepo.findById(from).orElseThrow(() -> new UserNotFoundException("Sender not found with phone: " + from));

//        User receiver = userRepo.f
        User receiver = userRepo.findById(to).orElseThrow(() -> new UserNotFoundException("Receiver not found with phone: " + to));
        
        if (!sender.isUpiEnabled())
            throw new UpiNotEnabledException("Sender UPI not enabled");
         	
        if (!receiver.isUpiEnabled())
            throw new UpiNotEnabledException("Receiver UPI not enabled");


        if (amount > 20000)        
        	throw new TransferLimitExceededException("Transfer failed: Maximum allowed per transaction is ₹20,000.");


        // Reset daily limits if new day
        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        List<Transaction> todaysTxns = txnRepo.findBySenderAndTimestampBetween(from, startOfToday, LocalDateTime.now());

        int todaysCount = todaysTxns.size();
        double todaysAmount = todaysTxns.stream().mapToDouble(Transaction::getAmount).sum();

     // Debug prints to check date range and transaction count
        System.out.println("Checking transactions from: " + startOfToday + " to " + LocalDateTime.now());
        System.out.println("Found " + todaysCount + " transactions today.");
        System.out.println("Total transferred amount today: ₹" + todaysAmount);
        
        if (todaysCount >= 3)
        	throw new TransactionCountExceededException("Sender has reached daily transaction limit (3 transfers)");

        if (todaysAmount + amount > 50000)
            throw new TransferLimitExceededException("Sender exceeded daily ₹50,000 transfer limit");

        if (sender.getBalance() < amount)
            throw new InsufficientBalanceException("Insufficient balance");
        
        // Perform transfer
        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        // Update daily transfer count and amount
        sender.setDailyTransferCount(todaysCount + 1);
        sender.setDailyTransferAmount(todaysAmount + amount);

        userRepo.save(sender);
        userRepo.save(receiver);

        txnRepo.save(new Transaction(null, from, to, amount, LocalDateTime.now()));

        return "Transfer amount successful from " + from + " to " + to + " of ₹" + amount;
        
        
    }
    
    public List<Transaction> getTransactions(String phone) {
        return txnRepo.findBySenderOrReceiverOrderByTimestampDesc(phone, phone);
    }
    
    

}
