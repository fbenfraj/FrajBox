pragma solidity ^0.5.0;

contract FrajBox {
    address public manager;
    string public name = "FrajBox";
    uint256 public fileCount = 0;
    mapping(uint256 => File) public files;

    // Struct
    struct File {
        uint256 fileId;
        string fileHash;
        uint256 fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint256 uploadTime;
        address payable uploader;
    }

    // Event
    event FileUploaded(
        uint256 fileId,
        string fileHash,
        uint256 fileSize,
        string fileType,
        string fileName,
        string fileDescription,
        uint256 uploadTime,
        address payable uploader
    );

    constructor() public {
        manager = msg.sender;
    }

    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        // Make sure you're the manager
        require(
            manager == msg.sender,
            "Only the manager is allowed to drop files."
        );
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);
        // Make sure file type exists
        require(bytes(_fileType).length > 0);
        // Make sure file description exists
        require(bytes(_fileDescription).length > 0);
        // Make sure file fileName exists
        require(bytes(_fileName).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));
        // Make sure file size is more than 0
        require(_fileSize > 0);

        // Add File to the contract
        fileCount++;
        files[fileCount] = File(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            now,
            msg.sender
        );

        // Trigger an event
        emit FileUploaded(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            now,
            msg.sender
        );
    }
}
