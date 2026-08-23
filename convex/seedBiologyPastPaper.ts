import { internalMutationGeneric } from "convex/server";

const course = {
  stableId: "bgcse-biology",
  slug: "bgcse-biology",
  title: "BGCSE Biology",
  description: "Botswana General Certificate of Secondary Education Biology revision with topics, quizzes and past papers.",
  subject: "Biology",
  level: "Intermediate",
  duration: "Self-paced",
  accent: "from-emerald-500/15 via-teal-500/10 to-cyan-500/10",
  accessLevel: "free" as const,
  reviewStatus: "published" as const,
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
  description: "BGCSE Biology Paper 3. This learner version preserves the 2019 paper structure in a mobile-friendly reveal-answer format.",
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
    modelAnswer: "(a) Use the labelled arrows on the original figure to identify the structures. In the common fungal-cell diagram these labels indicate major cell structures such as the nucleus and cell wall; check the arrow positions before committing to a label.\n\n(b) Similarities: both have a cell membrane and cytoplasm; both also possess a cell wall. Differences: a fungal cell has a true nucleus whereas a bacterium has no membrane-bound nucleus; fungal cell walls contain chitin while bacterial walls are made mainly of peptidoglycan.\n\n(c) Fungi use saprotrophic nutrition: they secrete extracellular digestive enzymes onto organic material, digest large insoluble molecules outside the body, then absorb the soluble products.",
    explanation: "The key comparison is prokaryote versus eukaryote. For fungal nutrition, marks normally come from extracellular enzyme secretion, external digestion and absorption of soluble products.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q2",
    questionNumber: "2",
    marks: 7,
    order: 2,
    prompt: "A diagram shows the left side of a human heart and labels valve X.\n\n(a) Name valve X and explain how the body would be affected if it failed to close properly.\n(b) Suggest two advantages of double circulation.",
    modelAnswer: "(a) Valve X is the bicuspid (mitral) valve between the left atrium and left ventricle. If it does not close, some blood flows back into the atrium during ventricular contraction. Less blood is pumped into the aorta, so tissues receive less oxygen and glucose. Aerobic respiration and energy release are reduced, causing tiredness and reduced exercise capacity; the heart may compensate by working harder.\n\n(b) Double circulation keeps oxygenated and deoxygenated blood separate and allows high pressure to the body while maintaining lower pressure through the lungs. This gives rapid delivery of oxygen without damaging delicate lung capillaries.",
    explanation: "A valve prevents backflow. The consequences follow from reduced cardiac output and reduced oxygen delivery. Double circulation also permits different pressures in pulmonary and systemic circuits.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q3",
    questionNumber: "3",
    marks: 7,
    order: 3,
    prompt: "A diagram shows the male reproductive system.\n\n(a) Name the structure labelled S and state its function.\n(b) Identify the structure where meiosis occurs and explain why meiosis is important in reproduction.\n(c) Distinguish between prophase of mitosis and prophase I of meiosis.",
    modelAnswer: "(a) Use the original diagram arrow for S; the function must match the labelled organ.\n\n(b) Meiosis occurs in the testes, in the seminiferous tubules where sperm are formed. Meiosis halves the chromosome number to produce haploid gametes so fertilisation restores the diploid number, and it creates genetic variation through crossing over and independent assortment.\n\n(c) In mitotic prophase homologous chromosomes do not pair and crossing over does not normally occur. In prophase I of meiosis homologous chromosomes pair to form bivalents and crossing over can occur between non-sister chromatids.",
    explanation: "The central concepts are reduction division and variation. The distinctive event in prophase I is synapsis of homologous chromosomes, with crossing over.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q4",
    questionNumber: "4",
    marks: 7,
    order: 4,
    prompt: "Yeast and glucose solution are mixed and divided into equal samples. The samples are kept for 30 minutes at 2°C, 25°C and 60°C. The amount of froth differs between temperatures.\n\n(a) Explain the difference between the results at 2°C and 25°C.\n(b) The 60°C sample is moved to 25°C for another 30 minutes. Predict what happens and explain why.",
    modelAnswer: "(a) At 25°C the yeast enzymes have more kinetic energy and enzyme-substrate collisions occur more frequently, so respiration/fermentation proceeds faster. More carbon dioxide is produced, giving more froth. At 2°C enzyme activity is much slower, so less carbon dioxide and less froth are produced.\n\n(b) Little or no new froth will be produced after the 60°C sample is moved to 25°C. The high temperature has denatured essential yeast enzymes and may have killed the yeast cells. Cooling does not restore the original enzyme shape, so respiration does not recover normally.",
    explanation: "Low temperature slows enzyme-controlled reactions but is usually reversible. Very high temperature denatures proteins, which is generally irreversible.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q5",
    questionNumber: "5",
    marks: 11,
    order: 5,
    prompt: "A graph shows the adrenaline level in a girl's blood after she is frightened by a dog. She runs away and reaches home after 20 minutes.\n\n(a) Describe the graph between 0 and 15 minutes.\n(b) Explain how the rise in adrenaline prepares her for running.\n(c) Name the organs mainly responsible for destroying spent adrenaline and removing its products from the blood.",
    modelAnswer: "(a) The adrenaline level rises rapidly from the starting level to a peak, then falls progressively toward the normal level during the next several minutes.\n\n(b) Adrenaline increases heart rate and cardiac output, increases breathing rate and ventilation, dilates airways, redirects more blood to skeletal muscles, and stimulates conversion of glycogen to glucose. These changes increase oxygen and glucose delivery to muscles and therefore increase the rate of aerobic respiration and ATP production for contraction.\n\n(c) The liver is the main organ involved in breaking down spent adrenaline; the kidneys remove soluble waste products from the blood for excretion in urine.",
    explanation: "This is the fight-or-flight response. Link every physiological change to increased oxygen/glucose supply or faster respiration in working muscle.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q6",
    questionNumber: "6",
    marks: 15,
    order: 6,
    prompt: "Section B. A diagram shows an asexual reproduction method used in commercial plant farming.\n\n(a) Name the method and describe disadvantages of using this kind of asexual propagation on a large scale.\n(b) Describe and explain how magnesium deficiency in soil would affect development of the plant.\n(c) Flowers have adaptations for attracting pollinators such as bees. Explain how heavy air pollution could interfere with pollination.",
    modelAnswer: "(a) Use the original figure to identify the exact propagation method (for example a cutting, grafting or another vegetative technique). The major disadvantage of asexual propagation is that offspring are genetically very similar or clones. A disease, pest or environmental change to which one plant is susceptible can therefore affect most or all of the crop. There is little genetic variation for natural selection or future breeding, and pathogens may also be transferred with vegetative material.\n\n(b) Magnesium is required to make chlorophyll. Deficiency causes chlorosis, especially yellowing between leaf veins, reducing chlorophyll content and light absorption. Photosynthesis falls, less glucose is made, and therefore less carbohydrate is available for respiration and synthesis of new biomass. Growth becomes slow and plants may be stunted with lower yield.\n\n(c) Pollution can mask floral scents and reduce visual signals, damage petals or nectar-producing tissues, and harm or repel pollinating insects. Particles may coat pollen or stigmas and reduce pollen transfer or germination. A reduced pollinator population or fewer visits lowers the chance that pollen reaches a compatible stigma, so fertilisation, seed formation and fruit production fall.",
    explanation: "For magnesium, follow the chain magnesium → chlorophyll → photosynthesis → glucose/biomass. For pollution, explain mechanisms that reduce pollinator attraction, survival or successful pollen transfer.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q7",
    questionNumber: "7",
    marks: 15,
    order: 7,
    prompt: "Section B.\n\n(a) Distinguish continuous from discontinuous variation and give one example of each other than blood group.\n(b) A family has individuals with blood groups A, B, AB and O. Use the stated family relationships in the source paper to construct a pedigree. Given that the daughter's genotype is IᴬIᴼ, determine the two possible genotypes of her mother.\n(c) A man with genotype IᴬIᴼ has children with a woman of blood group AB. Use a genetic cross to determine all possible blood groups of their children.",
    modelAnswer: "(a) Continuous variation shows a range of intermediate values and is usually influenced by many genes plus the environment; examples include height or body mass. Discontinuous variation falls into distinct categories with no intermediates and is usually controlled by one or a few genes; examples include biological sex in a simple school-level classification, tongue-rolling phenotype, or ability to taste PTC.\n\n(b) Use the family relationships in the paper to draw the pedigree with standard male/female symbols and blood-group labels. If the daughter is IᴬIᴼ, her mother must supply either Iᴬ or Iᴼ depending on the allele inherited from the father. The family blood groups constrain the mother to genotypes consistent with producing children of A, B and AB phenotypes; work allele-by-allele from each child rather than phenotype alone.\n\n(c) Father IᴬIᴼ produces gametes Iᴬ and Iᴼ. Mother IᴬIᴮ produces gametes Iᴬ and Iᴮ. Offspring genotypes: IᴬIᴬ (group A), IᴬIᴮ (group AB), IᴬIᴼ (group A), and IᴮIᴼ (group B). Therefore possible phenotypes are A, AB and B, with probabilities A 1/2, AB 1/4 and B 1/4; group O is not possible.",
    explanation: "ABO inheritance uses three alleles: Iᴬ and Iᴮ are codominant, while Iᴼ is recessive. A Punnett square makes part (c) straightforward. Part (b) should be solved directly from the pedigree relationships and allele contributions.",
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
        await ctx.db.patch(existingQuestion._id, {
          ...question,
          paperStableId: paper.stableId,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("pastPaperQuestions", {
          ...question,
          paperStableId: paper.stableId,
          updatedAt: now,
        });
      }
    }

    return {
      courseStableId: course.stableId,
      paperStableId: paper.stableId,
      questionCount: questions.length,
    };
  },
});
