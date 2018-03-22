export default function pushNew(arr1, arr2) {
  arr2.forEach(el => {
    if (arr1.includes(el)) {
      arr1.splice(arr1.indexOf(el), 1);
    }
    arr1.push(el);
  });
}
