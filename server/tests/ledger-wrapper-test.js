const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const LedgerWrapper = require('../utils/LedgerWrapper');

describe('LedgerWrapper', function() {
    beforeEach(function() {
        this.ledger = new LedgerWrapper();
    });

    afterEach(function() {
        this.ledger = null;
    });

    it('should be empty if options object is empty', function() {
        expect(this.ledger.commandLine.join(' ')).to.equal('');
    });

    it('should be properly initialized with valid options object', function() {
        const options = {
            file: 'ledger.txt',
            reportType: 'register',
            reportCurrency: 'руб',

        }
        this.ledger.setOptions(options);
        expect(this.ledger.commandLine.join(' ')).to.equal('-f ledger.txt register -X руб');
    });

});