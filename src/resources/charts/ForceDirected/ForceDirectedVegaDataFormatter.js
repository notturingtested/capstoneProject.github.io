export default class ForceDirectedVegaDataFormatter {
  static format(opts) {
    return new this().formatDataForVega(opts); 
  }

  // TODO: Implement at a later time. 
  formatDataForVega(opts) { 
    const fakeFormattedData = opts.data; 
    const fakeAggregateData = {}; 
    return {formattedData: fakeFormattedData, aggregateData: fakeAggregateData}; 
  }
}
