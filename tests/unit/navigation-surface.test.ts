import { describe, expect, it } from "vitest";

import { resolveMobileNavigationSurface } from "@/lib/navigation-surface";

const webItems = [
  { label: "Courses", href: "/courses" },
  { label: "Quizzes", href: "/quizzes" },
  { label: "Profile", href: "/profile" },
];

const nativeItems = [
  { label: "Home", href: "/mobile-study" },
  { label: "Quizzes", href: "/mobile-quizzes" },
  { label: "Progress", href: "/mobile-progress" },
  { label: "Profile", href: "/mobile-profile" },
];

describe("mobile navigation surface routing", () => {
  it("keeps responsive web navigation on normal web routes", () => {
    expect(
      resolveMobileNavigationSurface({
        nativeAppSurface: false,
        webItems,
        webLogoHref: "/courses",
        nativeItems,
        nativeLogoHref: "/mobile-study",
      }),
    ).toEqual({
      items: webItems,
      logoHref: "/courses",
    });
  });

  it("uses the quiz-only four-tab navigation on a native Capacitor surface", () => {
    expect(
      resolveMobileNavigationSurface({
        nativeAppSurface: true,
        webItems,
        webLogoHref: "/courses",
        nativeItems,
        nativeLogoHref: "/mobile-study",
      }),
    ).toEqual({
      items: nativeItems,
      logoHref: "/mobile-study",
    });
  });
});
