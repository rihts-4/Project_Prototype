/*
THIS IS A SERVICE FILE FOR HANDLING API REQUESTS
This file is for interacting with the flask API
This file is for the frontend to use
*/

const axios = require('axios');

async function Login(usename, password) {
    try {
        await axios.post("http://localhost:8000/api/login", {
            username: usename,
            password: password
        }).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("Login error:", error);
    }
}

// Login("adventure_alex", "hashed_password_123")

async function Register(username, password) {
    try {
        await axios.post("http://localhost:8000/api/register", {
            username: username,
            password: password
        }).then(response => {
            console.log(response.data);
            return response.data;
        });
    } catch (error) {
        console.error("Registration error:", error);
    }
    return null;
}

// Register("adventure_alexis_sanchez", "hashed_password_123");

async function Delete(userId) {
    try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`)
            .then(response => {
                console.log(response.data);
                return response.data;
            });
    }
    catch (error) {
        console.error("Delete error:", error);
    }
}

// Delete("e98bce97-e1ed-484a-bf87-5b13a0782295")

async function GetSpots() {
    try {
        await axios.get("http://localhost:8000/api/spots").then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("GetSpots error:", error);
    }
}

// GetSpots()

async function GetSpotById(spotId) {
    try {
        await axios.get(`http://localhost:8000/api/spots/${spotId}`).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("GetSpotById error:", error);
    }
}

// GetSpotById("spot_008")

async function GetEvents() {
    try {
        await axios.get("http://localhost:8000/api/events").then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("GetEvents error:", error);
    }
}

// GetEvents()

async function GetEventById(eventId) {
    try {
        await axios.get(`http://localhost:8000/api/events/${eventId}`).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("GetEventById error:", error);
    }
}

// GetEventById("evt_010")

async function GetUsers() {
    try {
        await axios.get("http://localhost:8000/api/users").then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("GetUsers error:", error);
    }
}

// GetUsers()

async function GetUserById(userId) {
    try {
        await axios.get(`http://localhost:8000/api/users/${userId}`).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("GetUserById error:", error);
    }
}

// GetUserById("79462ee4-0e8a-4c79-aaee-f0b8c7df2f12")

async function addToHistory(userId, spotId) {
    try {
        await axios.post(`http://localhost:8000/api/travel/${userId}`, {
            spot_id: spotId
        }).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("Add to travel history error:", error);
    }
}

// addToHistory("a49ab4f3-f0ba-4b6e-9cce-17333c287071", "spot_008");

async function addSpotToList(userId, spotId) {
    try {
        await axios.post(`http://localhost:8000/api/savets/${userId}`, {
            spot_id: spotId
        }).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("Add to list error:", error);
    }
}

// addSpotToList("a49ab4f3-f0ba-4b6e-9cce-17333c287071", "spot_008");

async function addEventToList(userId, eventId) {
    try {
        await axios.post(`http://localhost:8000/api/savee/${userId}`, {
            event_id: eventId
        }).then(response => {
            console.log(response.data);
            return response.data;
        })
    } catch (error) {
        console.error("Add to list error:", error);
    }
}

// addEventToList("a49ab4f3-f0ba-4b6e-9cce-17333c287071", "evt_010");

module.exports = {
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
    addEventToList
}