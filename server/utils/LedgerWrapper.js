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
    if(options != null) {
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
   * @return {Array} Command line arguments, properly escaped and quoted
   */
  get commandLine() {
    let cliArguments = []
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
      // TODO: Validate file path
      this.file = ['-f', options.file];
    }
    if (options.reportType != null) {
      // TODO: Validate reportType
      this.reportType = [options.reportType]
    }
    if (options.reportCurrency != null) {
      this.reportCurrency = ['-X', options.reportCurrency];
    }
  }
}

module.exports = LedgerWrapper;
