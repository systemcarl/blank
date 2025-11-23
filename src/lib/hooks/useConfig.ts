import * as configStore from '$lib/stores/config';

const useConfig = () => {
  return {
    config : configStore.config,
  };
};

export default useConfig;
