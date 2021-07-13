// module.exports = {
//     blockchainRpcUrl : "http://localhost:8546",
//     contractAddress : "0x8e537258e2ea75E5a46854787d8A47949CcA2E7E"
// }

module.exports = {
    blockchainRpcUrl : process.env.BLOCKCHAIN_RPC_URL,
    contractAddress : process.env.CONTRACT_ADDRESS
}
