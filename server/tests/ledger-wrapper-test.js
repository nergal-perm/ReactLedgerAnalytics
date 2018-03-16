/* eslint-disable */
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const LedgerWrapper = require('../utils/LedgerWrapper');

describe('LedgerWrapper general tests', function() {
    beforeEach(function() {
        this.ledger = new LedgerWrapper();
    });

    afterEach(function() {
        this.ledger = null;
    });

    it('should be empty if options object is empty or invalid', function() {
        expect(this.ledger.commandLine.join(' ')).to.equal('');
        expect(this.ledger.isValid).to.false;
    });

    it('should overwrite options when setting new options object', function() {
        this.ledger.setOptions({
            file: 'testFile.txt',
            reportType: 'balance'
        });
        expect(this.ledger.commandLine.join(' ')).to.equal('-f testFile.txt balance');

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
    });

    afterEach(function() {
        this.ledger = null;
    });

    it('should set up file argument or mark Wrapper as invalid', function() {
        const fileNames = ['ledger.txt', '/path/to/ledger.file', null];
        fileNames.forEach(fileName => {
            let expected = '-f ' + fileName;
            this.ledger.setOptions({
                file: fileName,
                reportType: 'register'      // valid report type is not optional
            });
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
            this.ledger.setOptions({
                reportType: reportType,
                file: 'some_file'           // file name is not optional
            });
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
            this.ledger.setOptions({
                file: 'sample.txt',
                reportType: 'balance',
                reportCurrency: currency
            });
            if (currency == null) {
                expect(this.ledger.commandLine.join(' ').includes(expected.trim())).to.false;
            } else {
                expect(this.ledger.commandLine.join(' ').includes(expected)).to.true;
            }
        });
    });
});