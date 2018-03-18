/* eslint-disable */
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const LedgerWrapper = require('../utils/LedgerWrapper');

describe('LedgerWrapper general tests', function() {
    beforeEach(function() {
        this.ledger = new LedgerWrapper();
        this.baseOptions = {
            file: 'sampleFile.txt',
            reportType: 'balance'
        };
    });

    afterEach(function() {
        this.ledger = null;
        this.baseOptions = null;
    });

    it('should be empty if options object is empty or invalid', function() {
        expect(this.ledger.commandLine.join(' ')).to.equal('');
        expect(this.ledger.isValid).to.false;
    });

    it('should overwrite options when setting new options object', function() {
        this.ledger.setOptions(this.baseOptions);
        expect(this.ledger.commandLine.join(' ')).to.equal('-f sampleFile.txt balance');

        this.ledger.setOptions({});
        expect(this.ledger.commandLine.join(' ')).to.equal('');
    });
    
    it('should make sure required options are set and valid', function() {
        const options = [null, {}, { 
            file: '',
            reportType: 'balance',
            msg: 'File name is not set'
        }, {
            reportType: 'balance',
            msg: 'File name is not set'
        }, {
            file: 'sample.txt',
            msg: 'Report type is not set'
        }, {
            file: 'sample.txt',
            reportType: 'unsupportedReport',
            msg: 'Report type is not supported'
        }];

        options.forEach(option => {
            this.ledger.setOptions(option);
            expect(this.ledger.isValid).to.false;
            let msg = (!option || !option.msg) ? 'Options object is null or empty' : option.msg;
            expect(this.ledger.errorMessage).to.equal(msg);
            expect(this.ledger.commandLine.join(' ')).to.equal('');
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
        this.ledger = new LedgerWrapper();
        this.baseOptions = {
            file: 'sampleFile.txt',
            reportType: 'balance'
        };
    });

    afterEach(function() {
        this.ledger = null;
        this.baseOptions = null;
    });

    it('should set up file argument or mark Wrapper as invalid', function() {
        const fileNames = ['ledger.txt', '/path/to/ledger.file', null];
        fileNames.forEach(fileName => {
            let expected = '-f ' + fileName;
            this.baseOptions.file = fileName;
            this.ledger.setOptions(this.baseOptions);
            if (fileName != null) {
                expect(this.ledger.isValid).to.true;
                expect(this.ledger.commandLine.join(' ').includes(expected)).to.true;
            } else {
                expect(this.ledger.isValid).to.false;
            }
        });
    });

    it('should set up report type of mark Wrapper as invalid', function() {
        const reportTypes = ['register', 'balance', null];
        reportTypes.forEach(reportType => {
            this.baseOptions.reportType = reportType;
            this.ledger.setOptions(this.baseOptions);
            if (reportType != null) {
                expect(this.ledger.isValid).to.true;
                expect(this.ledger.commandLine.includes(reportType)).to.true;
            } else {
                expect(this.ledger.isValid).to.false;
            }
        });
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