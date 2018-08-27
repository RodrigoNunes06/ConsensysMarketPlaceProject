var StoreFactory = artifacts.require("./StoreFactory.sol");
var Store = artifacts.require("./Store.sol");

contract('StoreFactory', function(accounts) {

  const admin = accounts[0]
  const Mike = accounts[1]
  const Peter = accounts[2]
  const Mary = accounts[3]
  const John = accounts[4]

  it("should add the Mike as admin.", function() {
    return StoreFactory.deployed().then(async (instance) => {
      storeFactoryInstance = instance;

      await storeFactoryInstance.addAdmin(Mike, {from: admin});
      const userRole = await storeFactoryInstance.getUserRole.call({from: Mike});

      assert.equal(web3.toUtf8(userRole), 'admin', "Mike was not added as admin.");
    });
  });

  it('should add Peter as store owner ', function() {
    return StoreFactory.deployed().then(async (instance) => {
      storeFactoryInstance = instance;

      await storeFactoryInstance.addStoreOwner(Peter, {from: admin});
      const userRole = await storeFactoryInstance.getUserRole.call({from: Peter});

      assert.equal(web3.toUtf8(userRole), 'storeOwner', "Peter was not added as store owner.")
    })
  })

  it('should recognize Mary as Shopper', function() {
    return StoreFactory.deployed().then( async (instance) => {
      storeFactoryInstance = instance;

      const userRole = await storeFactoryInstance.getUserRole.call({from: Mary});

      assert.equal(web3.toUtf8(userRole), 'shopper', "Mary was not recognized as shopper")
    })
  })

  it('should create a new store with name TestStore' , function() {
    return StoreFactory.deployed().then(async (instance) => {
      storeFactoryInstance = instance;

      await storeFactoryInstance.createStore('TestStore', {from: Peter});
      const stores = await storeFactoryInstance.getStores.call({from: Peter});
      const store = await Store.at(stores[0]);
      const storeName = await store.getStoreName.call({from: Peter});

      assert.equal(web3.toUtf8(storeName), 'TestStore', "TestStore not created correctly");
    })
  })

  it('Owner should see 4 stores', function() {
    return StoreFactory.deployed().then(async (instance) => {

      await storeFactoryInstance.createStore('TestStore1', {from: Peter});
      await storeFactoryInstance.createStore('TestStore2', {from: Peter});
      await storeFactoryInstance.createStore('TestStore3', {from: Peter});

      const stores = await storeFactoryInstance.getStores.call({from: Peter});

      assert.equal(stores.length, 4, "Stores not created correctly");
    })
  })

  it('Shopper should see Mikes 4 stores and John store, total 5 stores', function() {
    return StoreFactory.deployed().then(async (instance) => {
      await storeFactoryInstance.addStoreOwner(John, {from: admin});
      await storeFactoryInstance.createStore('Johns store', {from: John});

      const allStores = await storeFactoryInstance.getStores.call({from: Mary})

      assert.equal(allStores.length, 5, "Shopper couldn't see all stores");
    })
  })

});
