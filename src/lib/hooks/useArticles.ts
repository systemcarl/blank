import * as articleStore from '$lib/stores/articles';

export const useArticles = () => {
  return {
    index : articleStore.index,
  };
};

export default useArticles;
