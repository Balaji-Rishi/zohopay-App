package com.zoho.UPITask.exception;

public class TransactionCountExceededException extends RuntimeException {
  
	private static final long serialVersionUID = 1L;

	public TransactionCountExceededException(String message) {
        super(message);
    }

}
