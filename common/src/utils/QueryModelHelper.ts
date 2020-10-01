import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as QueryString from "qs";
import _ from "lodash";
import { GLOBAL_PAGINATION_SIZE } from "./globalConsts";

export class QueryModelHelper {
  private query;

  private readonly queryString;

  public totalCount: any;

  constructor(
    query: mongoose.DocumentQuery<mongoose.Document[], mongoose.Document, {}>,
    queryString: QueryString.ParsedQs
  ) {
    this.query = query;
    this.queryString = queryString;
  }

  getQuery() {
    return this.query;
  }

  async getTotalCount() {
    // @ts-ignore
    return await this.totalCount.countDocuments((err, count) => {
      if (err) {
        throw new Error(err.message);
      }
      return count;
    });
  }

  // Filters the query based on params;
  filter(manualExcluded: string[] = []) {
    const queryObj = { ...this.queryString };

    // add manual excluded to base excludes remove the excludedFields
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "nopaginate",
    ].concat(manualExcluded);
    excludedFields.forEach((el) => delete queryObj[el]);

    // Populate filters in actual mongoose filter obj
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
    });
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  // sort the documents
  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  // Select only specific fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  // Paginate the query
  paginate() {
    if (!this.queryString.nopaginate) {
      // find total count before limiting
      this.totalCount = _.cloneDeep(this.query);
      // @ts-ignore
      const page = this.queryString.page * 1 || 1;
      // @ts-ignore
      const limit = this.queryString.limit * 1 || GLOBAL_PAGINATION_SIZE;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
