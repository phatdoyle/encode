pragma solidity >=0.7.0 <0.9.0;

interface IHelloWorld{
    function helloWorld() external returns(string memory);
    function setText(string calldata) external;
    function transferOwnership(address) external; 
    
}

contract HelloWorld is IHelloWorld {
    string private text;
    address public owner;

    constructor() {
        text = "Hello World";
        owner = msg.sender;
    }

    function helloWorld() public view override returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public  onlyOwner {
        text = newText;
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        owner = newOwner;
    }

    modifier onlyOwner()
    {
        require (msg.sender == owner, "Caller is not the owner");
        _;
    }


}