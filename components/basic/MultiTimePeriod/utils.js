const Utils = {};

Utils.getMTPeriodStr = (arr) => {
    let periodStr = '';

    for(let i = 0; i < arr.length; i++) {
        if (arr[i].start) {
            periodStr += arr[i].start + '-' + arr[i].end;
            if (i !== arr.length - 1) {
                periodStr += ';';
            }
        }
    }
    return periodStr;
};

Utils.getMTPeriodArr = (str) => {
    const defaultVal = [{
        start: '',
        end: '',
        price: '',
        region: 0
    }];
    
    if (!str) {
        return defaultVal;
    }

    const periodArr = str.split(';');
    let timeArr = [];
    for(let i = 0; i < periodArr.length; i++) {
        if(periodArr[i]) {
            if(periodArr[i].length > 11) {
                timeArr.push({
                    start: periodArr[i].slice(0, 5),
                    end: periodArr[i].slice(6, 11),
                    price: periodArr[i].slice(12),
                    region: periodArr[i].slice(12)
                });
            } else {
                timeArr.push({
                    start: periodArr[i].slice(0, 5),
                    end: periodArr[i].slice(6, 11)
                });
            }
        }
    }
    return timeArr;
};

Utils.getMTPeriodMinuteCount = (arr) => {
    let sum = 0;
    if (!arr.length) {
        return sum;
    }
    for (let i = 0; i < arr.length; i++) {
        let startSum = parseInt(arr[i].start.split(':')[0], 10) * 60 + parseInt(arr[i].start.split(':')[1], 10);
        let endSum = parseInt(arr[i].end.split(':')[0], 10) * 60 + parseInt(arr[i].end.split(':')[1], 10);

        sum += endSum - startSum;
    }
    return sum;
};

Utils.checkMTPeriodStartToEnd = (arr) => {

    for (let i = 0; i < arr.length; i++) {
        let internalValue = Utils.getInternalValues(arr[i]);

        if (internalValue.startSum >= internalValue.endSum) {
            return false;
        }
    }

    return true;
};

Utils.checkMTPeriodCross = (arr) => {

    for (let i = 1; i < arr.length; i++) {
        let curValue = Utils.getInternalValues(arr[i]);
        
        for (let j = 0; j < i; j++) {
            
            let preValue = Utils.getInternalValues(arr[j]);
            if (curValue.startSum > preValue.startSum && curValue.startSum < preValue.endSum) {
                return false;
            }
            if (curValue.endSum > preValue.startSum && curValue.endSum < preValue.endSum) {
                return false;
            }
            if (curValue.startSum > preValue.startSum && curValue.endSum < preValue.endSum) {
                return false;
            }
            if (curValue.startSum < preValue.startSum && curValue.endSum > preValue.endSum) {
                return false;
            }
        }
    }
    return true;
};

Utils.checkMTPeriodContain = (bigValue, smallValue) => {
    if (!bigValue && !smallValue) {
        return false;
    }

    let bigResultArray = [];

    for (let i = 0; i < bigValue.length; i++) {
        let internalValue = Utils.getInternalValues(bigValue[i]);
        if (internalValue) {
            bigResultArray.push(internalValue);
        }
    }

    for (let j = 0; j < smallValue.length; j++) {
        let internalValue = Utils.getInternalValues(smallValue[j]);
        let flag = false;

        if (internalValue) {
            for (let k = 0; k < bigResultArray.length; k++) {
                if (bigResultArray[k]['startSum'] <= internalValue['startSum'] && bigResultArray[k]['endSum'] >= internalValue['endSum']) {
                    flag = true;
                    break;
                }
            }
            if (flag === false) {
                return false;
            }
        }
    }

    return true;
};

Utils.getInternalValues = (value) => {
    const startSum = parseInt(value.start.split(':')[0], 10) * 60 + parseInt(value.start.split(':')[1], 10);
    const endSum = parseInt(value.end.split(':')[0], 10) * 60 + parseInt(value.end.split(':')[1], 10);

    return {
        startSum,
        endSum
    };
};

export default Utils;
