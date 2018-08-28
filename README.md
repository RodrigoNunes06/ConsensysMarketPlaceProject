# Market Place

Create an online marketplace that operates on the blockchain.

There are a list of stores on a central marketplace where shoppers can purchase goods posted by the store owner.

The central marketplace is managed by a group of administrators. Admins allow store owners to add stores to the marketplace. Store owners can manage their store’s inventory and funds. Shoppers can visit stores and purchase goods that are in stock using cryptocurrency.


## What it does

Satisfies the following:

1. Identification.  
2. Market Place functionality for admins, owners y shoppers.
3. Allow admins to add new admins and new store owners.
4. Allow store owners to create stores and manage products.
5. Allow shoppers to view stores and buy products.  


### Contracts on the project:

1. StoreFactory.sol - Provide Market Place funcionality and Stores generation.
2. Store.sol - Store functionality.
3. Destructible.sol - Destroys Store contract and sends all ether to the store owner.
4. Pausable.sol - Allowing an emergency stop pattern.
5. SafeMath.sol - Library, allowing protection against overflows and underflows in store.


## Getting Started

These prerequisites and repository files should allow a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Truffle install - https://github.com/trufflesuite/truffle

Truffle should be installed properly on your machine.   See the above link for how to do this.

2. install Ganache - https://github.com/trufflesuite/ganache-cli

Ganache-cli should be installed properly on your machine.  See the above link for how to do this.  The GUI Ganache is recommended.

3. Project files (this git collection) in a local directory.

Unzip/Clone the Repository to a local directory

4. MetaMask install - https://metamask.io/

Install MetaMask. See above link for how to do this.

### Installing

1. Copy files to marketplace Directory

2. run npm install to install all dependencies

```
npm install
```

3. Open Ganache GUI

3. Set Up MetaMask for project -
    import with seed phrase from Ganache GUI
    1. change the network to Private Network, set Url to HTTP://127.0.0.1:7545
    2. This will set account[0].
    3. Ganache comes with several accounts, you can add them by importing the private keys provided by Ganache GUI.

4. Compile truffle
Compile the project from the directory where the files are located.

```
truffle compile
```

5. Migrate
Migrate the project to the blockchain.
```
truffle migrate
```

6. Tests
A series of javascript tests for the contract files, testing basic contract functionality.

```
truffle test
```

5. Run Development Web Server for project.
Run the following command in the directory where you compiled the package from.

```
npm run start
```


## Tests

## Built With

* [Truffle Suite](https://truffleframework.com) - Truffle Suite Framework.
* [ganache-cli](https://github.com/trufflesuite/ganache-cli) - Ganache-cli (command line)
* [truffle react box](https://github.com/truffle-box/react-box) - Web app base.
* [OpenZeppelin-Solidity](https://github.com/OpenZeppelin/openzeppelin-solidity) (Pausable.sol, Destructible.sol, SafeMath.sol)

## Author
Rodrigo Nunes
