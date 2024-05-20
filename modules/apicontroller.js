const Bookingrouter = require('express').Router();
const fs = require('node:fs/promises');
//const path = require('path');
const rooms = require('../Files/room.json');
const bookedroom = require('../Files/roombooking.json');
let roomIdCounter = rooms.length;
let bookingIdCounter = bookedroom.length;
const BookingDate= new Date().toLocaleDateString();
// Create a Room
Bookingrouter.post("/createRoom", async function (req, res) {
    const newRoom = req.body;
    newRoom.Roomid = ++roomIdCounter;
    rooms.push(newRoom);
    fs.writeFile(`./Files/room.json`, JSON.stringify(rooms), 'utf8').then((d) => {
        res.send({
            sucess: true,
            message: "Room Created Succesfully"
        })
    }).catch((e) => {
        res.send({
            sucess: false,
            error: e.message,
            message: "Room Creation failed"
        })
    })

})

// Booking a Room
Bookingrouter.post("/bookRoom", async function (req, res) {
    const bookRoom = req.body;
    const Room_id = bookRoom.RoomID;
    console.log(Room_id)
    if (Room_id) {
        const RoomDetails = rooms.find(room => room.Roomid == +Room_id);
        bookRoom.RoomName = RoomDetails.RoomName;
        bookRoom.BookingDate=BookingDate;
        bookRoom.BookedStatus = "Booked";
        bookRoom.Bookingid = ++bookingIdCounter;
        bookedroom.push(bookRoom);
        if (bookRoom.CustomerName) {
            fs.writeFile(`./Files/roombooking.json`, JSON.stringify(bookedroom), 'utf8').then((d) => {
                res.send({
                    sucess: true,
                    message: "Room Booked Succesfully"
                })
            }).catch((e) => {
                res.send({
                    sucess: false,
                    error: e.message,
                    message: "Room Booking failed"
                })
            })
        }
        else {
            res.send({
                sucess: false,
                message: "Room & Customer Details Not Found"
            })
        }
    }
    else {
        res.send({
            sucess: false,
            message: "Room Details Not Found"
        })
    }
})

//List all Rooms with booked data
Bookingrouter.get("/BookedRoomDetails", async function (req, res){
   const BookedRoomDetails= bookedroom.map(({ RoomName, BookedStatus, CustomerName, Date, StartTime,EndTime }) => ({ RoomName, BookedStatus, CustomerName, Date, StartTime,EndTime }));
if(BookedRoomDetails){
    BookedRoomDetails.sort((a, b) => a.RoomName.localeCompare(b.RoomName));
    res.send({
        sucess: true,
        data:BookedRoomDetails,
    })
}
else{
    res.send({
        sucess: false,
        message: "Details Not Found"
    })
}
})

//List all Customers with booked data with
Bookingrouter.get("/BookedCustomerDetails", async function (req, res){
    const BookedCustomerDetails= bookedroom.map(({ CustomerName, RoomName, Date, StartTime,EndTime }) => ({ CustomerName, RoomName, Date, StartTime,EndTime }));
 if(BookedCustomerDetails){
    BookedCustomerDetails.sort((a, b) => a.CustomerName.localeCompare(b.CustomerName));
     res.send({
         sucess: true,
         data:BookedCustomerDetails,
     })
 }
 else{
     res.send({
         sucess: false,
         message: "Details Not Found"
     })
 }
 })

 //List how many times a customer has booked the room with below details
Bookingrouter.get("/CustomerwithBookingDetails", async function (req, res){
    const BookedCustomerDetails= bookedroom.map(({ CustomerName, RoomName, Date, StartTime,EndTime, Bookingid, BookingDate, BookedStatus }) => ({ CustomerName, RoomName, Date, StartTime,EndTime, Bookingid, BookingDate, BookedStatus }));
 if(BookedCustomerDetails){
    BookedCustomerDetails.sort((a, b) => a.CustomerName.localeCompare(b.CustomerName));
     res.send({
         sucess: true,
         data:BookedCustomerDetails,
     })
 }
 else{
     res.send({
         sucess: false,
         message: "Details Not Found"
     })
 }
 })

module.exports = Bookingrouter;