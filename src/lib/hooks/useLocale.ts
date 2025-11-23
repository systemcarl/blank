import * as localeStore from '$lib/stores/locale';

const useLocale = () => {
  return {
    locale : localeStore.locale,
  };
};

export default useLocale;
