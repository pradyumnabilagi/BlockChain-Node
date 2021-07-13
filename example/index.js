
require("dotenv").config()
const {upload, getfiles}= require("blockchain-without-ipfs")

getfiles("a", 10,"retrievedfiles/");

