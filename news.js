import news from 'news/*';

export default Object.values(news)
  .map(n => {
    n.default.date = new Date(n.default.date);
    return n.default;
  }).sort((a, b) => {
    return b.date - a.date;
  });
