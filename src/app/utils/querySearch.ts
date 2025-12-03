/* eslint-disable @typescript-eslint/no-explicit-any */
interface IQueryOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    fields?: string;
    searchFields?: string[];
    search?: string;
}

type IFilterOptions = Record<string, any>;

interface IDateRangeFilter {
    field: string;
    startDate?: Date | string;
    endDate?: Date | string;
}

interface IPopulateOptions {
    path: string;
    select?: string;
    populate?: IPopulateOptions;
}

interface IQueryResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * Dynamic Query Builder for Mongoose
 * Supports pagination, multi-field filtering, sorting, searching, date range filtering, and population
 */
class QuerySearch {
    private model: any;
    private query: any;
    private filterOptions: IFilterOptions = {};
    private queryOptions: IQueryOptions = {};
    private dateRangeFilters: IDateRangeFilter[] = [];
    private populateOptions: IPopulateOptions[] = [];
    private excludeFields: string[] = [];

    constructor(model: any) {
        this.model = model;
        this.query = model.find();
    }

    /**
     * Add filters to query
     * filters - Object with field names and values
     */
    filter(filters: IFilterOptions): this {
        Object.keys(filters).forEach((key) => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                this.filterOptions[key] = filters[key];
            }
        });
        return this;
    }

    /**
     * Add date range filter
     * field - Field name to filter
     * startDate - Start date (ISO string or Date object)
     * endDate - End date (ISO string or Date object)
     */
    dateRange(field: string, startDate?: string | Date, endDate?: string | Date): this {
        if (field && (startDate || endDate)) {
            this.dateRangeFilters.push({
                field,
                startDate,
                endDate,
            });
        }
        return this;
    }

    /**
     * Add search functionality across multiple fields
     * searchFields - Array of field names to search in
     * searchValue - Search string
     */
    search(searchFields: string[], searchValue: string): this {
        if (searchValue && searchFields.length > 0) {
            const searchRegex = { $regex: searchValue, $options: 'i' };
            this.filterOptions.$or = searchFields.map((field) => ({
                [field]: searchRegex,
            }));
        }
        return this;
    }

    /**
     * Add pagination
     * page - Page number (default: 1)
     *limit - Items per page (default: 10)
     */
    paginate(page = 1, limit = 10): this {
        this.queryOptions.page = Math.max(page, 1);
        this.queryOptions.limit = Math.max(limit, 1);
        return this;
    }

    /**
     * Add sorting
     * sortBy - Comma-separated fields. Prefix with "-" for descending
     * e.g., "name,-createdAt"
     */
    sort(sortBy: string): this {
        if (sortBy) {
            const sortObject: any = {};
            sortBy.split(',').forEach((field) => {
                if (field.startsWith('-')) {
                    sortObject[field.substring(1)] = -1;
                } else {
                    sortObject[field] = 1;
                }
            });
            this.queryOptions.sortBy = sortObject;
        }
        return this;
    }

    /**
     * Select specific fields
     * fields - Comma-separated field names. Prefix with "-" to exclude
     * e.g., "name,email,-password"
     */
    select(fields: string): this {
        if (fields) {
            this.queryOptions.fields = fields;
        }
        return this;
    }

    /**
     * Exclude specific fields from result
     * fields - Array of field names to exclude
     * e.g., ['password', '__v', 'resetToken']
     */
    exclude(fields: string[]): this {
        this.excludeFields = fields;
        return this;
    }

    /**
     * Populate referenced documents with optional field selection
     * path - Path to populate
     * select - Fields to include/exclude (prefix "-" to exclude)
     * e.g., populate('author') or populate('author', 'name email -password')
     */
    populate(path: string, select?: string): this {
        const populateObj: IPopulateOptions = { path };
        if (select) {
            populateObj.select = select;
        }
        this.populateOptions.push(populateObj);
        return this;
    }

    /**
     * Populate with nested population
     *populateChain - Array of populate options
     * e.g., [{path: 'author', select: 'name'}, {path: 'author.profile', select: 'bio'}]
     */
    populateNested(populateChain: IPopulateOptions[]): this {
        this.populateOptions.push(...populateChain);
        return this;
    }

    /**
     * Build date range filter conditions
     */
    private buildDateRangeFilters(): void {
        this.dateRangeFilters.forEach((dateFilter) => {
            const { field, startDate, endDate } = dateFilter;
            const dateCondition: any = {};

            if (startDate) {
                dateCondition.$gte = new Date(startDate);
            }

            if (endDate) {
                // Set endDate to end of day
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateCondition.$lte = end;
            }

            if (Object.keys(dateCondition).length > 0) {
                this.filterOptions[field] = dateCondition;
            }
        });
    }

    /**
     * Build field selection with excludes
     */
    private buildFieldSelection(): string {
        let fields = this.queryOptions.fields || '';

        // Add excluded fields
        if (this.excludeFields.length > 0) {
            const excludedFields = this.excludeFields.map(f => `-${f}`).join(' ');
            fields = fields ? `${fields} ${excludedFields}` : excludedFields;
        }

        return fields;
    }

    /**
     * Execute the query
     */
    async exec(): Promise<IQueryResult<any>> {
        // Build date range filters
        this.buildDateRangeFilters();

        // Apply filters
        this.query = this.model.find(this.filterOptions);

        // Apply field selection with excludes
        const fieldSelection = this.buildFieldSelection();
        if (fieldSelection) {
            this.query = this.query.select(fieldSelection);
        }

        // Apply population
        this.populateOptions.forEach((popOption) => {
            if (popOption.select) {
                this.query = this.query.populate(popOption.path, popOption.select);
            } else {
                this.query = this.query.populate(popOption.path);
            }
        });

        // Apply sorting
        if (this.queryOptions.sortBy) {
            this.query = this.query.sort(this.queryOptions.sortBy);
        }

        // Get total count before pagination
        const total = await this.model.countDocuments(this.filterOptions);

        // Apply pagination
        const page = this.queryOptions.page || 1;
        const limit = this.queryOptions.limit || 10;
        const skip = (page - 1) * limit;

        const data = await this.query.skip(skip).limit(limit).lean();

        const pages = Math.ceil(total / limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages,
            },
        };
    }
}

/**
 * Factory function to create QuerySearch instance
 *model - Mongoose model
 * QuerySearch instance
 */
export const createQuery = (model: any): QuerySearch => {
    return new QuerySearch(model);
};

export default QuerySearch;