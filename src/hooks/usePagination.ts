import { useState } from 'react';

const usePagination = (count: number, length: number, loading: boolean) => {
  const [offset, setOffset] = useState(0);
  const [offsetError, setOffsetError] = useState(false);

  const handleLoadMore = () => {
    if (count > length && !loading) {
      if (offsetError) {
        setOffsetError(false);
      } else {
        setOffset(offset + 1);
      }
    }
  };

  const paginationError = () => {
    setOffsetError(true);
  };

  return { offset, paginationError, handleLoadMore, setOffset };
};

export default usePagination;
