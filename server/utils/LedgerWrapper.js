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
    this.clearCurrentOptions();
    this.parseOptions(options);
  }

  /**
   * Updates current options with a new set
   * @param {Object} options
   */
  setOptions(options) {
    this.clearCurrentOptions();
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
    const args = this.commandLineArgs;
    return []
      .concat(args.file != null ? args.file : [])
      .concat(args.reportType != null ? args.reportType : [])
      .concat(args.reportCurrency != null ? args.reportCurrency : [])
      .concat(args.totalData != null ? args.totalData : [])
      .concat(args.groupPeriod != null ? args.groupPeriod : []);
  }

  /**
   * Clears all the commandline options set for this instance
   */
  clearCurrentOptions() {
    this.commandLineArgs = {};
  }

  /**
   * Converts options into instance fields, properly escaping and
   * quoting those command line arguments
   * @param {Object} options
   */
  parseOptions(options) {
    const args = {};
    if (this.validateOptions(options)) {
      this.valid = true;

      /* Required parameters */
      if (options.file != null) {
        args.file = ['-f', options.file];
      } else {
        this.valid = false;
      }
      if (options.reportType != null &&
          LedgerWrapper.validateReportType(options.reportType)) {
        args.reportType = [options.reportType];
      } else {
        this.valid = false;
      }

      /* Optional parameters */
      if (options.reportCurrency != null) {
        args.reportCurrency = ['-X', options.reportCurrency];
      }
      if (options.totalData) {
        args.totalData = ['-J'];
      }
      if (options.groupPeriod) {
        if (options.groupPeriod === 'day') {
          args.groupPeriod = '--daily';
        } else {
          args.groupPeriod = `--${options.groupPeriod}ly`;
        }
      }
    }
    this.commandLineArgs = args;
  }

  validateOptions(options) {
    let errorMessage = '';
    let isValid = true;
    // because Object.keys(new Date()).length === 0;
    // we have to do some additional check
    // https://stackoverflow.com/a/32108184
    if (!options ||
      (Object.keys(options).length === 0 &&
      options.constructor === Object)) {
      errorMessage = 'Options object is null or empty';
      isValid = false;
    } else if (!options.file) {
      isValid = false;
      errorMessage = 'File name is not set';
    } else if (!options.reportType) {
      isValid = false;
      errorMessage = 'Report type is not set';
    } else if (!LedgerWrapper.validateReportType(options.reportType)) {
      isValid = false;
      errorMessage = 'Report type is not supported';
    }

    this.errorMessage = errorMessage;
    this.valid = isValid;
    return isValid;
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
