package com.zoho.UPITask.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	   @ExceptionHandler(UserNotFoundException.class)
	    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	    }
	   
	   @ExceptionHandler(UpiNotEnabledException.class)
	    public ResponseEntity<String> handleUpiDisabled(UpiNotEnabledException ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
	    }

	    @ExceptionHandler(InsufficientBalanceException.class)
	    public ResponseEntity<String> handleLowBalance(InsufficientBalanceException ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
	    }

	    @ExceptionHandler(TransferLimitExceededException.class)
	    public ResponseEntity<String> handleLimitExceeded(TransferLimitExceededException ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
	    }

	    @ExceptionHandler(TransactionCountExceededException.class)
	    public ResponseEntity<String> handleTxnCountExceeded(TransactionCountExceededException ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.TOO_MANY_REQUESTS);
	    }

    @ExceptionHandler(MaxBalanceExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxBalanceExceeded(MaxBalanceExceededException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", "/upi/add-money");

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}

