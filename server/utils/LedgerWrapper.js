/**
 * Wrapper for the command-line utility `Ledger`.
 * Should be initialized with options object that
 * turns into command-line arguments
 */
class LedgerWrapper {
  /**
   * Create a wrapper object, parsing options object
   * @param {Object} options
   */
  constructor(options) {
    if (options != null) {
      this.parseOptions(options);
    }
  }

  /**
   * Updates current options with a new set
   * @param {Object} options
   */
  setOptions(options) {
    this.parseOptions(options);
  }

  /**
   * @return {Boolean} Whether all passed options were valid
   */
  get isValid() {
    return this.valid;
  }

  /**
   * @return {Array} Command line arguments, properly escaped and quoted
   */
  get commandLine() {
    const cliArguments = []
      .concat(this.file != null ? this.file : [])
      .concat(this.reportType != null ? this.reportType : [])
      .concat(this.reportCurrency != null ? this.reportCurrency : []);
    return cliArguments;
  }

  /**
   * Converts options into instance fields, properly escaping and
   * quoting those command line arguments
   * @param {Object} options
   */
  parseOptions(options) {
    if (options.file != null) {
      this.file = ['-f', options.file];
    } else {
      this.valid = false;
    }
    if (options.reportType != null &&
        LedgerWrapper.validateReportType(options.reportType)) {
      this.reportType = [options.reportType];
    } else {
      this.valid = false;
    }
    if (options.reportCurrency != null) {
      this.reportCurrency = ['-X', options.reportCurrency];
    }

    // should be at the very end
    if (this.valid !== false) {
      this.valid = true;
    }
  }

  /**
   * @return {Array} Valid report types
   */
  static validReportTypes() {
    return ['register', 'balance'];
  }

  /**
   * Checks if specified report type is supported by ledger-cli
   * @param {String} reportType
   * @return {Boolean} whether reportType is supported
   */
  static validateReportType(reportType) {
    return LedgerWrapper.validReportTypes().includes(reportType);
  }
}

module.exports = LedgerWrapper;
