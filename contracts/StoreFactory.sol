pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';
import "./Store.sol";

/**
    @notice This contract implements a Store Factory that can interact with
    users. There can be several admins, several store owners and the rest of users are shoppers.
    @title StoreFactory
    @author Rodrigo Nunes
*/
contract StoreFactory is Pausable {

    /* Store Factory mappings */
    mapping(address => bool) private admins;
    mapping(address => bool) private storeOwners;
    mapping(address => address[]) private stores;

    /* All stores are registered here */
    address[] private allStores;

    /* Store factory events */
    event LogStoreCreated(address store, address storeOwner);

    /**
        @notice Default constructor
    */
    constructor() public {
        admins[msg.sender] = true;
    }

    /* Modifiers */
    modifier onlyOwner() {
        require(admins[msg.sender] == true);
        _;
    }

    modifier onlyStoreOwner() {
        require(storeOwners[msg.sender] == true);
        _;
    }


    /**
        @notice Get the actual user role
        @return user role bytes32
    */
    function getUserRole() public view returns (bytes32) {
        address sender = msg.sender;
        if (admins[sender] == true) {
          return "admin";
        }
        if (storeOwners[sender] == true) {
          return "storeOwner";
        }
        return "shopper";
    }

    /**
        @notice Add a new admin
        @param newAdmin New admin address
        @return success
    */
    function addAdmin(address newAdmin) public onlyOwner whenNotPaused returns (bool success){
        require(admins[newAdmin] == false);
        admins[newAdmin] = true;
        return true;
    }

    /**
        @notice Add a new store owner
        @param newStoreOwner New store owner address
        @return success
    */
    function addStoreOwner(address newStoreOwner) public onlyOwner whenNotPaused returns (bool success) {
        if (storeOwners[newStoreOwner] == false) {
            storeOwners[newStoreOwner] = true;
            return true;
        }
        return false;
    }

    /**
        @notice Create a new Store contract
        @param name New store name
        @return success
    */
    function createStore(bytes32 name) public onlyStoreOwner whenNotPaused returns (bool) {
        if (name.length != 0) {
          Store store = new Store(msg.sender, name);
          stores[msg.sender].push(store);
          allStores.push(store);
          emit LogStoreCreated(store, msg.sender);
          return true;
        }
        return false;
    }

    /**
        @notice Get created stores, if the sender is a store owner, returns his stores
        else returns all created Store contract addresses
        @return stores An array of Store contract addresses
    */
    function getStores() public view returns (address[] myStores) {
        if (storeOwners[msg.sender] == true) {
            return stores[msg.sender];
        } else {
            return allStores;
        }
    }

    /**
        @notice Payable fallback
    */
    function() public payable {

    }

}
