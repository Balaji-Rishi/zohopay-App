CREATE DATABASE upi_db;
show databases;
use upi_db;
show tables;

desc user;
select * from user;

desc transaction;
select * from transaction;


DELETE FROM user
WHERE balance = '1000' AND phone_number = '123';
DELETE FROM user;  -- Deletes EVERYTHING in the users table!
drop table user;
drop table transaction;
select * from user; 