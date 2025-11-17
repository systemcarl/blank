import * as articleStore from '$lib/stores/articles';

const useArticles = () => {
  return {
    getIndex : articleStore.getIndex,
    setIndex : articleStore.setIndex,
  };
};

export default useArticles;
