package com.zoho.UPITask.exception;

public class MaxBalanceExceededException extends RuntimeException {
   
	private static final long serialVersionUID = 1L;

	public MaxBalanceExceededException(String message) {
        super(message);
    }
}

