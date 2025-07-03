/*
THIS IS A SERVICE FILE FOR HANDLING API REQUESTS
This file is for interacting with the flask API
This file is for the frontend to use
*/

//AccountScreen.js = 2
//DiscoverScreen.js = 1
//DetailsScreen.js = 1
//EventsScreen.js = 1


const axios = require('axios');
const { use } = require('react');

const BASE_URL = "http://localhost:8000"; // Replace with the correct IP and port

async function Connect() {
    try {
        const response = await axios.get(BASE_URL);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Connection error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function Login(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/login`, {
            username: username,
            password: password
        });
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Login error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

// Login("adventure_alex", "hashed_password_123")

async function Register(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/register`, {
            username: username,
            password: password
        })
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Registration error:", error);
    }
}

// Register("adventure_alexis_sanchez", "hashed_password_123");

async function Interests(userId, formData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/interests/${userId}`,{
            user_id: userId,
            interest_tags: formData
        });
        return response.data
    } catch (error) {
        console.error("Error:", error);
    }
}

async function Delete(userId) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/users/${userId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Delete error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function GetSpots(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/spots/${userId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetSpots error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function GetSpotById(spotId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/spots/${spotId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetSpotById error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function GetEvents(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/events/${userId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetEvents error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

// GetEvents("732ab3ae-4ed9-4f75-a411-301f9312574e").then(data => console.log(data))

async function GetEventById(eventId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/events/${eventId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetEventById error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function GetUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/api/users`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetUsers error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function GetUserById(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/users/${userId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetUserById error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function GetFriends(userId) {
    try {
        const response = await axios.get(`${BASE_URL}/api/friends/${userId}`);
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("GetFriends error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

// GetFriends("a39bd12d-756c-48ea-8d79-9b378d05400c").then((data) => console.log(data))

async function AddFriend(userId, friendName) {
    try {
        const response = await axios.post(`${BASE_URL}/api/friends/${userId}`, {
            friend_name: friendName
        });
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("AddFriend error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

// AddFriend("e1a94fb5-239d-4498-b115-fd64dd9ddb3b", "Bot_9").then((data) => console.log(data));

async function addToHistory(userId, spotId) {
    try {
        const response = await axios.post(`${BASE_URL}/api/travel/${userId}`, {
            spot_id: spotId
        });
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Add to travel history error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function addSpotToList(userId, spotId) {
    try {
        const response = await axios.post(`${BASE_URL}/api/savets/${userId}`, {
            spot_id: spotId
        });
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Add to list error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function addEventToList(userId, eventId) {
    try {
        const response = await axios.post(`${BASE_URL}/api/savee/${userId}`, {
            event_id: eventId
        });
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Add to list error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

async function Friends(interests) {
    try {
        const response = await axios.post(`${BASE_URL}/api/compare`, {
            interest_tags: interests
        });
        return response.data; // Ensure the response data is returned
    } catch (error) {
        console.error("Friends error:", error);
        throw error; // Throw the error to handle it in the calling function
    }
}

// Friends([
//         "Beach",
//         "Adventure",
//         "Culture",
//         "Nightlife",
//         "Cuisine"
//       ]).then((data) => console.log(data));

module.exports = {
    Connect,
    Login,
    Register,
    Delete,
    GetSpots,
    GetSpotById,
    GetEvents,
    GetEventById,
    GetUsers,
    GetUserById,
    addToHistory,
    addSpotToList,
    addEventToList,
    GetFriends,
    AddFriend,
    Interests,
    Friends
}