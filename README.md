# Uber Clone Backend (Node.js + Express + MongoDB)

A production-ready Uber-like ride booking backend system built using Node.js, Express.js, MongoDB, and Mongoose.
This project implements real-world ride lifecycle management, driver availability control, geolocation tracking, authentication, and earnings calculation.

Features
User (Rider) Features => 
User Registration & Login (JWT Authentication)
Profile Management
Request a Ride
Cancel Ride
View Ride History
Get Current Ride Status

Driver Features => 
Driver Registration & Login
Driver Profile
Update Live Location (GeoJSON based)
Toggle Availability (Active / Inactive)
Accept Ride
Start Ride
Complete Ride
View Ride History
View Total Earnings

Ride Management => 
Ride Request Creation
Ride Acceptance Flow
Ride Lifecycle Tracking:
  requeste
  accepted
  started
  completed
  cancelled
Timestamp Tracking (acceptedAt, startedAt, completedAt, cancelledAt)

Tech Stack => 
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Bcrypt
GeoJSON + 2dsphere Indexing

Authentication => 
Access Token (JWT)
Protected Routes using Middleware
Role-based Access (Driver / User)

Earnings Logic => 
Driver earnings calculated using MongoDB aggregation:
Only completed rides counted
Total rides + total fare computed dynamically

Ride Lifecycle Flow => 
User requests ride
Driver (Active only) accepts ride
Driver starts ride
Driver completes ride
System tracks ride timestamps
Earnings updated automatically

APIs Implemented => 
Driver APIs => 
registationForDriver
logingDriver
driverlogout
driverProfile
updateDriverLocation
toggleDriverStatus
getDriverRideHistory
getDriverTotalEarnings

User APIs => 
createUser
userlogin
userlogout
userProfile

Ride APIs => 
requestRide
cancelRide
acceptRide
startRide
completeRide
getRideCurrentStatus
getUserRideHistory

Future Improvements (Planned) => 
Real-time ride tracking using Socket.io
Nearby driver search using geospatial queries
Rating & Review system
Payment integration
Surge pricing logic
Admin dashboard

Key Learning Outcomes => 
RESTful API Architecture
Role-Based Access Control
Geospatial Queries in MongoDB
Aggregation Pipelines
Ride Lifecycle State Management
Clean Controller & Middleware Structure

Author

Abhinav Tiwari
Backend Developer (Node.js | Express | MongoDB)
