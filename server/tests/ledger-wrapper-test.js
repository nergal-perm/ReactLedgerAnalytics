/* eslint-disable */
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const LedgerWrapper = require('../utils/LedgerWrapper');

describe('LedgerWrapper general tests', function() {

    it('should be empty if options object is empty or invalid', function() {
        this.ledger = new LedgerWrapper(null, null);
        expect(this.ledger.commandLine.join(' ')).to.equal('');
        expect(this.ledger.isValid).to.false;
    });

    it('should overwrite options when setting new options object', function() {
        // TODO: implement test
    });
    
    it('should make sure required options are set and valid', function() {
        const ledgers = [
            /* invalid objects */
            { fileName: null, reportType: null, msg: 'File name is not set' },
            { fileName: null, reportType: 'balance', msg: 'File name is not set' },
            { fileName: 'sample.txt', reportType: null, msg: 'Report type is not set' },
            { 
                fileName: 'sample.txt', 
                reportType: 'unsupportedReport', 
                msg: 'Report type is not supported' 
            },
            /* valid objects */
            { fileName: 'sample.txt', reportType: 'balance' },
            { fileName: '/path/to/ledger.file', reportType: 'balance' },
            { fileName: 'sample.txt', reportType: 'register' },
            { fileName: '/path/to/ledger.file', reportType: 'register' },
        ]

        ledgers.forEach(function(item) {
            ledger = new LedgerWrapper(item.fileName, item.reportType);
            if (item.msg) {
                expect(ledger.isValid).to.false;
                expect(ledger.errorMessage).to.equal(item.msg);
                expect(ledger.commandLine.join(' ')).to.equal('');
            } else {
                expect(ledger.isValid).to.true;
                expectedFileName = '-f ' + item.fileName;
                expect(ledger.commandLine.join(' ').includes(expectedFileName)).to.true;
                expect(ledger.commandLine.includes(item.reportType)).to.true;
            }
        });
    });

    it('should validate report types', function() {
        const validReportTypes = ['register', 'balance'];
        validReportTypes.forEach(reportType => {
            expect(LedgerWrapper.validateReportType(reportType)).to.true;
        });

        const invalidReportTypes = ['report', 'general'];
        invalidReportTypes.forEach(reportType => {
            expect(LedgerWrapper.validateReportType(reportType)).to.false;
        });
    });
});

describe('LedgerWrapper specific arguments', function() {
    beforeEach(function() {
        this.ledger = new LedgerWrapper('sampleFile.txt', 'balance');
        this.baseOptions = {};
    });

    afterEach(function() {
        this.ledger = null;
        this.baseOptions = null;
    });

    it('should set up report currency', function() {
        const currencies = [null, 'USD', 'руб'];
        currencies.forEach(currency => {
            let expected = '-X ' + (currency == null ? '' : currency);
            this.baseOptions.reportCurrency = currency;
            this.ledger.setOptions(this.baseOptions);
            if (currency == null) {
                expect(this.ledger.commandLine.join(' ').includes(expected.trim())).to.false;
            } else {
                expect(this.ledger.commandLine.join(' ').includes(expected)).to.true;
            }
        });
    });

    it('should set up total-data option', function() {
        const totalDataValues = [true, false];
        totalDataValues.forEach(totalDataValue => {
            this.baseOptions.totalData = totalDataValue;
            this.ledger.setOptions(this.baseOptions);
            expect(this.ledger.commandLine.join(' ').includes('-J')).to.equal(totalDataValue);
        });
    });

    it('should set up periodical grouping', function() {
        const periods = [null, 
            {periodType: 'day', expected: '--daily'}, 
            {periodType: 'week', expected: '--weekly'},
            {periodType: 'month', expected: '--monthly'}, 
            {periodType: 'quarter', expected: '--quarterly'},
            {periodType: 'year', expected: '--yearly'}];
        periods.forEach(period => {
            if (period) {
                this.baseOptions.groupPeriod = period.periodType;    
            }
            this.ledger.setOptions(this.baseOptions);
            if (!period) {
                const doNotExpect = ['-D', '--daily', '-W', '--weekly', 
                    '-M', '--monthly', '-Q', '--quarterly', '-Y', '--yearly'];
                
                // Nice way to check if one array contains another array's elements
                // https://stackoverflow.com/a/25926600 (see comments)
                expect(doNotExpect.some(v=> this.ledger.commandLine.includes(v))).
                    to.false;
            } else {
                expect(this.ledger.commandLine.includes(period.expected)).to.true;
            }
        });
    });

    it('should set up reverse date order', function() {
        const invertValues = [true, false];
        invertValues.forEach(invertValue => {
            this.baseOptions.inverse = invertValue;
            this.ledger.setOptions(this.baseOptions);
            expect(this.ledger.commandLine.join(' ').includes('--invert')).to.equal(invertValue);
        });        
    });

    it('should set up price type', function() {
        const priceTypes = [null, {type: 'balance', expected: "-B"}, 
            {type: 'market', expected: '-V'}, {type: 'volatile'}];
        priceTypes.forEach(priceType => {
            this.baseOptions.priceType = (priceType && priceType.type);
            this.ledger.setOptions(this.baseOptions);
            if(!priceType || priceType.type === 'volatile') {
                const doNotExpect = ['-V', '-B'];
                expect(doNotExpect.some(v => this.ledger.commandLine.includes(v))).
                    to.false;
            } else {
                expect(this.ledger.commandLine.join(' ').includes(priceType.expected)).
                    to.true;
            }
            
        });
    })
});