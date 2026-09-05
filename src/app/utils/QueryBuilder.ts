import type { Prisma } from "@prisma/client";

export interface QueryOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
  searchTerm?: string;
  [key: string]: unknown;
}

export class QueryBuilder<T extends Record<string, unknown>> {
  private readonly options: QueryOptions;
  private readonly searchableFields: string[];
  private filters: T = {} as T;
  private orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };

  constructor(options: QueryOptions, searchableFields: string[] = []) {
    this.options = options;
    this.searchableFields = searchableFields;
  }

  search(): this {
    if (this.options.searchTerm && this.searchableFields.length > 0) {
      Object.assign(this.filters, {
        OR: this.searchableFields.map((field) => ({
          [field]: { contains: this.options.searchTerm, mode: "insensitive" },
        })),
      });
    }
    return this;
  }

  filter(allowedFields: string[]): this {
    for (const field of allowedFields) {
      const value = this.options[field];
      if (value !== undefined && value !== "")
        Object.assign(this.filters, { [field]: value });
    }
    return this;
  }

  sort(allowedFields: string[]): this {
    const field = allowedFields.includes(this.options.sortBy ?? "")
      ? this.options.sortBy!
      : "createdAt";
    this.orderBy = {
      [field]: this.options.sortOrder === "asc" ? "asc" : "desc",
    };
    return this;
  }

  build(): {
    where: T;
    orderBy: Record<string, "asc" | "desc">;
    skip: number;
    take: number;
    page: number;
    limit: number;
  } {
    const page = Math.max(Number(this.options.page) || 1, 1);
    const limit = Math.min(Math.max(Number(this.options.limit) || 20, 1), 100);
    return {
      where: this.filters,
      orderBy: this.orderBy,
      skip: (page - 1) * limit,
      take: limit,
      page,
      limit,
    };
  }
}
