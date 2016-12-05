'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 旬选择组件，自动选择当前时间所对应的旬
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *       modified by lichun<lichun@iwaimai.baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author wangjuan01 <wangjuan01@iwaimai.baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 0.0.1
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MonthPicker = _antd.DatePicker.MonthPicker;
var Option = _antd.Select.Option;
_moment2.default.locale('zh-cn');

/**
 * 组件属性申明
 *
 * @property {function} onChange
 * @property {bool} disabled
 * @property {object} value { month: '2013-10', month_type: '1'} 2013年10月上旬
 * @property {moment} startMoment 起始时间 
 * @property {moment} endMoment 结束时间
 * @property {string} monthFormat 使用moment的月份格式化字符串 default='YYYY-MM'
 */
var propTypes = {
    onChange: _react.PropTypes.func,
    disabled: _react.PropTypes.bool,
    value: _react.PropTypes.object,
    startMoment: _react.PropTypes.object,
    endMoment: _react.PropTypes.object,
    monthFormat: _react.PropTypes.string
};

/**
 * 主组件
 * 
 * @export
 * @class DateTenSelect
 * @extends {React.Component}
 */

var DateTenSelect = function (_React$Component) {
    _inherits(DateTenSelect, _React$Component);

    /**
     * Creates an instance of DateTenSelect.
     * 
     * @param {any} props
     * 
     * @memberOf DateTenSelect
     */
    function DateTenSelect(props) {
        _classCallCheck(this, DateTenSelect);

        var _this = _possibleConstructorReturn(this, (DateTenSelect.__proto__ || Object.getPrototypeOf(DateTenSelect)).call(this, props));

        var value = props.value;


        _this.monthFormat = props.monthFormat || 'YYYY-MM';

        // this.month为format后的字符串，而非moment()
        _this.month = value && value.month ? value.month : _this.getMonth((0, _moment2.default)(), _this.monthFormat);
        _this.month_type = value && value.month_type ? value.month_type : _this.getTenNum((0, _moment2.default)());
        return _this;
    }

    _createClass(DateTenSelect, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var onChange = this.props.onChange;


            onChange && onChange({
                month: this.month,
                month_type: this.month_type
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.value) {
                this.month = nextProps.value.month || this.month;
                this.month_type = nextProps.value.month_type || this.month_type;
            }
        }

        /**
         * 判断日期是否在可选范围之内 pure
         * 
         * @param {moment} current
         * @param {moment} startMoment
         * @param {moment} endMoment
         * @return {bool} 是否是不可选日期
         * 
         * @memberOf DateTenSelect
         */

    }, {
        key: 'disabledDate',
        value: function disabledDate(current, startMoment, endMoment) {
            return !((!startMoment || startMoment && current.valueOf() > startMoment.unix() * 1000) && (!endMoment || endMoment && current.valueOf() < endMoment.unix() * 1000));
        }
        /**
         * 根据给定日期返回年月 pure
         * 
         * @param {moment} mom
         * @param {string} format
         * @return {string} format Year&Month like 2013-04
         * 
         * @memberOf DateTenSelect
         */

    }, {
        key: 'getMonth',
        value: function getMonth(mom, format) {
            return mom.format(format || 'YYYY-MM');
        }
        /**
         * 根据给定日期返回旬 pure
         * 
         * @param {moment} mom
         * @return {string} 旬
         * 
         * @memberOf DateTenSelect
         */

    }, {
        key: 'getTenNum',
        value: function getTenNum(mom) {
            var day = mom.format('DD');
            switch (day.slice(0, 1)) {
                case '0':
                    return '1';
                case '1':
                    return '2';
                default:
                    return '3';
            }
        }
    }, {
        key: 'changeMonth',
        value: function changeMonth(value) {
            var onChange = this.props.onChange;

            this.month = this.getMonth(value, this.monthFormat);

            onChange && onChange({
                month: this.month,
                month_type: this.month_type
            });
        }
    }, {
        key: 'changemonthType',
        value: function changemonthType(value) {
            var onChange = this.props.onChange;

            this.month_type = value;

            onChange && onChange({
                month: this.month,
                month_type: this.month_type
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                disabled = _props.disabled,
                startMoment = _props.startMoment,
                endMoment = _props.endMoment;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(MonthPicker, {
                    value: this.month ? (0, _moment2.default)(this.month, this.monthFormat) : '',
                    style: { width: 100 },
                    disabledDate: function disabledDate(current) {
                        return _this2.disabledDate(current, startMoment, endMoment);
                    },
                    disabled: !!disabled,
                    placeholder: '\u8BF7\u9009\u62E9\u6708\u4EFD',
                    onChange: function onChange(value) {
                        return _this2.changeMonth(value);
                    } }),
                _react2.default.createElement(
                    _antd.Select,
                    {
                        value: this.month_type + '',
                        style: { marginLeft: 10, width: 80 },
                        disabled: !!disabled,
                        onChange: function onChange(value) {
                            return _this2.changemonthType(value);
                        } },
                    _react2.default.createElement(
                        Option,
                        { value: '1' },
                        '\u4E0A\u65EC'
                    ),
                    _react2.default.createElement(
                        Option,
                        { value: '2' },
                        '\u4E2D\u65EC'
                    ),
                    _react2.default.createElement(
                        Option,
                        { value: '3' },
                        '\u4E0B\u65EC'
                    )
                )
            );
        }
    }]);

    return DateTenSelect;
}(_react2.default.Component);

exports.default = DateTenSelect;