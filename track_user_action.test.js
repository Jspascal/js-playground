import { UserSession, LinkedList, ActionStack } from "./track_user_action";
import { describe, expect, test, beforeEach } from "@jest/globals";

describe("UserSession", () => {
  /** @type {UserSession} userSession  */
  let userSession;

  beforeEach(() => {
    userSession = new UserSession(123);
  });

  test("should instantiate with a default state", () => {
    expect(userSession.getCurrentState()).toEqual({
      document: { text: "" },
      posts: [],
    });
  });

  describe("performAction", () => {
    test("should handle post action", () => {
      const postAction = {
        type: "post",
        content: { id: 1, text: "First post" },
        description: "Posting first content",
      };
      userSession.performAction(postAction);
      expect(userSession.getCurrentState().posts).toContainEqual({
        id: 1,
        text: "First post",
      });
    });

    test("should handle edit action", () => {
      const postAction = {
        type: "post",
        content: { id: 1, text: "First post" },
        description: "Posting first content",
      };
      userSession.performAction(postAction);

      const editAction = {
        type: "edit",
        content: { id: 1, text: "First post edited" },
        description: "Editing first content",
      };
      userSession.performAction(editAction);
      expect(userSession.getCurrentState().posts).toContainEqual({
        id: 1,
        text: "First post edited",
      });
    });
  });

  describe("undo and redo actions", () => {
    test("should undo and redo actions correctly", () => {
      userSession.performAction({
        type: "post",
        content: { id: 1, text: "First post" },
        description: "Posting first content",
      });
      userSession.performAction({
        type: "post",
        content: { id: 2, text: "Second post" },
        description: "Posting second content",
      });
      userSession.performAction({
        type: "edit",
        content: { id: 1, text: "First post edited" },
        description: "Editing first content",
      });

      userSession.undoAction();
      userSession.undoAction();
      expect(userSession.getCurrentState().posts).toContainEqual({
        id: 1,
        text: "First post",
      });
      expect(userSession.getCurrentState().posts).not.toContainEqual({
        id: 2,
        text: "Second post",
      });

      userSession.redoAction();
      expect(userSession.getCurrentState().posts).toContainEqual({
        id: 2,
        text: "Second post",
      });

      userSession.undoAction();
      userSession.redoAction();
      userSession.redoAction();
      expect(userSession.getCurrentState().posts).toContainEqual({
        id: 1,
        text: "First post edited",
      });
      expect(userSession.getCurrentState().posts).toContainEqual({
        id: 2,
        text: "Second post",
      });
    });
  });

  describe("navigation", () => {
    test("should navigate pages and update history", () => {
      userSession.visitPage({
        url: "page1.html",
        content: { title: "Home Page", text: "Welcome to the home page." },
      });
      userSession.visitPage({
        url: "page2.html",
        content: { title: "About Page", text: "Learn more about us." },
      });

      expect(
        userSession.history.find({
          url: "page2.html",
          content: { title: "About Page", text: "Learn more about us." },
        })
      ).not.toBeNull();

      userSession.navigateBack();
      expect(
        userSession.history.find({
          url: "page1.html",
          content: { title: "Home Page", text: "Welcome to the home page." },
        })
      ).not.toBeNull();
      expect(
        userSession.history.find({
          url: "page2.html",
          content: { title: "About Page", text: "Learn more about us." },
        })
      ).toBeNull();
    });
  });
});
