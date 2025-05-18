package com.zoho.UPITask.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zoho.UPITask.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderAndTimestampBetween(String sender, LocalDateTime start, LocalDateTime end);

	List<Transaction> findBySenderOrReceiverOrderByTimestampDesc(String phone, String phone2);
}

