let mapping = {};

function addMapping(item1, item2, item3, value) {
  let key = [item1, item2, item3].sort().join("-");
  mapping[key] = value;
}

function getValue(item1, item2, item3) {
  let key = [item1, item2, item3].sort().join("-");
  return mapping[key];
}

function deleteMapping(item1, item2, item3) {
  let key = [item1, item2, item3].sort().join("-");
  delete mapping[key];
}

addMapping("A", "B", "C", 10);
addMapping("X", "Y", "Z", 20);

console.log(getValue("A", "B", "C"));
console.log(getValue("C", "A", "B"));

deleteMapping("A", "B", "C");
console.log(mapping);

console.log(getValue("A", "B", "C"));
