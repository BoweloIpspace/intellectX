import { internalMutationGeneric } from "convex/server";

const course = {
  stableId: "bgcse-biology",
  slug: "bgcse-biology",
  title: "BGCSE Biology",
  description: "Botswana General Certificate of Secondary Education Biology revision with past-paper practice.",
  subject: "Biology",
  level: "BGCSE",
  duration: "Self-paced",
  accent: "from-emerald-500/15 via-teal-500/10 to-cyan-500/10",
  accessLevel: "free" as const,
  reviewStatus: "approved" as const,
  publicationStatus: "published" as const,
  seedManaged: true,
};

const paper = {
  stableId: "bgcse-biology-2019-paper-3",
  courseStableId: course.stableId,
  title: "2019 Paper 3",
  year: 2019,
  paperCode: "0572/03",
  session: "October/November 2019",
  description: "BGCSE Biology Paper 3 in question-by-question reveal-answer mode.",
  estimatedTime: "1 hour 15 minutes",
  accessLevel: "free" as const,
  published: true,
  order: 1,
};

const questions = [
  {
    stableId: "bgcse-bio-2019-p3-q1",
    questionNumber: "1",
    marks: 8,
    order: 1,
    prompt: "A diagram shows part of a fungus, including a food granule.\n\n(a) Identify the two labelled structures in the fungal cell.\n(b) State two similarities and two differences between the fungus shown and a bacterium.\n(c) Describe the mode of nutrition used by fungi.",
    modelAnswer: "(a) This sub-question depends on the labelled arrows in the original paper figure; use the figure to identify the two structures.\n\n(b) Similarities include a cell membrane, cytoplasm and a cell wall. Differences include that a fungal cell has a membrane-bound nucleus whereas a bacterium does not, and their cell-wall composition differs.\n\n(c) Fungi use saprotrophic nutrition: digestive enzymes are secreted onto organic material, digestion occurs outside the organism, and soluble products are absorbed.",
    explanation: "For (b), compare a eukaryotic fungal cell with a prokaryotic bacterial cell. For (c), the scoring chain is extracellular enzyme secretion, external digestion and absorption.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q2",
    questionNumber: "2",
    marks: 7,
    order: 2,
    prompt: "A diagram shows the left side of a human heart and labels valve X.\n\n(a) Name valve X and explain how the body would be affected if it failed to close properly.\n(b) Suggest two advantages of double circulation.",
    modelAnswer: "(a) The name of valve X must be read from its position in the original figure. If the valve fails to close, blood flows backwards during contraction, reducing forward cardiac output. Less oxygen and glucose reach tissues, reducing aerobic respiration and exercise capacity.\n\n(b) Double circulation keeps oxygenated and deoxygenated blood separate and allows different pressures in the pulmonary and systemic circuits, giving efficient delivery to the body while protecting lung capillaries.",
    explanation: "The core idea is that valves prevent backflow. Trace the effect of leakage through reduced forward blood flow and therefore reduced oxygen delivery.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q3",
    questionNumber: "3",
    marks: 7,
    order: 3,
    prompt: "A diagram shows the male reproductive system.\n\n(a) Name the structure labelled S and state its function.\n(b) Identify the structure where meiosis occurs and explain why meiosis is important in reproduction.\n(c) Distinguish between prophase of mitosis and prophase I of meiosis.",
    modelAnswer: "(a) This sub-question depends on the arrow labelled S in the original figure; identify the organ from that figure and state its matching function.\n\n(b) Meiosis occurs in the testes during sperm formation. It halves the chromosome number to form haploid gametes so fertilisation can restore the diploid number, and it contributes to genetic variation.\n\n(c) Homologous chromosomes do not pair in mitotic prophase. In prophase I of meiosis homologous chromosomes pair as bivalents and crossing over can occur.",
    explanation: "The distinctive events in prophase I are pairing of homologous chromosomes and possible crossing over.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q4",
    questionNumber: "4",
    marks: 7,
    order: 4,
    prompt: "Yeast and glucose solution are mixed and divided into equal samples. The samples are kept for 30 minutes at 2°C, 25°C and 60°C. The amount of froth differs between temperatures.\n\n(a) Explain the difference between the results at 2°C and 25°C.\n(b) The 60°C sample is moved to 25°C for another 30 minutes. Predict what happens and explain why.",
    modelAnswer: "(a) At 25°C enzyme-controlled respiration proceeds faster than at 2°C because particles have more kinetic energy and successful collisions occur more often. More carbon dioxide is produced, so more froth forms.\n\n(b) Little or no new froth is expected after the 60°C sample is cooled. The high temperature denatures essential enzymes and may kill the yeast cells; cooling does not restore denatured enzyme shape.",
    explanation: "Low temperature slows enzyme activity and is generally reversible. High temperature can denature enzymes irreversibly.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q5",
    questionNumber: "5",
    marks: 11,
    order: 5,
    prompt: "A graph shows the adrenaline level in a girl's blood after she is frightened by a dog. She runs away and reaches home after 20 minutes.\n\n(a) Describe the graph between 0 and 15 minutes.\n(b) Explain how the rise in adrenaline prepares her for running.\n(c) Name the organs mainly responsible for destroying spent adrenaline and removing its products from the blood.",
    modelAnswer: "(a) Use the plotted values in the original graph: describe the initial rise to a maximum and the subsequent fall, quoting values or times where the graph supplies them.\n\n(b) Adrenaline raises heart rate and ventilation, increases blood flow to skeletal muscles and promotes release of glucose. This increases oxygen and glucose delivery and therefore ATP production for muscle contraction.\n\n(c) The liver breaks down adrenaline and the kidneys remove soluble waste products from the blood for excretion.",
    explanation: "For graph questions, describe only what is plotted and quote the graph where possible. For fight-or-flight, link each change to increased respiration in working muscle.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q6",
    questionNumber: "6",
    marks: 15,
    order: 6,
    prompt: "Section B. A diagram shows an asexual reproduction method used in commercial plant farming.\n\n(a) Name the method and describe disadvantages of using this kind of asexual propagation on a large scale.\n(b) Describe and explain how magnesium deficiency in soil would affect development of the plant.\n(c) Flowers have adaptations for attracting pollinators such as bees. Explain how heavy air pollution could interfere with pollination.",
    modelAnswer: "(a) The exact propagation method must be identified from the original figure. A major disadvantage of large-scale asexual propagation is low genetic variation: genetically similar plants may all be susceptible to the same disease, pest or environmental change. Pathogens can also be carried with vegetative material.\n\n(b) Magnesium is needed to make chlorophyll. Deficiency causes chlorosis, reduces light absorption and lowers photosynthesis. Less glucose is produced for respiration and biomass formation, so growth and yield fall.\n\n(c) Pollution can reduce floral scent or visibility, damage flowers, harm or repel pollinators, and interfere with pollen transfer or germination. Fewer successful pollinator visits reduce fertilisation and seed or fruit production.",
    explanation: "For magnesium, follow magnesium → chlorophyll → photosynthesis → glucose → growth. For pollution, explain a mechanism that reduces attraction, pollinator survival or successful pollen transfer.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q7",
    questionNumber: "7",
    marks: 15,
    order: 7,
    prompt: "Section B.\n\n(a) Distinguish continuous from discontinuous variation and give one example of each other than blood group.\n(b) A family has individuals with blood groups A, B, AB and O. Use the stated family relationships in the source paper to construct a pedigree. Given that the daughter's genotype is IᴬIᴼ, determine the two possible genotypes of her mother.\n(c) A man with genotype IᴬIᴼ has children with a woman of blood group AB. Use a genetic cross to determine all possible blood groups of their children.",
    modelAnswer: "(a) Continuous variation forms a range with intermediate values, for example height. Discontinuous variation falls into distinct categories with no intermediates, for example tongue-rolling phenotype in the school-level model.\n\n(b) This part depends on the exact family relationships shown in the original paper. Construct the pedigree from those relationships and use allele inheritance from each parent to determine the mother's two possible genotypes.\n\n(c) Father IᴬIᴼ produces gametes Iᴬ and Iᴼ. Mother IᴬIᴮ produces gametes Iᴬ and Iᴮ. Offspring can be IᴬIᴬ (A), IᴬIᴮ (AB), IᴬIᴼ (A) or IᴮIᴼ (B). Possible blood groups are therefore A, AB and B; group O is not possible.",
    explanation: "ABO inheritance uses three alleles: Iᴬ and Iᴮ are codominant and Iᴼ is recessive. The pedigree part must be solved from the relationships in the original figure rather than guessed from phenotype alone.",
  },
];

