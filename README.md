# TukoShop-App

TukoShop is a name that combines "Tuko"-Swahili for "we're here","Shop"-English for marketplace.This simply mean "Our shop is here."

You can access the application [Live Here](https://tukoshop-app.onrender.com)


A full-stack marketplace application built with Node.js, Express, MongoDB, React, Vite, and TailwindCSS. This app allows sellers to add products, admins to approve them, and buyers to browse and purchase approved products.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [How to Use](#how-to-use)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- User roles: Seller, Admin, Buyer  
- Sellers can add and manage their products  
- Admins approve or reject products before listing  
- Buyers can browse approved products  
- JWT-based authentication and authorization  
- Responsive UI with React, Vite, TailwindCSS  
- RESTful API with Express and MongoDB  

---

## Tech Stack

| Layer         | Technology             |
| ------------- | --------------------- |
| Frontend      | React 17, Vite 2, TailwindCSS 2  |
| Backend       | Node.js 12.22.12, Express 4  |
| Database      | MongoDB 4.2            |
| Authentication| JWT, bcrypt            |
| HTTP Client   | Axios                  |

---

## Getting Started

### Prerequisites

- Node.js >=12.22  
- MongoDB instance running locally or remotely  
- npm or yarn  

### Backend Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/kipngetich-lab/TukoShop-App.git
   cd TukoShop-App
   ```

2. Install dependencies:

	```bash
	npm install && cd client && npm install && cd ..
	```

3. Create .env file in the root:

	```javascript
	PORT=5001
	MONGODB_URI=mongodb://localhost:27017/localmarketdb
	JWT_SECRET=your_jwt_secret_key
	```

4. Start the backend server:

	```bash
	npm run dev
	```

5. Navigate to client folder:

	```bash 
	cd client
	```

6. Create .env file in client folder:

	```javascript
	VITE_API_URL=http://localhost:5001/api
	```

7. Start the frontend development server:

	```bash
	npm run dev
	```

8. Open http://localhost:3000 in your browser.

### API Endpoints

	Authentication

    POST /api/users/register - Register a new user (buyer, seller)
    POST /api/users/login - Login and receive JWT token

	Products

    POST /api/products - Seller adds a new product (default status: pending)
    GET /api/products/mine - Seller fetches their own products (approved only)
    GET /api/products - Fetch all approved products (for buyers)
    PATCH /api/products/:id/approve - Admin approves product
    PATCH /api/products/:id/reject - Admin rejects product

### How to Use

    1. Register as a seller, add products via the seller dashboard.
    2. Admin logs in and approves products to make them visible.
    3. Buyers browse and search approved products.
    4. Sellers can view their own approved products under "My Products".

### Deployment

	1. Build frontend for production

	cd client
	npm run build

	2. Set environment variables on your production server or hosting platform.

    3. Deploy the application under one domain both frontend and backend with production MONGODB_URI, JWT_SECRET and JWT_EXPIRE.

	4. Make sure to update VITE_API_URL in client .env file or environment variables to your deployed backend URL.

### Contributing

	Contributions are welcome! Please fork the repo and create a pull request with your improvements.

### License

	MIT License 

### Contact
	
	For questions or support, reach me at joskipngetich07@gmail.com

