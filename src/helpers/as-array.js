export default function asArray(obj) {
  if (!obj) {
    return [];
  }
  else if (!Array.isArray(obj)) {
    return [obj];
  }
  else {
    return obj;
  }
}