export const seed = internalMutationGeneric({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const existingCourse = await ctx.db
      .query("courses")
      .withIndex("by_stable_id", (q: any) => q.eq("stableId", course.stableId))
      .first();

    if (existingCourse) {
      await ctx.db.patch(existingCourse._id, { ...course, updatedAt: now });
    } else {
      await ctx.db.insert("courses", { ...course, updatedAt: now });
    }

    const existingPaper = await ctx.db
      .query("pastPapers")
      .withIndex("by_stable_id", (q: any) => q.eq("stableId", paper.stableId))
      .first();

    if (existingPaper) {
      await ctx.db.patch(existingPaper._id, { ...paper, updatedAt: now });
    } else {
      await ctx.db.insert("pastPapers", { ...paper, updatedAt: now });
    }

    for (const question of questions) {
      const existingQuestion = await ctx.db
        .query("pastPaperQuestions")
        .withIndex("by_stable_id", (q: any) => q.eq("stableId", question.stableId))
        .first();

      if (existingQuestion) {
        await ctx.db.patch(existingQuestion._id, { ...question, paperStableId: paper.stableId, updatedAt: now });
      } else {
        await ctx.db.insert("pastPaperQuestions", { ...question, paperStableId: paper.stableId, updatedAt: now });
      }
    }

    return {
      courseStableId: course.stableId,
      paperStableId: paper.stableId,
      questionCount: questions.length,
    };
  },
});
