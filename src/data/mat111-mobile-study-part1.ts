import type { Mat111ExamTopic, Mat111InfographyPage } from "./mat111-mobile-study-types";

export const mat111InfographyPagesPart1: Record<string, Mat111InfographyPage[]> = {
  "mat111-week-2": [
    { title: "Arithmetic combinations", body: "For functions f and g with overlapping domains, addition, subtraction and multiplication are done pointwise: (f+g)(x)=f(x)+g(x), (f-g)(x)=f(x)-g(x), and (fg)(x)=f(x)g(x)." },
    { title: "Quotients and restrictions", body: "The quotient (f/g)(x)=f(x)/g(x) is defined only where x belongs to both domains and g(x) is not zero. Always carry the denominator restriction into the final domain." },
    { title: "Worked combination pattern", body: "With f(x)=2x-3 and g(x)=x^2-1, form each operation by substitution before simplifying. For the quotient, x=±1 must be excluded because x^2-1=0 there." },
    { title: "Composition", body: "Composition feeds the output of one function into another: (f∘g)(x)=f(g(x)). Order matters, so f∘g and g∘f are generally different functions." },
    { title: "Domain of a composition", body: "For f∘g, x must first lie in the domain of g, and the value g(x) must then lie in the domain of f. This two-stage check determines the composition domain." },
    { title: "Evaluating compositions", body: "To evaluate (f∘g)(a), calculate g(a) first and then evaluate f at that result. If either stage is undefined, the composition is undefined at a." },
    { title: "Inverse functions", body: "Functions f and g are inverses when f(g(x))=x and g(f(x))=x on the relevant domains. The inverse reverses the action of the original function." },
    { title: "Domain and range swap", body: "For an inverse pair, the domain of f becomes the range of f⁻¹, and the range of f becomes the domain of f⁻¹. Their graphs are reflections in the line y=x." },
    { title: "One-to-one functions", body: "A function has an inverse function exactly when it is one-to-one. A one-to-one function never sends two different inputs to the same output." },
    { title: "Horizontal line test and algebraic inverse", body: "A graph is one-to-one if every horizontal line intersects it at most once. Algebraically, find an inverse by writing y=f(x), interchanging x and y, and solving for y." },
  ],
  "mat111-week-3": [
    { title: "Graph symmetry", body: "Symmetry can be tested about the y-axis, the origin, or the x-axis. For function graphs, y-axis symmetry corresponds to even functions and origin symmetry corresponds to odd functions." },
    { title: "Even functions", body: "A function is even when f(-x)=f(x) throughout its domain. Its graph is symmetric about the y-axis; x^2+1 is a typical example." },
    { title: "Odd functions", body: "A function is odd when f(-x)=-f(x). Its graph is symmetric about the origin; x^3-x is a typical example." },
    { title: "Neither even nor odd", body: "If substituting -x gives neither f(x) nor -f(x), the function is neither even nor odd. The lecture uses x^3-1 as an example." },
    { title: "Parent graphs", body: "The lecture reviews familiar parent functions such as y=x, y=|x|, y=√x, y=x^2, y=x^3 and y=1/x so transformations can be recognized from a standard shape." },
    { title: "Vertical translations", body: "For c>0, y=f(x)+c shifts the graph up c units and y=f(x)-c shifts it down c units. The shape is unchanged." },
    { title: "Horizontal translations", body: "For c>0, y=f(x-c) shifts the graph right c units, while y=f(x+c) shifts it left c units. The sign inside the input acts opposite to the direction of motion." },
    { title: "Reflections", body: "The graph of y=-f(x) is the reflection of y=f(x) in the x-axis. The graph of y=f(-x) is the reflection in the y-axis." },
    { title: "Vertical scaling", body: "Multiplying outputs by a constant changes vertical scale. For |a|>1, y=af(x) is vertically stretched; for 0<|a|<1, it is vertically shrunk. A negative a also reflects in the x-axis." },
    { title: "Horizontal scaling", body: "Replacing x by bx changes horizontal scale. Factors with |b|>1 shrink the graph horizontally, while 0<|b|<1 stretches it; a negative b also introduces y-axis reflection." },
  ],
};

