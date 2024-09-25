import express from "express";
import { getHello } from "@api/controller/hello.controller.js";
const router = express.Router();

/* GET users listing. */
router.get('/', getHello);

export default router