-- Create the database
CREATE DATABASE behavioral_analysis;

-- Use the database
USE behavioral_analysis;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create behavioral_profiles table
CREATE TABLE behavioral_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  typing_speed FLOAT,
  typing_rhythm TEXT,
  mouse_movement_pattern TEXT,
  click_pattern TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create anomalies table
CREATE TABLE anomalies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  timestamp DATETIME NOT NULL,
  is_anomaly BOOLEAN NOT NULL,
  confidence_score FLOAT,
  details TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  timestamp DATETIME NOT NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id VARCHAR(50) NOT NULL,
  details TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert a demo user
INSERT INTO users (username, email, password) 
VALUES ('demo', 'demo@example.com', 'password');

-- Insert some sample anomalies
INSERT INTO anomalies (user_id, timestamp, is_anomaly, confidence_score, details) VALUES 
(1, '2023-04-08 10:30:00', 1, 0.85, 'Unusual typing pattern detected'),
(1, '2023-04-08 11:15:00', 0, 0.25, 'Normal activity'),
(1, '2023-04-08 12:00:00', 1, 0.92, 'Multiple unusual mouse movements'),
(1, '2023-04-08 12:45:00', 0, 0.15, 'Normal activity'),
(1, '2023-04-08 13:30:00', 0, 0.30, 'Normal activity'),
(1, '2023-04-08 14:15:00', 1, 0.78, 'Unusual click pattern detected');

-- Insert some sample audit logs
INSERT INTO audit_logs (user_id, timestamp, action, table_name, record_id, details) VALUES
(1, '2023-04-08 10:30:00', 'LOGIN', 'users', '1', 'User login successful'),
(1, '2023-04-08 11:15:00', 'CREATE', 'patients', '101', 'New patient record created'),
(1, '2023-04-08 12:00:00', 'UPDATE', 'appointments', '201', 'Appointment rescheduled'),
(1, '2023-04-08 12:45:00', 'READ', 'patients', '102', 'Patient record accessed'),
(1, '2023-04-08 13:30:00', 'DELETE', 'appointments', '202', 'Appointment cancelled'),
(1, '2023-04-08 14:15:00', 'LOGOUT', 'users', '1', 'User logout');
