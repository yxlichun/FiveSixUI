import { getQueryString, getActionName } from 'utils/utils'

const Utils = {}

Utils.generateHref = (actionRoot, actionName, hashPath, devParams, additional) => {
    let href = '';
    const devActionName = getQueryString('devPage');

    if (devActionName) { // 调试环境
        href = 'http://' + devParams.ip + ':' + devParams.port + '/' + devParams.phpName + '.php?devPage=' + actionName + '#/' + hashPath;
    } else { // 生产环境
        href = '/' + actionRoot + '/' + actionName + '#/' + hashPath;
    }

    if (additional) {
        return href + additional;
    }
    
    return href;
}

export default Utils;
