package com.zoho.UPITask.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zoho.UPITask.model.Transaction;
import com.zoho.UPITask.service.UpiService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/upi")
public class UpiController {

    @Autowired
    private UpiService upiService;

    @PostMapping("/enable/{phone}")
    public String enableUpi(@PathVariable String phone) {
        return upiService.enableUpi(phone);
    }

    @PostMapping("/disable/{phone}")
    public String disableUpi(@PathVariable String phone) {
        return upiService.disableUpi(phone);
    }

    @GetMapping("/balance/{phone}")
    public double checkBalance(@PathVariable String phone) {
        return upiService.checkBalance(phone);
    }

    @PostMapping("/add-money")
    public String addMoney(@RequestParam String phone, @RequestParam double amount) {
        return upiService.addMoney(phone, amount);
    }

    @PostMapping("/transfer")
    public String transfer(@RequestParam String from, @RequestParam String to, @RequestParam double amount) {
        return upiService.transfer(from, to, amount);
    }
    
    @GetMapping("/transactions/{phone}")
    public List<Transaction> getTransactions(@PathVariable String phone) {
        return upiService.getTransactions(phone);
    }

}

