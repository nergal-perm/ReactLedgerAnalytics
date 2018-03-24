/**
 * Wrapper for the command-line utility `Ledger`.
 * Should be initialized with options object that
 * turns into command-line arguments
 */
class LedgerWrapper {
  /**
   * Create a wrapper object, parsing options object
   * @param {string} fileName
   * @param {string} reportType
   */
  constructor(fileName, reportType) {
    this.commandLineArgs = {};
    this.errorMessage = '';
    if (this.validateOptions({ fileName, reportType })) {
      this.commandLineArgs.file = ['-f', fileName];
      this.commandLineArgs.reportType = [reportType];
    }
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
      .concat(args.groupPeriod != null ? args.groupPeriod : [])
      .concat(args.inverse != null ? args.inverse : [])
      .concat(args.priceType != null ? args.priceType : []);
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
    if (options.inverse) {
      args.inverse = ['--invert'];
    }
    if (options.priceType && LedgerWrapper.validatePriceType(options.priceType)) {
      if (options.priceType === 'balance') {
        args.priceType = ['-B'];
      }
      if (options.priceType === 'market') {
        args.priceType = ['-V'];
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
    } else if (!options.fileName || typeof options.fileName !== 'string') {
      isValid = false;
      errorMessage = 'File name is not set';
    } else if (!options.reportType || typeof options.reportType !== 'string') {
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
   * Checks if specified report type is supported by ledger-cli
   * @param {String} reportType
   * @return {Boolean} whether reportType is supported
   */
  static validateReportType(reportType) {
    return ['register', 'balance'].includes(reportType);
  }

  /**
   * Checks if specified price type is supported by ledger-cli
   * @param {String} priceType
   * @return {Boolean} whether priceType is supported
   */
  static validatePriceType(priceType) {
    return ['market', 'balance'].includes(priceType);
  }
}

module.exports = LedgerWrapper;
