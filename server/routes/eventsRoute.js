import express from "express";
import {createEvent,joinEvent,deleteEvent,getEvents, getAllEvents} from "../controllers/eventsController.js"
import { protect } from "../middleware/authMiddelware.js";
const router=express.Router();



  router.post("/create-event",protect, createEvent);
  router.post("/join-event",protect,joinEvent);
  router.delete("/create-event",protect,deleteEvent);
  router.get("/create-event",protect,getEvents);
  router.get("/join-event",protect,getAllEvents);

  export default router;
  