import express from "express";

const coreMiddleware = [express.json(), express.urlencoded({ extended: true })];

export default coreMiddleware;
