class FileSystemComponent {
  getSize() {
    throw new Error("Method not implemented");
  }
}

class File extends FileSystemComponent {
  constructor(name, size) {
    super();
    this.name = name;
    this.size = size;
  }

  getSize() {
    return this.size;
  }
}

class Directory extends FileSystemComponent {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
  }

  add(component) {
    this.children.push(component);
  }

  getSize() {
    return this.children.reduce(
      (totalSize, child) => totalSize + child.getSize(),
      0
    );
  }
}

const root = new Directory("Root");
const dir1 = new Directory("Dir1");
const dir2 = new Directory("Dir2");
const file1 = new File("File1", 100);
const file2 = new File("File2", 200);

dir1.add(file1);
dir2.add(file2);
root.add(dir1);
root.add(dir2);

console.log(`Total size of the file system: ${root.getSize()}`);
