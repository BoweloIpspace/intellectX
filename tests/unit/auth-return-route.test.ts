import { describe, expect, it } from "vitest";
import { getSafeMobileReturnTo, withMobileReturnTo } from "@/lib/auth-return-route";

describe("mobile auth return routes", () => {
  it("preserves a selected mobile quiz including its mobile query", () => {
    expect(getSafeMobileReturnTo("/quiz/ai-study-systems-check?from=mobile")).toBe(
      "/quiz/ai-study-systems-check?from=mobile",
    );
    expect(withMobileReturnTo("/login", "/quiz/ai-study-systems-check?from=mobile")).toBe(
      "/login?returnTo=%2Fquiz%2Fai-study-systems-check%3Ffrom%3Dmobile",
    );
  });

  it("allows only the quiz-focused native destinations", () => {
    expect(getSafeMobileReturnTo("/mobile-study")).toBe("/mobile-study");
    expect(getSafeMobileReturnTo("/mobile-quizzes")).toBe("/mobile-quizzes");
    expect(getSafeMobileReturnTo("/mobile-progress")).toBe("/mobile-progress");
    expect(getSafeMobileReturnTo("/mobile-profile")).toBe("/mobile-profile");
    expect(getSafeMobileReturnTo("/courses")).toBeNull();
    expect(getSafeMobileReturnTo("/admin")).toBeNull();
  });

  it("rejects external and protocol-relative redirects", () => {
    expect(getSafeMobileReturnTo("https://example.com/quiz/steal")).toBeNull();
    expect(getSafeMobileReturnTo("//example.com/quiz/steal")).toBeNull();
  });
});
