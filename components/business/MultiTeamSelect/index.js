import React, { PropTypes } from 'react'
import AreaSelect from 'modules/AreaSelect';
import MultiSelect from 'comp/MultiSelect';
import { getCookie } from 'utils/utils'
import { setInitAreaValue, getInitAreaValue, updateConfigValue } from 'modules/AreaSelect/utils';

/**
 * 组件属性申明
 * @name 参数名
 */
const propTypes = {
}

/**
 * 跨物流方切换组件
 */
export default class MultiTeamSelect extends React.Component {
    constructor(props) {
        super(props);
        this.aoiPartnerConfig = this.getAoiPartnerConfig();
        this.state = {
            aoiPartnerDisabled: false,
            value: props.value,
            teamData: this.getTeamData(props)
        }
    }
    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;

        let checkedValue = value['team'] || parseInt(getCookie('waimai_logistics_spt'), 10);
        this.setState({
            teamData: this.getTeamData(nextProps),
            aoiPartnerDisabled: checkedValue && $.isArray(checkedValue) && checkedValue.length > 1,
            value
        })
    }
    getTeamData(props) {
        const slist = window._INITDATA_.slist;
        const { value } = props;
        let checkedValue = value['team'] || parseInt(getCookie('waimai_logistics_spt'), 10);
        let teamData = [];
        if (slist && $.isArray(slist)) {
            for (let i = 0; i < slist.length; i++) {
                teamData.push({
                    label: slist[i]['sname'], 
                    value: slist[i]['sid'],
                    selected: (checkedValue && $.isArray(checkedValue)) ? (checkedValue.indexOf(slist[i]['sid']) > -1 || 
                    checkedValue.indexOf(slist[i]['sid'] + '') > -1) : checkedValue == slist[i]['sid']
                });
            }
        }
        return teamData;
    }
    
    getAoiPartnerConfig() {
        const { config } = this.props;
        let aoiPartnerConfig = {}
        aoiPartnerConfig.aoi = config['aoi'];
        aoiPartnerConfig.partner = config['partner'];
        return aoiPartnerConfig;
    }
    copyValue(value) {
        let obj = {};
        for (let key in value) {
            obj.key = value && $.isArray(value) ? [...value[key]] : value
        }
        return obj;
    }
    render() {
        const { name, config, onChange, disabled, data, form, type, value, ...other } = this.props;
        const { aoiPartnerDisabled, teamData } = this.state;
        let tempValue = this.copyValue(value);

        return (
            <div>
                <MultiSelect 
                    data = { teamData }  
                    disabled = { config['team']['disabled'] || disabled }
                    includeSelectAllOption = { config['team']['multiple'] && config['team']['withAll'] }
                    enableFiltering={ true }
                    onChange = { e => onChange(this.teamChange(e)) } 
                    width = { config['team']['width'] || 150 }
                />

                <AreaSelect 
                    name = "areaSelect"
                    config = { updateConfigValue(this.aoiPartnerConfig, tempValue) }
                    type = { type || 'forward' }
                    data = { (!data || $.isEmptyObject(data)) ? false : data }
                    disabled = { aoiPartnerDisabled }
                    onChange = { e => onChange(this.areaSelectChange(e)) } 
                />
            </div>
        )
    }

    teamChange(value) {
        const { config, updateOptions } = this.props;
        let aoiPartnerDisabled, newValue;
        if (value && value.length === 1) {
            updateOptions && updateOptions(value[0]);
            aoiPartnerDisabled = false;
        } else {
            aoiPartnerDisabled = true;
        }

        newValue = {
            team: value
        }

        this.setState({
            aoiPartnerDisabled,
            value: newValue
        });

        return newValue;
    }
    areaSelectChange(value) {
        let newValue;
        newValue = {
            ...value,
            team: this.state.value.team
        }
        this.setState({
            value: newValue
        })
        return newValue;
    }
    
}
