pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';
/**
    @notice This contract implements a Store that can interact with
    users. There can be one owner and the rest of users are shoppers.
    @title Store
    @author Rodrigo Nunes
*/
contract Store is Destructible, Pausable {

    using SafeMath for uint;

    /* Store properties */
    address private owner;
    bytes32 private storeName;
    uint private balance;

    mapping(uint => Product) private products;
    uint private productCount;

    /* Store Events */
    event NewProductAdded(uint productId);
    event ProductQuantityAdded(uint productId, uint remainingStock);
    event ProductRemoved(uint productId, uint remainingStock );

    event ProductQuantityAvailable(uint productId, bool available);
    event ProductPurchaseSuccessful(uint productId, uint remainingStock);
    event ProductPurchaseFailed(uint productId, uint remainingStock);

    event AmountWithdrawnCorrectly(uint withdrawAmount, uint ownerBalance);
    /**
        @notice Every product has an id, a name, a price and a stock
    */
    struct Product {
        uint id;
        bytes32 name;
        uint price;
        uint stock;
    }

    /* Modifiers */
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    /**
        @notice Constructor
        @param _owner Owner address
        @param _storeName Store name
    */
    constructor(address _owner, bytes32 _storeName) public {
        owner = _owner;
        storeName = _storeName;
    }

    /**
        @notice Gets store name
        @return store name
    */
    function getStoreName() public view returns (bytes32) {
      return storeName;
    }

    /**
        @notice The store owner adds a new product
        @param id Product Id
        @param name Product name
        @param price Product price
        @param stock Product stock
        @return success
    */
    function addNewProduct(uint id, bytes32 name, uint price, uint stock) public onlyOwner whenNotPaused returns (bool success) {
        Product memory newProduct = Product(id, name, price, stock);
        if (isProductValid(newProduct)) {
            products[id] = newProduct;
            emit NewProductAdded(id);
            return true;
        }
        return false;
    }

    /**
        @notice The store owner adds a product stock
        @param id Product Id
        @param quantity Quantity to add
        @return success
    */
    function addProductStock(uint id, uint quantity) public onlyOwner whenNotPaused returns (bool success) {
        uint actualStock = products[id].stock;
        products[id].stock = actualStock.add(quantity);
        emit ProductQuantityAdded(id, products[id].stock);
        return true;
    }

    /**
        @notice The store owner removes a product quantity
        @param id Product Id
        @param quantity Quantity to remove
        @return success
    */
    function removeProduct(uint id, uint quantity) public onlyOwner whenNotPaused returns (bool success){
        Product memory productToRemove = products[id];
        uint actualStock = productToRemove.stock;
        if (productToRemove.id == id && actualStock >= quantity) {
            products[id].stock = actualStock.sub(quantity);
            emit ProductRemoved(id, products[id].stock);
            return true;
        }
        return false;
    }

    /**
        @notice Get a specific product information
        @param id Product Id
        @return (name, price, stock)
    */
    function getProduct(uint id) public view returns (bytes32 name, uint price, uint stock) {
        return (products[id].name,
                products[id].price,
                products[id].stock);
    }

    /**
        @notice Checks the availability of a certain product and quantity
        @param id Product Id
        @param quantity Quantity to check
        @return available
    */
    function checkProductAvailability(uint id, uint quantity) public whenNotPaused returns(bool) {
        if (quantity <= products[id].stock) {
            emit ProductQuantityAvailable(id, true);
            return true;
        }
        emit ProductQuantityAvailable(id, false);
        return false;
    }

    /**
        @notice Pays for a certain product amount
        @param id Product Id
        @param quantity Quantity to buy
        @return success
    */
    function buyProduct(uint id, uint quantity) public payable whenNotPaused returns (bool success) {
        Product memory productToBuy = products[id];
        uint totalPrice = productToBuy.price.mul(quantity);
        require(msg.value >= totalPrice && productToBuy.stock >= quantity);
        balance = balance.add(msg.value);
        products[id].stock = productToBuy.stock.sub(quantity);
        emit ProductPurchaseSuccessful(id, products[id].stock);
        return true;
    }

    /**
        @notice Checks if the product is valid
        @param product Product
        @return isValid
    */
    function isProductValid(Product product) private pure returns (bool isValid) {
        return (product.price > 0 && product.name != "");
    }

    /**
        @notice Checks the store balance
        @return isValid
    */
    function getStoreBalance() public onlyOwner view returns (uint) {
        return balance;
    }

    /**
        @notice Transfer amount to owner
        @param amount Ether amount
        @return owner balance
    */
    function withdrawAmount(uint amount) public payable onlyOwner returns (uint) {
        require(amount <= balance);
        balance = balance.sub(amount);
        owner.transfer(amount);
        emit AmountWithdrawnCorrectly(amount, owner.balance);
        return owner.balance;
    }

    // Fallback function - Called if other functions don't match call or
    // sent ether without data
    // Typically, called when invalid data is sent
    // Added so ether sent to this contract is reverted if the contract fails
    // otherwise, the sender's money is transferred to contract
    function() public payable {
        revert();
    }

}
