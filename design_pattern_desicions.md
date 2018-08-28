# Design Pattern Decisions

1. MarketPlace implemented with a Factory design pattern. This will ensure that every Store deployed using the factory adheres to a certain standard.

2. OpenZeppelins-solidity SafeMath library implemented as a base type for uint256 to cover from overflow and underflow.
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol  

3. OpenZeppelins-solidity Pausable contract implemented as an circuit breaker pattern.
https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol  

4. Use modifiers for restricting access.

5. Functional Testing over solidity testing, to cover more test cases and limit conditions.

6. Use fail early and fail loud pattern to reduce unnecessary code execution if an exception is thrown.

7. Use OpenZeppelins-solidity Destructible contract as a Mortal design pattern in case the store owners wants to eliminate the store and get all funds.
