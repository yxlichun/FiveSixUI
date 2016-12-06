import AF from 'states/actionFactory';

const Service = {};

/* eslint-disable */

Service.fetch_order_detail = AF.getFetch(
  { url: '/logistics/getpcorderdetail' }, 'getpcorderdetail'
);

Service.get_order_ticket = AF.getFetch(
  { url: '/logistics' }, 'getorderticket'
)
/* eslint-enable */

export default Service;
