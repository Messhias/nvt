# NovaBook Tax API

This API is designed to manage sales transaction events and tax payments. It allows ingestion of transactions, querying the tax position on a specific date, and amending sales items.

## Technologies Used
- **Node.js**
- **Express.js**
- **SQLite**
- **TypeScript**
- **Joi** for data validation
- **Jest** and **Supertest** for automated testing

## Prerequisites
- **Node.js** version 12 or higher
- **npm** (or **yarn**)

## Installation

```
npm install

```
# Database Setup
The API uses SQLite. When starting the API, the database will be automatically created.

# Running the Project
To run the project in development mode:

```
npm run start:dev
```

#### To compile and run the project:

```
npm run build
npm start
```


# Testing

Integration tests are implemented using Jest and Supertest.

To run all tests:

```
npm test
```

# API Endpoints
1. Transaction Ingestion
- Endpoint: POST /api/transactions
- Description: Ingests sales or tax payment events.
- Example JSON for Sales Event:
```
{
  "eventType": "SALES",
  "date": "2024-02-22T17:29:39Z",
  "invoiceId": "invoice123",
  "items": [
    {
      "itemId": "item123",
      "cost": 1000,
      "taxRate": 0.2
    }
  ]
}
```


- Example JSON for Tax Payment Event:

```
{
  "eventType": "TAX_PAYMENT",
  "date": "2024-02-22T17:29:39Z",
  "amount": 150
}
```
2. Tax Position Query
- Endpoint: GET /api/tax-position
- Description: Queries the tax position for a specific date.
- Query Parameters:
    - date (required): Date in ISO 8601 format.
    - Example:

```
GET /api/tax-position?date=2024-02-22T17:29:39Z
```

3. Sale Amendment
- Endpoint: PATCH /api/sale
- Description: Allows amending a specific item in a sale.
- Example JSON:
```
{
  "date": "2024-02-22T17:29:39Z",
  "invoiceId": "invoice123",
  "itemId": "item123",
  "cost": 800,
  "taxRate": 0.15
}
```

# Data Validation
Each endpoint performs data validation using Joi to ensure that data is submitted in the correct format. Examples include:

- eventType must be "SALES" or "TAX_PAYMENT".
- date must be in ISO 8601 format.
- cost and amount must be positive values.


# Project Structure

```
/src
├── /controllers        # API controllers
├── /database           # SQLite database configuration
├── /migrations         # Database migrations for table creation
├── /routes             # API route definitions
├── /tests              # Automated tests with Jest
└── index.ts            # Main application file
```

# Error Examples and Validation Messages

The API returns clear error messages for invalid inputs:

- Example: If the `eventType` is invalid:
```
{
  "error": "\"eventType\" must be one of [SALES, TAX_PAYMENT]"
}
```

# Author
Developed by Fabio William Conceição - messhias@gmail.com.

