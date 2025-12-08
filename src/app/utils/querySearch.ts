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
    model?: string;
    populate?: IPopulateOptions | IPopulateOptions[];
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
 * Supports pagination, multi-field filtering, sorting, searching, date range filtering, and nested population
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
     * @param filters - Object with field names and values
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
     * @param field - Field name to filter
     * @param startDate - Start date (ISO string or Date object)
     * @param endDate - End date (ISO string or Date object)
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
     * @param searchFields - Array of field names to search in (can be unlimited)
     * @param searchValue - Search string
     * @example
     * .search(['name', 'email', 'phone', 'address'], 'john')
     */
    search(searchFields: string[] | string, searchValue?: string): this {
        let fields: string[] = [];
        let value = '';

        if (Array.isArray(searchFields)) {
            fields = searchFields;
            value = searchValue || '';
        } else if (typeof searchFields === 'string') {
            fields = [searchFields];
            value = searchValue || '';
        }

        if (value && fields.length > 0) {
            const searchRegex = { $regex: value, $options: 'i' };
            this.filterOptions.$or = fields.map((field) => ({
                [field]: searchRegex,
            }));
        }
        return this;
    }

    /**
     * Add pagination
     * @param page - Page number (default: 1)
     * @param limit - Items per page (default: 10)
     */
    paginate(page = 1, limit = 10): this {
        this.queryOptions.page = Math.max(page, 1);
        this.queryOptions.limit = Math.max(limit, 1);
        return this;
    }

    /**
     * Add sorting
     * @param sortBy - Comma-separated fields. Prefix with "-" for descending
     * e.g., "name,-createdAt"
     */
    sort(sortBy: string): this {
        if (sortBy) {
            const sortObject: any = {};
            sortBy.split(',').forEach((field) => {
                const trimmedField = field.trim();
                if (trimmedField.startsWith('-')) {
                    sortObject[trimmedField.substring(1)] = -1;
                } else {
                    sortObject[trimmedField] = 1;
                }
            });
            this.queryOptions.sortBy = sortObject;
        }
        return this;
    }

    /**
     * Select specific fields
     * @param fields - Comma-separated field names. Prefix with "-" to exclude
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
     * @param fields - Array of field names to exclude (can be unlimited)
     * e.g., ['password', '__v', 'resetToken', 'tempOtp', 'secretData']
     */
    exclude(fields: string[]): this {
        this.excludeFields = fields;
        return this;
    }

    /**
     * Populate referenced documents with optional field selection
     * @param path - Path to populate
     * @param select - Fields to include/exclude (prefix "-" to exclude)
     * @param model - Model name for population (optional)
     * @example
     * .populate('author')
     * .populate('author', 'name email -password')
     * .populate('author', 'name email', 'Author')
     */
    populate(path: string, select?: string, model?: string): this {
        const populateObj: IPopulateOptions = { path };
        if (select) {
            populateObj.select = select;
        }
        if (model) {
            populateObj.model = model;
        }
        this.populateOptions.push(populateObj);
        return this;
    }

    /**
     * Populate with nested population (single level)
     * @param path - Path to populate
     * @param select - Fields to include/exclude
     * @param nestedPath - Nested path to populate
     * @param nestedSelect - Nested fields to include/exclude
     * @param nestedModel - Nested model name (optional)
     * @example
     * .populateNested('receiverId', 'email profile', 'profile', 'bio avatar', 'Profile')
     */
    populateNested(
        path: string,
        select?: string,
        nestedPath?: string,
        nestedSelect?: string,
        nestedModel?: string
    ): this {
        const populateObj: IPopulateOptions = { path };

        if (select) {
            populateObj.select = select;
        }

        if (nestedPath) {
            const nestedObj: IPopulateOptions = { path: nestedPath };
            if (nestedSelect) {
                nestedObj.select = nestedSelect;
            }
            if (nestedModel) {
                nestedObj.model = nestedModel;
            }
            populateObj.populate = nestedObj;
        }

        this.populateOptions.push(populateObj);
        return this;
    }

    /**
     * Populate with deep nested population (multiple levels)
     * @param populateChain - Array of populate options with nested structure
     * @example
     * .populateDeep([
     *   {
     *     path: 'receiverId',
     *     select: 'email profile',
     *     populate: {
     *       path: 'profile',
     *       select: 'bio avatar',
     *       model: 'Profile'
     *     }
     *   },
     *   {
     *     path: 'senderId',
     *     select: 'name email',
     *     populate: {
     *       path: 'department',
     *       select: 'name code'
     *     }
     *   }
     * ])
     */
    populateDeep(populateChain: IPopulateOptions[]): this {
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
        this.buildDateRangeFilters();

        this.query = this.model.find(this.filterOptions);

        const fieldSelection = this.buildFieldSelection();
        if (fieldSelection) {
            this.query = this.query.select(fieldSelection);
        }

        // Apply population with nested support
        this.populateOptions.forEach((popOption) => {
            this.query = this.query.populate(popOption);
        });

        if (this.queryOptions.sortBy) {
            this.query = this.query.sort(this.queryOptions.sortBy);
        }

        const total = await this.model.countDocuments(this.filterOptions);

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
 * @param model - Mongoose model
 * @returns QuerySearch instance
 */
export const createQuery = (model: any): QuerySearch => {
    return new QuerySearch(model);
};

export default QuerySearch;