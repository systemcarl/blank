import * as configStore from '$lib/stores/config';

const useConfig = () => {
  return {
    getConfig : configStore.getConfig,
    setConfig : configStore.setConfig,
  };
};

export default useConfig;
