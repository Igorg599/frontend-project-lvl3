const parser = (data) => {
  const parserDOM = new DOMParser();
  const dom = parserDOM.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    const error = new Error();
    error.isResource = true;
    throw error;
  }

  const flowTitleElem = dom.querySelector('channel > title');
  const flowTitle = flowTitleElem.textContent;
  const flowDescriptionElem = dom.querySelector('channel > description');
  const flowDescription = flowDescriptionElem.textContent;

  const itemElems = dom.querySelectorAll('item');
  const items = [...itemElems].map((element) => {
    const titleElem = element.querySelector('title');
    const title = titleElem.textContent;
    const linkElem = element.querySelector('link');
    const link = linkElem.textContent;
    const descrElem = element.querySelector('description');
    const descr = descrElem.textContent;
    return { title, link, descr };
  });
  return { title: flowTitle, descr: flowDescription, items };
};

export default parser;
