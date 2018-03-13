const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const LedgerWrapper = require('../utils/LedgerWrapper');

describe('LedgerWrapper', function() {
    beforeEach(function() {
        this.ledger = new LedgerWrapper();
        
        // stubbing getBalance() method because it's going to make I/O calls
        this.getBalanceStub = sinon.stub(this.ledger, 'getBalance');
        this.getBalanceStub.returns(10);
    });

    afterEach(function() {
        this.getBalanceStub.restore();
        this.ledger = null;
    });

    it('should be properly initialized', function() {
        expect(this.ledger.getDescription()).to.equal("Hello");
    });

    it('should return balance (mocked)', function() {
        expect(this.getBalanceStub()).to.equal(10);
    })
});