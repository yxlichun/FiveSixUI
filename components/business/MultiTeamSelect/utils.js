import { getCookie } from 'utils/utils'
import { setInitAreaValue, getInitAreaValue, updateConfigValue } from 'modules/AreaSelect/utils';

const Utils = {}

Utils.getInitialValue = (config, initialValue, type) => {
    if (initialValue && !$.isEmptyObject(initialValue)) {
        return initialValue;
    }
    let areaSelect = setInitAreaValue(config, initialValue, type || 'forward');
    return areaSelect;
}

export default Utils;