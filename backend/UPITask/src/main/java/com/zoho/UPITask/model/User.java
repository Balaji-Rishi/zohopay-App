package com.zoho.UPITask.model;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    private String phoneNumber;
    private boolean upiEnabled;
    private double balance;
    private int dailyTransferCount;
    private double dailyTransferAmount;

    // Default constructor (required by JPA)
    public User() {
    }

    // Parameterized constructor
    public User(String phoneNumber, boolean upiEnabled, double balance, 
                int dailyTransferCount, double dailyTransferAmount) {
        this.phoneNumber = phoneNumber;
        this.upiEnabled = upiEnabled;
        this.balance = balance;
        this.dailyTransferCount = dailyTransferCount;
        this.dailyTransferAmount = dailyTransferAmount;
    }

    // Getters
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isUpiEnabled() {
        return upiEnabled;
    }

    public double getBalance() {
        return balance;
    }

    public int getDailyTransferCount() {
        return dailyTransferCount;
    }

    public double getDailyTransferAmount() {
        return dailyTransferAmount;
    }

    // Setters
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setUpiEnabled(boolean upiEnabled) {
        this.upiEnabled = upiEnabled;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void setDailyTransferCount(int dailyTransferCount) {
        this.dailyTransferCount = dailyTransferCount;
    }

    public void setDailyTransferAmount(double dailyTransferAmount) {
        this.dailyTransferAmount = dailyTransferAmount;
    }
}