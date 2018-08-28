# Avoiding Common Attacks

1. **Logic Bugs** - Javascript testing shows that basic functionality works.

2. **Failed Sends** - Fallback function implemented to revert all changes with revert().

3. **Re-entry** - Transfers of funds implementation make sure to don't call an external function until done all the internal work needed.

4. **Integer Arithmetic Overflow** - Use of SafeMath library to be prepare in case of overflows. Use of uint256 as base type.

5. **Poison Data** - Use of modifiers to limit access to the state.

6. **Exposed functions** -  Only one function exposed to shoppers allowing them to pay for a product.

7. **Exposed Secrets** - There are no secrets in this application.

8. **Denial of Service** - Only allow the admin to add new owners. Only allow onwers to create new stores.

9. **Miner Vulnerabilities** - Short term block timestamp is irrelevant to the application.

10. **Off Chain Safety** - Contract not depend of external services.

11. **Tx.Origin Problem** - No use of Tx.origin on the application.

12. **Solidity Function Signatures and Fallback Data Collisions** - Fallback implemented to revert() all changes.

13. **Incorrect use of Cryptography** - Contracts not use cryptography.

14. **Gas Limits** - No use of loops in the contracts. 
