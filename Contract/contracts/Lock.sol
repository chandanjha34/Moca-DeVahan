// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleVehicleNFT is ERC721 {
    // auto-incrementing token counter
    uint256 public tokenCounter;

    // tokenId => tokenURI
    mapping(uint256 => string) private _tokenURIs;
    
    mapping(uint256 => string) private MetadatahashCollector;

    // tokenId => array of JSON service records (opaque strings, e.g., IPFS JSON or raw JSON)
    mapping(uint256 => string[]) private _serviceRecords;

    event ServiceRecordAdded(uint256 indexed tokenId, string json);

    constructor() ERC721("Vehicle Passport", "VPASS") {}

    function mint(address to, string memory tokenURI_,string memory metadatahash) external returns (uint256) {
        uint256 tokenId = tokenCounter;
        tokenCounter += 1;
        MetadatahashCollector[tokenId]=metadatahash;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        return tokenId;
    }

    // Add a JSON record (e.g., IPFS CID JSON, or inline JSON string)
    function addServiceRecord(uint256 tokenId, string memory json) external {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        require(bytes(json).length > 0, "Empty JSON");
        _serviceRecords[tokenId].push(json);
        emit ServiceRecordAdded(tokenId, json);
    }

    // Read functions
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    function getServiceRecordCount(uint256 tokenId) external view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _serviceRecords[tokenId].length;
    }

    function getServiceRecordAt(uint256 tokenId, uint256 index) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        require(index < _serviceRecords[tokenId].length, "Index out of bounds");
        return _serviceRecords[tokenId][index];
    }

    // Internal setter mirroring typical URI storage approach
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        _tokenURIs[tokenId] = uri;
    }
}
