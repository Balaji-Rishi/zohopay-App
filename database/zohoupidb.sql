CREATE DATABASE upi_db;
show databases;
use upi_db;
show tables;

desc user;
select * from user;

desc transaction;
select * from transaction;

desc app_user;
select * from app_user;

ALTER TABLE user DROP COLUMN total_added_amount;

ALTER TABLE user DROP COLUMN total_money_amount;



DELETE FROM user
WHERE balance = '1000' AND phone_number = '123';
DELETE FROM user;  -- Deletes EVERYTHING in the users table!
drop table user;
drop table transaction;
select * from user; 