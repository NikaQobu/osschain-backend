tatum_api_key = "t-6677f34a032c93001c8310f3-4d565a5ad9bd4ca6b26e2315"
tatum_api_subscription_url = "https://api.tatum.io/v4/subscription"
tatum_webhook_url = 'https://hidden-slice-426318-j1.ey.r.appspot.com/tatum_webhook'
api_tatum_header = {
            "x-api-key": tatum_api_key,
            "Content-Type": "application/json"
        }


ankr_url = "https://rpc.ankr.com/multichain/7c04546f9e5deb096fabd4dbd2ead007b2de8921941d68cf12c7449ec8af01a8"

ankr_request_header ={
    "accept": "application/json",
    "content-type": "application/json"
}

ERC20_ABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

ERC721_ABI = [
    {
        "constant": False,
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "tokenId", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"name": "", "type": "address"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getApproved",
        "outputs": [{"name": "", "type": "address"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    }
]

ERC1155_ABI = [
    {
        "constant": False,
        "inputs": [
            { "name": "from", "type": "address" },
            { "name": "to", "type": "address" },
            { "name": "id", "type": "uint256" },
            { "name": "amount", "type": "uint256" },
            { "name": "data", "type": "bytes" }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            { "name": "from", "type": "address" },
            { "name": "to", "type": "address" },
            { "name": "ids", "type": "uint256[]" },
            { "name": "amounts", "type": "uint256[]" },
            { "name": "data", "type": "bytes" }
        ],
        "name": "safeBatchTransferFrom",
        "outputs": [],
        "payable": False,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": False,
        "inputs": [
            { "indexed": True, "name": "operator", "type": "address" },
            { "indexed": True, "name": "from", "type": "address" },
            { "indexed": True, "name": "to", "type": "address" },
            { "indexed": False, "name": "id", "type": "uint256" },
            { "indexed": False, "name": "value", "type": "uint256" }
        ],
        "name": "TransferSingle",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            { "indexed": True, "name": "operator", "type": "address" },
            { "indexed": True, "name": "from", "type": "address" },
            { "indexed": True, "name": "to", "type": "address" },
            { "indexed": False, "name": "ids", "type": "uint256[]" },
            { "indexed": False, "name": "values", "type": "uint256[]" }
        ],
        "name": "TransferBatch",
        "type": "event"
    }
]

rpc_urls = {
  "polygon": "https://rpc.ankr.com/polygon/7c04546f9e5deb096fabd4dbd2ead007b2de8921941d68cf12c7449ec8af01a8",
  "btc": "https://bsc-mainnet.gateway.tatum.io",
  "ethereum": "https://rpc.ankr.com/eth/7c04546f9e5deb096fabd4dbd2ead007b2de8921941d68cf12c7449ec8af01a8",
  "solana": "https://02-dallas-054-01.rpc.tatum.io",
  "bsc": "https://rpc.ankr.com/bsc/7c04546f9e5deb096fabd4dbd2ead007b2de8921941d68cf12c7449ec8af01a8",
  "avalanche": "https://01-hillsboro-033-01.rpc.tatum.io/ext/bc/C/rpc",
  "polygon_zkevm": "",
  "optimism": "https://01-vinthill-029-01.rpc.tatum.io"
}


def get_blockchain_rpc_node(blockchain):
    current_url = rpc_urls[blockchain]
    if current_url:
        return current_url
    else:
        return "non supported blockchain"




    