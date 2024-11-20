import {
  UserGraph,
  TagTree,
  findContentByTag,
  generateUserFeed,
} from "./social_media_graph.js";
import { jest, describe, expect, test, beforeEach } from "@jest/globals";

describe("UserGraph", () => {
  /** @type {UserGraph} userGraph  */
  let userGraph;

  beforeEach(() => {
    userGraph = new UserGraph();
  });

  test("should add users correctly", () => {
    userGraph.addUser("Joseph");
    expect(userGraph.adjacencyList).toHaveProperty("Joseph");
  });

  test("should create connections correctly", () => {
    userGraph.addUser("Joseph");
    userGraph.addUser("Pascal");
    userGraph.addConnection("Joseph", "Pascal");
    expect(userGraph.adjacencyList["Joseph"]).toContain("Pascal");
    expect(userGraph.adjacencyList["Pascal"]).toContain("Joseph");
  });

  test("should remove users correctly", () => {
    userGraph.addUser("Joseph");
    userGraph.removeUser("Joseph");
    expect(userGraph.adjacencyList).not.toHaveProperty("Joseph");
    expect(userGraph.adjacencyList["Joseph"]).not.toBeNull();
  });

  test("should remove connections correctly", () => {
    userGraph.addUser("Joseph");
    userGraph.addUser("Pascal");

    userGraph.addConnection("Joseph", "Pascal");
    userGraph.removeConnection("Joseph", "Pascal");

    expect(userGraph.adjacencyList["Joseph"]).not.toContain("Pascal");
    expect(userGraph.adjacencyList["Pascal"]).not.toContain("Joseph");
  });

  test("should set user interests correctly", () => {
    userGraph.addUser("Joseph");
    userGraph.setUserInterests("Joseph", ["JavaScript"]);
    expect(userGraph.userInterests["Joseph"]).toEqual(["JavaScript"]);
  });
});

describe("TagTree", () => {
  /** @type {TagTree} tagTree  */
  let tagTree;

  beforeEach(() => {
    tagTree = new TagTree();
  });

  test("should add tags correctly", () => {
    tagTree.addTag("root", "IT");
    const rootChildren = tagTree.root.children.map((child) => child.value);
    expect(rootChildren).toContain("IT");
  });

  test("should find tags correctly", () => {
    tagTree.addTag("root", "IT");
    const foundTag = tagTree.findTag(tagTree.root, "IT");
    expect(foundTag).not.toBeNull();
    expect(foundTag.value).toBe("IT");
  });

  test("should add content to tags correctly", () => {
    tagTree.addTag("root", "IT");
    const itTag = tagTree.findTag(tagTree.root, "IT");
    itTag.addContent("Post about IT");
    expect(itTag.contentIds).toContain("Post about IT");
  });
});

describe("findContentByTag", () => {
  test("should find content by tag", () => {
    const tagTree = new TagTree();
    tagTree.addTag("root", "IT");
    tagTree.addTag("IT", "JavaScript");
    const javascriptTag = tagTree.findTag(tagTree.root, "JavaScript");
    javascriptTag.addContent("Post about closures");
    const consoleSpy = jest.spyOn(console, "log");
    findContentByTag(tagTree.root, "JavaScript");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Content for tag: JavaScript",
      expect.arrayContaining(["Post about closures"])
    );
    consoleSpy.mockRestore();
  });
});

describe("generateUserFeed", () => {
  test("should generate user feed based on interests and connections", () => {
    const userGraph = new UserGraph();
    userGraph.addUser("Joseph");
    userGraph.addUser("Pascal");
    userGraph.addConnection("Joseph", "Pascal");
    userGraph.setUserInterests("Joseph", ["JavaScript"]);
    userGraph.setUserInterests("Pascal", ["DSA"]);

    const tagTree = new TagTree();
    tagTree.addTag("root", "IT");
    tagTree.addTag("IT", "JavaScript");
    tagTree.addTag("JavaScript", "DSA");
    const javascriptTag = tagTree.findTag(tagTree.root, "JavaScript");
    javascriptTag.addContent("Post about closures");
    javascriptTag.addContent("Article on async/await");

    const dsaTag = tagTree.findTag(tagTree.root, "DSA");
    dsaTag.addContent("Video on algorithms");

    const consoleSpy = jest.spyOn(console, "log");
    generateUserFeed(userGraph, tagTree, "Joseph", []);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Feed for Joseph:",
      expect.arrayContaining(["Post about closures"])
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Feed for Joseph:",
      expect.arrayContaining(["Article on async/await"])
    );
    consoleSpy.mockRestore();
  });
});
