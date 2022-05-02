const arr = [
  'вертикаль',
  'кильватер',
  'апельсин',
  'спаниель',
  'австралопитек',
  'ватерполистка',
  'кластер',
  'сталкер',
  'стрелка',
  'корабль',
];

const groupArr = (array) => {
  const obj = {};
  array.forEach((item) => {
    const sorItem = item.split('').sort().join('');
    if (!obj[sorItem]) {
      obj[sorItem] = [item];
      return;
    }
    obj[sorItem] = [...obj[sorItem], item];
  });
  console.log(obj);
};

groupArr(arr);
