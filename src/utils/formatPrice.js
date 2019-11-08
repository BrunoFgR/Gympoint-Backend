import intl from 'intl';
import pt from 'intl/locale-data/jsonp/pt-BR';

const { format } = new intl.NumberFormat(pt, {
  style: 'currency',
  currency: 'BRL',
});

export default format;
