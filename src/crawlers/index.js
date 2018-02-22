import rp from 'request-promise';
import cheerio from 'cheerio';

export async function crawlCategory(uri) {
  const options = {
    uri: `https://crossorigin.me/${uri}`,
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  const result = {
    categoryLabel: '',
    products: [],
  };
  try {
    const $ = await rp(options);
    $('.header span label').filter(function(){
        const data = $(this);
        const categoryLabel = data.text();
        return result.categoryLabel = categoryLabel;
    });
    $('.sanpham_cell .tensanpham_cot a').each(function (index, value) {
      const data = $(this);
      const product = {
        id: data.attr('href').split('-id')[1].split('.html')[0],
        title: data.text(),
        uri: data.attr('href'),
        category: result.categoryLabel,
        googleDriveUri: '',
      };
      result.products.push(product);
    });
    $('.sanpham_danhsach_row .tensanpham_cot a').each(function (index, value) {
      const data = $(this);
      const product = {
        id: data.attr('href').split('-id')[1].split('.html')[0],
        title: data.text(),
        uri: data.attr('href'),
        category: result.categoryLabel,
        googleDriveUri: '',
      };
      result.products.push(product);
    });
  } catch (error) {
    throw error;
  }
  return result;
}

export async function crawlProductDownload(product) {
  const options = {
    uri: `https://crossorigin.me/https://nguyenhang.vn/${product.uri}`,
    transform: function (body) {
      return cheerio.load(body);
    },
  };
  const result = {
    ...product,
    googleDriveUri: '',
    fileName: '',
  };
  try {
    const $ = await rp(options);
    $('.noidungchitiet p span strong').first().filter(function () {
      const data = $(this);
      return result.fileName = data.text();
    });
    $('.noidungchitiet p span a').first().filter(function () {
      const data = $(this);
      return result.googleDriveUri = `https://drive${data.attr('href').split('drive')[1]}`;
    });
  } catch (error) {
    throw error;
  }
  return result;
}
