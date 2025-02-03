# Campus-Plug
The ultimate plug for student deals

## Features Breakdown

### Buying Features:
- [ ] **Browsing & Searching for Products:**
  - [ ] Categories (e.g., electronics, textbooks, clothing)
  - [ ] Keyword-based search
  - [ ] Advanced filters (price range, condition, seller rating, location)

- [ ] **Viewing Product Details:**
  - [ ] Product descriptions
  - [ ] Pricing details
  - [ ] Seller contact information
  - [ ] Product condition (new, like new, used)
  - [ ] Multiple images

- [ ] **Contacting Seller:**
  - [ ] Seller's contact details (email/phone)
  - [ ] Direct communication without in-app chat

- [ ] **Reviews & Ratings:**
  - [ ] 5-star rating system
  - [ ] Review text for seller feedback

### Selling Features:
- [ ] **Add/Edit Product Listings:**
  - [ ] Dashboard for sellers to add, edit, and delete listings
  - [ ] Upload images, set prices, and update availability

- [ ] **Sales Tracking:**
  - [ ] Dashboard for sales tracking (total sales, revenue)

- [ ] **Track Order History & Customer Info:**
  - [ ] Access to records of transactions, order details, and customer contact info

### Authentication & Security:
- [ ] **Sign up and Sign in with UCalgary Email:**
  - [ ] Email-based authentication (using @ucalgary.ca) with OPT

### Recommendation System:
- [ ] **Product Recommendations:**
  - [ ] Suggest products based on user browsing and buying history

## some ground rules
1. Add both node_modules from client and server to your `gitignore` file
2. Do not use `.ENV` variables
3. For any functionality make a brach with the prefix of your name `Name-<some branch name>` use this namign convention
4. For all method added a comment as to what it does

## Client
- Use React Js
- Use vite as the node manger
## Server
1. Install the needed lib with the command bellow
```  bash
    npm install express mysql2 dotenv cors
```
2. make sure in the `package.json` file type is set to module, if it not there add it.
```json
    {
        ...,
        "type": "module"
    }
```
3. To start the server, cd into server dir and then type command `npm run start`

## Database
- Use only SQL database
- Loading of initian database will be done
