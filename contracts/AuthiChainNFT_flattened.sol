    uint256 private _tokenIdCounter;
    
    mapping(uint256 => string) private _productIds;
    mapping(string => uint256) private _idToToken;
    
    event ProductMinted(uint256 tokenId, string productId, address owner);
    
    constructor() ERC721("AuthiChain", "ACPT") Ownable(msg.sender) {}
    
    function mintProduct(address to, string memory productId) public onlyOwner returns (uint256) {
        require(_idToToken[productId] == 0, "Product exists");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(to, tokenId);
        _productIds[tokenId] = productId;
        _idToToken[productId] = tokenId;
        
        emit ProductMinted(tokenId, productId, to);
        return tokenId;
    }
    
    function getProductId(uint256 tokenId) public view returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token not found");
        return _productIds[tokenId];
    }
}
