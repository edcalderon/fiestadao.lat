// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SampleContract {
    string public message;
    address public owner;

    event MessageUpdated(string newMessage, address updatedBy);

    constructor(string memory _initialMessage) {
        message = _initialMessage;
        owner = msg.sender;
    }

    function updateMessage(string memory _newMessage) public {
        message = _newMessage;
        emit MessageUpdated(_newMessage, msg.sender);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}