export const mat111ExamTopicsPart1: Mat111ExamTopic[] = [
  {
    lessonId: "mat111-week-2", week: 2, topicTitle: "Combinations, Composition and Inverse Functions", order: 1,
    tasks: [
      { prompt: "For f(x)=2x-3 and g(x)=x^2-1, what is (f+g)(x). Show the definition, formula, or reasoning used.", modelAnswer: "x^2+2x-4. For functions f and g with overlapping domains, addition, subtraction and multiplication are done pointwise: (f+g)(x)=f(x)+g(x), (f-g)(x)=f(x)-g(x), and (fg)(x)=f(x)g(x)." },
      { prompt: "For f(x)=2x-3 and g(x)=x^2-1, which values are excluded from the domain of f/g. Show the definition, formula, or reasoning used.", modelAnswer: "x=1 and x=-1. The quotient (f/g)(x)=f(x)/g(x) is defined only where x belongs to both domains and g(x) is not zero. Always carry the denominator restriction into the final domain." },
      { prompt: "What does (f∘g)(x) mean. Show the definition, formula, or reasoning used.", modelAnswer: "f(g(x)). With f(x)=2x-3 and g(x)=x^2-1, form each operation by substitution before simplifying. For the quotient, x=±1 must be excluded because x^2-1=0 there." },
      { prompt: "For f(x)=sqrt(x) and g(x)=x-1, what condition is needed for f∘g. Show the definition, formula, or reasoning used.", modelAnswer: "g(x) must be at least 0. Composition feeds the output of one function into another: (f∘g)(x)=f(g(x)). Order matters, so f∘g and g∘f are generally different functions." },
      { prompt: "If f and g are inverse functions, which relation must hold. Show the definition, formula, or reasoning used.", modelAnswer: "f(g(x))=x and g(f(x))=x. For f∘g, x must first lie in the domain of g, and the value g(x) must then lie in the domain of f. This two-stage check determines the composition domain." },
      { prompt: "What happens to domain and range when taking an inverse. Show the definition, formula, or reasoning used.", modelAnswer: "They interchange. To evaluate (f∘g)(a), calculate g(a) first and then evaluate f at that result. If either stage is undefined, the composition is undefined at a." },
      { prompt: "Which test checks graphically whether a function is one-to-one. Show the definition, formula, or reasoning used.", modelAnswer: "Horizontal line test. Functions f and g are inverses when f(g(x))=x and g(f(x))=x on the relevant domains. The inverse reverses the action of the original function." },
      { prompt: "A function has an inverse function exactly when it is what. Show the definition, formula, or reasoning used.", modelAnswer: "One-to-one. For an inverse pair, the domain of f becomes the range of f⁻¹, and the range of f becomes the domain of f⁻¹. Their graphs are reflections in the line y=x." },
      { prompt: "What is the first algebraic step after writing y=f(x) when finding f^-1. Show the definition, formula, or reasoning used.", modelAnswer: "Interchange x and y. A function has an inverse function exactly when it is one-to-one. A one-to-one function never sends two different inputs to the same output." },
      { prompt: "Are f∘g and g∘f always equal. Show the definition, formula, or reasoning used.", modelAnswer: "No, composition order generally matters. A graph is one-to-one if every horizontal line intersects it at most once. Algebraically, find an inverse by writing y=f(x), interchanging x and y, and solving for y." },
    ],
  },
  {
    lessonId: "mat111-week-3", week: 3, topicTitle: "Properties and Transformations of Graphs", order: 2,
    tasks: [
      { prompt: "Which equation defines an even function. Show the definition, formula, or reasoning used.", modelAnswer: "f(-x)=f(x). Symmetry can be tested about the y-axis, the origin, or the x-axis. For function graphs, y-axis symmetry corresponds to even functions and origin symmetry corresponds to odd functions." },
      { prompt: "Which symmetry corresponds to an odd function. Show the definition, formula, or reasoning used.", modelAnswer: "Symmetry about the origin. A function is even when f(-x)=f(x) throughout its domain. Its graph is symmetric about the y-axis; x^2+1 is a typical example." },
      { prompt: "What type of function is x^3-x. Show the definition, formula, or reasoning used.", modelAnswer: "Odd. A function is odd when f(-x)=-f(x). Its graph is symmetric about the origin; x^3-x is a typical example." },
      { prompt: "What type of function is x^2+1. Show the definition, formula, or reasoning used.", modelAnswer: "Even. If substituting -x gives neither f(x) nor -f(x), the function is neither even nor odd. The lecture uses x^3-1 as an example." },
      { prompt: "For c>0, y=f(x)+c does what. Show the definition, formula, or reasoning used.", modelAnswer: "Shifts the graph up c units. The lecture reviews familiar parent functions such as y=x, y=|x|, y=√x, y=x^2, y=x^3 and y=1/x so transformations can be recognized from a standard shape." },
      { prompt: "For c>0, y=f(x+c) does what. Show the definition, formula, or reasoning used.", modelAnswer: "Shifts the graph left c units. For c>0, y=f(x)+c shifts the graph up c units and y=f(x)-c shifts it down c units. The shape is unchanged." },
      { prompt: "What transformation gives y=-f(x). Show the definition, formula, or reasoning used.", modelAnswer: "Reflection in the x-axis. For c>0, y=f(x-c) shifts the graph right c units, while y=f(x+c) shifts it left c units. The sign inside the input acts opposite to the direction of motion." },
      { prompt: "What transformation gives y=f(-x). Show the definition, formula, or reasoning used.", modelAnswer: "Reflection in the y-axis. The graph of y=-f(x) is the reflection of y=f(x) in the x-axis. The graph of y=f(-x) is the reflection in the y-axis." },
      { prompt: "How does y=3f(x) compare with y=f(x). Show the definition, formula, or reasoning used.", modelAnswer: "Vertical stretch by factor 3. Multiplying outputs by a constant changes vertical scale. For |a|>1, y=af(x) is vertically stretched; for 0<|a|<1, it is vertically shrunk. A negative a also reflects in the x-axis." },
      { prompt: "If g(x)=f((1/2)x), what is the horizontal effect. Show the definition, formula, or reasoning used.", modelAnswer: "Horizontal stretch by factor 2. Replacing x by bx changes horizontal scale. Factors with |b|>1 shrink the graph horizontally, while 0<|b|<1 stretches it; a negative b also introduces y-axis reflection." },
    ],
  },
];
