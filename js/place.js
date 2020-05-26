export function contactsFor(tags) {
  const fbText = (u) => {
    if (!u.startsWith("http")) {
      return u;
    }
    const pageName = u.replace(/^https?\:\/\/.*facebook\.com\//, "")
          .replace(/\/$/, "")
          .replace(/-\d+$/, "")
          .replace(/-/g, " ");
    return decodeURIComponent(pageName);
  };
  const transform = {
    phone(phone) {
      return { text: phone, href: `tel:${phone}`, type: 'phone' };
    },
    facebook(url) {
      const href = url.startsWith('http') ? url : `https://facebook.com/${url}`;
      return { text: fbText(href), href, type: 'facebook' };
    },
    website(url) {
      return { text: url.replace(/^https?\:\/\//, "").replace(/\/$/, ""), href: url, type: 'link' };
    }
  };
  return (name) => {
    const value = tags[name] || tags[`contact:${name}`];
    if (!value) return;
    return value.split(';').map(transform[name] || (v => { return { text: v, href: v }; }));
  };
}
