class ApiFeatures {
  public query: any;
  public queryString: any;
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  public pagination(rowsPerPage: number) {
    const page = Number(this.queryString.page) || 1;
    const skip = rowsPerPage * (page - 1);
    this.query = this.query.limit(rowsPerPage).skip(skip);
    return this;
  }

  public search() {
    const keyword = this.queryString.q
      ? {
          $or: [
            { title: { $regex: this.queryString.q, $options: "i" } },
            { description: { $regex: this.queryString.q, $options: "i" } },
            { tags: { $in: this.queryString.q } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
}

export default ApiFeatures;
