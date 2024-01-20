interface GetPaginationProps<T> {
  page: string | number;
  pagination?: any;
}

const getPagination = <T>({ page, pagination }: GetPaginationProps<T[]>) => {
  const totalPages = pagination.pages;

  const currentPage = page || 1;

  const paginatedPosts = 1;

  return {
    totalPages,
    currentPage,
    paginatedPosts,
  };
};

export default getPagination;
