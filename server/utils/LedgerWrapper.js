/**
 * Wrapper for the command-line utility `Ledger`.
 * Should be initialized with options object that
 * turns into command-line arguments
 */
class LedgerWrapper {
  /**
   * Create a wrapper object, providing required parameters
   * @param {string} fileName
   * @param {string} reportType
   */
  constructor(fileName, reportType) {
    this.commandLineArgs = {};
    this.errorMessage = '';
    this.commandLineArgs.file = '';
    this.commandLineArgs.reportType = '';
    if (this.validateOptions({ fileName, reportType })) {
      this.commandLineArgs.file = `-f ${fileName}`;
      this.commandLineArgs.reportType = reportType;
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
    const s = `${args.file} ${args.reportType} ${args.reportCurrency} ${args.totalData}` +
      ` ${args.groupPeriod} ${args.period} ${args.inverse} ${args.priceType}` +
      ` ${args.period}`;
    return s.replace(/\s\s*/g, ' ').replace(/\sundefined/g, '');
  }

  /**
   * Clears all the commandline options set for this instance
   */
  clearCurrentOptions() {
    const tempFile = this.commandLineArgs.file;
    const tempReportType = this.commandLineArgs.reportType;
    this.commandLineArgs = {
      file: tempFile,
      reportType: tempReportType,
    };
  }

  /**
   * Converts options into instance fields, properly escaping and
   * quoting those command line arguments
   * @param {Object} options
   */
  parseOptions(options) {
    const args = this.commandLineArgs;
    /* Optional parameters */
    args.reportCurrency = (typeof options.reportCurrency === 'string')
      ? `-X ${options.reportCurrency}` : '';
    args.totalData = (typeof options.totalData === 'boolean' && options.totalData)
      ? '-J' : '';
    if (typeof options.groupPeriod === 'string') {
      args.groupPeriod = (options.groupPeriod === 'day')
        ? '--daily' : `--${options.groupPeriod}ly`;
    }
    args.inverse = (typeof options.inverse === 'boolean' && options.inverse)
      ? '--invert' : '';
    if (LedgerWrapper.validatePriceType(options.priceType)) {
      switch (options.priceType) {
        case 'balance':
          args.priceType = '-B';
          break;
        case 'market':
          args.priceType = '-V';
          break;
        default:
          args.priceType = '';
      }
    }
    args.period = (typeof options.period === 'object')
      ? this.parsePeriodData(options.period) : '';
    this.commandLineArgs = args;
  }

  /**
   * Validates required option (file name and report type),
   * sets the flag isValid, returns whether all the options are
   * set and valid.
   *
   * @param {Object} options
   * @returns {boolean} true when all the options set and valid
   */
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

  parsePeriodData(period) {
    const { reportType } = this.commandLineArgs;
    switch (reportType) {
      case 'balance':
        return '-e 2015-01-28';
      default:
        this.valid = false;
        this.errorMessage = 'Period is not set';
        return '';
    }
    /*
    const year = period.getFullYear();
    const month = (period.getMonth() < 9 ? '0' : '') +
      (period.getMonth() + 1);
    args.period = ['--period', `${year}-${month}`];
    */
  }

  /**
   * Checks if specified report type is supported by ledger-cli
   * @param {String} reportType
   * @return {boolean} whether reportType is supported
   */
  static validateReportType(reportType) {
    return ['register', 'balance'].includes(reportType);
  }

  /**
   * Checks if specified price type is supported by ledger-cli
   * @param {String} priceType
   * @return {boolean} whether priceType is supported
   */
  static validatePriceType(priceType) {
    return ['market', 'balance'].includes(priceType);
  }
}

module.exports = LedgerWrapper;
