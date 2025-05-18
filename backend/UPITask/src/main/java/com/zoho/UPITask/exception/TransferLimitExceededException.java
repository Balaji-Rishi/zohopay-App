package com.zoho.UPITask.exception;

public class TransferLimitExceededException extends RuntimeException {
   
	private static final long serialVersionUID = 1L;

	public TransferLimitExceededException(String message) {
        super(message);
    }

}
