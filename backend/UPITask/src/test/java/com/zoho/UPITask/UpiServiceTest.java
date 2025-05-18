package com.zoho.UPITask;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.zoho.UPITask.exception.InsufficientBalanceException;
import com.zoho.UPITask.exception.UpiNotEnabledException;
import com.zoho.UPITask.exception.UserNotFoundException;
import com.zoho.UPITask.model.User;
import com.zoho.UPITask.repository.*;
import com.zoho.UPITask.service.UpiService;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class UpiServiceTest {

    @Autowired
    private UpiService upiService;

    @Autowired
    private UserRepository userRepo;

    @BeforeEach
    void setup() {
        userRepo.save(new User("9999999999", false, 0.0, 0, 0.0));
    }

    @Test
    void testUserNotFoundException() {
        assertThrows(UserNotFoundException.class, () -> {
            upiService.disableUpi("0000000000");
        });
    }

    @Test
    void testUpiNotEnabledException() {
        assertThrows(UpiNotEnabledException.class, () -> {
            upiService.transfer("9999999999", "9999999999", 1000);
        });
    }

    @Test
    void testInsufficientBalanceException() {
        userRepo.save(new User("8888888888", true, 100.0, 0, 0.0));
        assertThrows(InsufficientBalanceException.class, () -> {
            upiService.transfer("8888888888", "9999999999", 1000);
        });
    }
}

