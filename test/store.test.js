var Store = artifacts.require("./Store.sol");

contract('Store', function(accounts) {

  const owner = accounts[0]
  const shopper = accounts[1]
  const storeName = 'TestStore'
  let storeConstractInstance = null

  //Setup the Store contract with a owner and a name
  before('setup contract for test', async() => {
    storeContractInstance = await Store.new(owner, storeName)
  })

  //Checks that the name is the one given
  it('store name should be TestStore', async() => {
    let storeName = await storeContractInstance.getStoreName.call({from: owner})

    assert.equal(web3.toUtf8(storeName), 'TestStore', 'Store name is not TestStore')
  })

  //Test Core functionality, Add a new product
  it('should add a new product with id 1, name Carrot, price 15 and stock 10', async() => {
    const id = 1
    const name = 'Carrot'
    const price = web3.toWei(15, 'ether')
    const stock = 10

    await storeContractInstance.addNewProduct(id, name, price, stock, { from: owner })
    const NewProductAdded = await storeContractInstance.NewProductAdded()

    const log = await new Promise(function(resolve, reject) {
        NewProductAdded.watch(function(error, log){ resolve(log);});
    });
    const productId = log.args.productId.toNumber()
    const product = await storeContractInstance.getProduct(productId, {from: owner})
    const productName = web3.toUtf8(product[0])
    const productPrice = product[1]
    const productStock = product[2]

    assert.equal(productId, id, "Incorrect Product id")
    assert.equal(productName, name, "Incorrect Product name")
    assert.equal(productPrice, price, "Incorrect Product price")
    assert.equal(productStock, stock, "Incorrect Product stock")
  })

  //Test Core functionality add more stock to a certain product
  it('should add 5 more items to Carrot stock, carrot stock should be 15', async() => {
    const productId = 1
    const carrotsToAdd = 5
    const finalCarrotsAmount = 15
    await storeContractInstance.addProductStock(productId, carrotsToAdd, { from: owner })
    const ProductQuantityAdded = await storeContractInstance.ProductQuantityAdded()

    const log = await new Promise(function(resolve, reject) {
        ProductQuantityAdded.watch(function(error, log){ resolve(log) })
    })
    const productStock = log.args.remainingStock.toNumber()

    assert.equal(productStock, finalCarrotsAmount, 'Incorrect Product stock')
  })

  //Test Core functionality remove stock from a product
  it('should remove 10 carrot from stock, carrot stock should be 5', async() => {
    const remainingCarrots = 5

    await storeContractInstance.removeProduct(1, 10, { from: owner })
    const ProductRemoved = await storeContractInstance.ProductRemoved()

    const log = await new Promise(function(resolve, reject) {
        ProductRemoved.watch(function(error, log){ resolve(log) })
    })
    const productStock = log.args.remainingStock.toNumber()

    assert.equal(productStock, remainingCarrots, 'Incorrect Product stock')
  })

  //Test Check availability of a product and quantity before pruchasing it
  it('should notify that a product stock is unavailable', async() => {
    await storeContractInstance.checkProductAvailability(1, 10, { from: owner })

    const ProductQuantityAvailable = storeContractInstance.ProductQuantityAvailable()
    const log = await new Promise(function(resolve, reject) {
        ProductQuantityAvailable.watch(function(error, log){ resolve(log) })
    })
    const isAvailable = log.args.available

    assert.equal(isAvailable, false, 'Product stock is available')
  })

  //Test Buy a product, it will succeed as long as there is enough stock
  it('should buy 5 units of carrot and balance should be added to store', async() => {
    const productId = 1
    const carrotAmount = 5
    const carrotPrice = web3.toWei(15, 'ether')
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

  //Test Owner withdraw amount, as long as Store has enough balance it should succeed
  it('should withdraw ether correctly', async() => {
    //Owner Balance before transaction
    const ownerBalanceBefore = web3.fromWei(web3.eth.getBalance(owner).toNumber())
    const amountToWithdraw = web3.toBigNumber(web3.toWei(75, 'ether'))
    const transaction = await storeContractInstance.withdrawAmount(amountToWithdraw, {from: owner})

    //Get gasCost
    const gasUsed = web3.eth.getTransactionReceipt(transaction['tx']).gasUsed
    const gasPrice = web3.eth.getTransaction(transaction['tx']).gasPrice
    const gasCost = web3.fromWei((gasUsed * gasPrice))

    //Event
    const AmountWithdrawnCorrectly = storeContractInstance.AmountWithdrawnCorrectly()
    const log = await new Promise(function(resolve, reject) {
        AmountWithdrawnCorrectly.watch(function(error, log){ resolve(log) })
    });

    const ownerBalanceAfter = web3.fromWei(web3.eth.getBalance(owner).toNumber())

    const amount = web3.fromWei(log.args.withdrawAmount.toNumber())

    //fromWei method returns strings, have to append a '+' to add the values
    const expectedBalance = +amount + +ownerBalanceBefore - +gasCost

    assert.equal(expectedBalance, ownerBalanceAfter, 'Amount not withdrawn correctly')
  })

});
