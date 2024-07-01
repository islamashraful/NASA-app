const DEFAUTL_LIMIT = 0;
const DEFAULT_PAGE = 1;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE;
  const limit = Math.abs(query.limit) || DEFAUTL_LIMIT;

  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
