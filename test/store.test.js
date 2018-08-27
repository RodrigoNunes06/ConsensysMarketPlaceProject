var Store = artifacts.require("./Store.sol");

contract('Store', function(accounts) {

  const owner = accounts[0]
  const shopper = accounts[1]
  const storeName = 'TestStore'
  let storeConstractInstance = null

  before('setup contract for test', async() => {
    storeContractInstance = await Store.new(owner, storeName)
  })

  it('store name should be TestStore', async() => {
    let storeName = await storeContractInstance.getStoreName.call({from: owner})

    assert.equal(web3.toUtf8(storeName), 'TestStore', 'Store name is not TestStore')
  })

  it('should add a new product with id 1, name Carrot, price 15 and stock 10', async() => {
    await storeContractInstance.addNewProduct(1,'Carrot',15, 10, { from: owner })
    const NewProductAdded = await storeContractInstance.NewProductAdded()

    const log = await new Promise(function(resolve, reject) {
        NewProductAdded.watch(function(error, log){ resolve(log);});
    });
    const productId = log.args.productId.toNumber()
    const product = await storeContractInstance.getProduct(productId, {from: owner})
    const productName = web3.toUtf8(product[0])
    const productPrice = product[1]
    const productStock = product[2]

    assert.equal(productId, 1, "Incorrect Product id")
    assert.equal(productName, 'Carrot', "Incorrect Product name")
    assert.equal(productPrice, 15, "Incorrect Product price")
    assert.equal(productStock, 10, "Incorrect Product stock")
  })

  it('should add 5 more items to Carrot stock, carrot stock should be 15', async() => {
    await storeContractInstance.addProductStock(1, 5, { from: owner })
    const ProductQuantityAdded = await storeContractInstance.ProductQuantityAdded()

    const log = await new Promise(function(resolve, reject) {
        ProductQuantityAdded.watch(function(error, log){ resolve(log) })
    })
    const productStock = log.args.remainingStock.toNumber()

    assert.equal(productStock, 15, 'Incorrect Product stock')
  })

  it('should remove 10 carrot from stock, carrot stock should be 5', async() => {
    await storeContractInstance.removeProduct(1, 10, { from: owner })
    const ProductRemoved = await storeContractInstance.ProductRemoved()

    const log = await new Promise(function(resolve, reject) {
        ProductRemoved.watch(function(error, log){ resolve(log) })
    })
    const productStock = log.args.remainingStock.toNumber()

    assert.equal(productStock, 5, 'Incorrect Product stock')
  })

  it('should notify that a product stock is unavailable', async() => {
    await storeContractInstance.checkProductAvailability(1, 10, { from: owner })

    const ProductQuantityAvailable = storeContractInstance.ProductQuantityAvailable()
    const log = await new Promise(function(resolve, reject) {
        ProductQuantityAvailable.watch(function(error, log){ resolve(log) })
    })
    const isAvailable = log.args.available

    assert.equal(isAvailable, false, 'Product stock is available')
  })

  it('should buy 5 units of carrot and balance should be added to store', async() => {
    const productId = 1
    const carrotAmount = 5
    const carrotPrice = 15
    const totalCost = carrotAmount * carrotPrice

    await storeContractInstance.buyProduct(productId, carrotAmount, { from: shopper, value: web3.toBigNumber(totalCost) })

    const ProductPurchaseSuccessful = storeContractInstance.ProductPurchaseSuccessful()
    const log = await new Promise(function(resolve, reject) {
        ProductPurchaseSuccessful.watch(function(error, log){ resolve(log) })
    });
    const remainingStock = log.args.remainingStock.toNumber()
    const storeBalance = await storeContractInstance.getStoreBalance({from: owner})

    assert.equal(remainingStock, 0, 'Product not bought correctly')
    assert.equal(storeBalance.toNumber(), totalCost, 'Balance did not change')
  })

});
