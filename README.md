The folder contains the following working api's:-



Firstly install the dependencies using 'npm install'

To run the code use npm start

######################################################################

API routes :-

RegisterUser: {
    type: "POST",
    route: "/api/signup"
},


LoginUser: {
    type: "POST",
    route: "/api/login"
},

AddNewTrain: {
    type: "POST",
    route: "/api/trains/create"
},

GetSeatAvailability: {
    type: "GET",
    route: "/api/trains/availability?source=SOURCE&destination=DESTINATION"
},

BookSeat: {
    type: "POST",
    route: "/api/trains/{train_id}/book"
},

GetSpecificBookingDetails: {
    type: "GET",
    route: "/api/bookings/{booking_id}"
}


######################################################################

// .env

PORT = {port on which server running}

SQL_USER = {username}

SQL_PASSWORD = {password}

SQL_DB = {db name of sql}


SQL_USER_TABLE = {name of user table}

SQL_TRAIN_TABLE = {name of table that contains train data}

SQL_TRAIN_BOOK_TABLE = {table that includes booking details}


JWT_KEY = {key}


CRYPTO_KEY = {to hash passwords}


APIKEY = {admin api key}
