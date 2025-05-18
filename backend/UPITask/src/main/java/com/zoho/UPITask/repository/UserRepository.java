package com.zoho.UPITask.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zoho.UPITask.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}

