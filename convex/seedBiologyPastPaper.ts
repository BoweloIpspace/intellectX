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
  description:
    "Source-aligned BGCSE Biology Paper 3 practice edition. Question facts and mark totals follow the 2019 paper; IntellectX uses original reconstructed study visuals rather than reproducing the examination artwork.",
  estimatedTime: "1 hour 15 minutes",
  totalMarks: 70,
  pageCount: 8,
  accessLevel: "free" as const,
  published: true,
  order: 1,
};

const questions = [
  {
    stableId: "bgcse-bio-2019-p3-q1",
    questionNumber: "1",
    sectionLabel: "Section A",
    marks: 8,
    order: 1,
    stimulusTitle: "Fungal structure",
    stimulusText:
      "Use the reconstructed study diagram. Q points to a rounded structure inside the fungal cell, R points to the outer boundary, and a food granule is shown inside the cell.",
    stimulusAssetPath: "/past-papers/bgcse-biology/2019-paper-3/q1-fungus.svg",
    stimulusAssetAlt:
      "Branching fungal hypha with a rounded cell. Q points to the nucleus, R points to the outer cell wall, and a food granule is shown inside the cell.",
    stimulusSourceStatus: "reconstructed-visual" as const,
    prompt:
      "(a) Identify the structures labelled Q and R.\n(b) Give two similarities and two differences between the fungus and a bacterium.\n(c) Describe how fungi obtain nutrients.",
    modelAnswer:
      "(a) Q: nucleus. R: cell wall.\n\n(b) Similarities: both have a cell membrane, cytoplasm and a cell wall (any two suitable similarities). Differences: the fungus has a membrane-bound nucleus whereas a bacterium has no true nucleus; the fungal wall contains chitin whereas the bacterial wall contains peptidoglycan/murein. A further valid difference is that fungal cells have membrane-bound organelles such as mitochondria whereas bacteria do not.\n\n(c) Fungi use saprotrophic nutrition. They secrete digestive enzymes onto organic material, digest it outside the organism, then absorb the soluble products.",
    explanation:
      "The visual-identification part is now answerable from the reconstructed diagram instead of referring the learner back to a missing paper figure. The nutrition sequence to remember is enzyme secretion → extracellular digestion → absorption.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q2",
    questionNumber: "2",
    sectionLabel: "Section A",
    marks: 7,
    order: 2,
    stimulusTitle: "Left side of the heart",
    stimulusText:
      "In the reconstructed study diagram, X marks the valve between the left atrium and left ventricle. The aorta leaves the left ventricle.",
    stimulusAssetPath: "/past-papers/bgcse-biology/2019-paper-3/q2-left-heart.svg",
    stimulusAssetAlt:
      "Left atrium above the left ventricle, with valve X between the two chambers and the aorta leaving the ventricle.",
    stimulusSourceStatus: "reconstructed-visual" as const,
    prompt:
      "(a) Name valve X. Describe and explain how the body would be affected if this valve failed to close properly.\n(b) Suggest two advantages of double circulation.",
    modelAnswer:
      "(a) X is the bicuspid (mitral) valve. If it does not close properly when the ventricle contracts, some blood flows back into the left atrium instead of entering the aorta. This reduces forward cardiac output, so tissues receive less oxygen and glucose and can carry out less aerobic respiration, especially during exercise.\n\n(b) The systemic circuit can operate at a relatively high pressure for rapid delivery around the body while the pulmonary circuit remains at a lower pressure that protects lung capillaries. Oxygenated blood returning from the lungs is also kept separate from deoxygenated blood before systemic delivery.",
    explanation:
      "Valve X is identified by position: the atrioventricular valve on the left side is the bicuspid/mitral valve. For valve failure, trace the consequence from backflow → lower forward output → lower oxygen delivery → reduced aerobic respiration.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q3",
    questionNumber: "3",
    sectionLabel: "Section A",
    marks: 7,
    order: 3,
    stimulusTitle: "Male reproductive system",
    stimulusText:
      "The source paper uses a labelled male reproductive-system diagram. IntellectX provides an original study reconstruction rather than a facsimile: S marks the narrow tube running upward from a testis, and V marks the oval organ in the scrotum.",
    stimulusAssetPath: "/past-papers/bgcse-biology/2019-paper-3/q3-male-reproductive.svg",
    stimulusAssetAlt:
      "Side-view male reproductive-system study diagram. S points to the narrow tube running upward from a testis; T points to a gland behind the bladder; U points to the gland below the bladder; V points to the oval organ in the scrotum.",
    stimulusSourceStatus: "reconstructed-visual" as const,
    prompt:
      "(a) In the study diagram, name S and state its function.\n(b) Which labelled structure is where meiosis occurs? Explain why meiosis is important in reproduction.\n(c) Distinguish prophase of mitosis from prophase I of meiosis.",
    modelAnswer:
      "(a) S is the sperm duct (vas deferens). It carries sperm from the testis/epididymis towards the urethra.\n\n(b) V, the testis. Meiosis makes haploid gametes so fertilisation can restore the diploid chromosome number; it also contributes to genetic variation.\n\n(c) In mitotic prophase homologous chromosomes do not pair. In prophase I of meiosis homologous chromosomes pair as bivalents and crossing over can occur.",
    explanation:
      "This diagram is an IntellectX reconstruction because a reliable reusable copy of the source artwork was not established. It preserves the assessed biology concepts while making the digital question independently answerable.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q4",
    questionNumber: "4",
    sectionLabel: "Section A",
    marks: 7,
    order: 4,
    stimulusTitle: "Yeast respiration at different temperatures",
    stimulusText:
      "Equal yeast-and-glucose samples were kept for 30 minutes at 2°C, 25°C and 60°C. The study reconstruction shows little froth at 2°C, much more froth at 25°C, and no visible froth at 60°C.",
    stimulusAssetPath: "/past-papers/bgcse-biology/2019-paper-3/q4-yeast-temperature.svg",
    stimulusAssetAlt:
      "Three equal yeast and glucose samples after 30 minutes: a small froth layer at 2 degrees Celsius, a much larger froth layer at 25 degrees Celsius, and no visible froth at 60 degrees Celsius.",
    stimulusSourceStatus: "reconstructed-visual" as const,
    prompt:
      "(a) Explain the difference between the 2°C and 25°C results.\n(b) The 60°C sample is then kept at 25°C for another 30 minutes. Predict what will happen and explain why.",
    modelAnswer:
      "(a) At 25°C, enzyme-controlled respiration is faster than at 2°C. Molecules have more kinetic energy, so enzyme-substrate collisions occur more frequently and more carbon dioxide is produced, giving more froth. At 2°C respiration is slowed but the enzymes are not permanently damaged.\n\n(b) Little or no new froth is expected. At 60°C essential enzymes are denatured and the yeast cells may be killed. Cooling to 25°C does not restore the three-dimensional shape of denatured enzymes.",
    explanation:
      "Cold conditions slow enzyme-controlled reactions and the effect is usually reversible. Excessive heat can denature enzymes irreversibly. Froth is evidence of carbon dioxide released during yeast respiration/fermentation.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q5",
    questionNumber: "5",
    sectionLabel: "Section A",
    marks: 11,
    order: 5,
    stimulusTitle: "Adrenaline after a fright",
    stimulusText:
      "A girl is frightened by a dog, runs away, and reaches home after 20 minutes. The reconstructed qualitative graph shows adrenaline rising rapidly to a peak before 10 minutes and then falling through 15 and 20 minutes.",
    stimulusAssetPath: "/past-papers/bgcse-biology/2019-paper-3/q5-adrenaline-graph.svg",
    stimulusAssetAlt:
      "Qualitative adrenaline graph from 0 to 20 minutes: rapid rise after the fright, a peak before 10 minutes, then a decline through 15 and 20 minutes.",
    stimulusSourceStatus: "reconstructed-visual" as const,
    prompt:
      "(a) Describe the shape of the graph from 0 to 15 minutes.\n(b) Explain how the early rise in adrenaline prepares the girl for running.\n(c) Name the organs mainly responsible for destroying spent adrenaline and removing its breakdown products from the blood.",
    modelAnswer:
      "(a) The adrenaline level rises rapidly from its initial level to a maximum, then decreases by 15 minutes.\n\n(b) Adrenaline increases heart rate and ventilation, redirects/increases blood flow to skeletal muscles and promotes release of glucose into the blood. More oxygen and glucose reach working muscles, increasing aerobic respiration and ATP supply for contraction.\n\n(c) Liver: breakdown/destruction of spent adrenaline. Kidneys: removal of soluble breakdown products from the blood for excretion.",
    explanation:
      "For the graph, describe only the trend that is shown. For fight-or-flight, link each physiological response to faster delivery of oxygen/glucose and therefore greater energy release in working muscle.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q6",
    questionNumber: "6",
    sectionLabel: "Section B",
    marks: 15,
    order: 6,
    stimulusTitle: "Commercial vegetative propagation",
    stimulusText:
      "The source paper assesses identification of an asexual plant-propagation method from a figure. The original figure could not be independently verified for reusable digital reproduction, so this IntellectX study reconstruction uses a stem cutting: a stem section from a parent plant is placed in moist growing medium and develops roots.",
    stimulusAssetPath: "/past-papers/bgcse-biology/2019-paper-3/q6-vegetative-propagation.svg",
    stimulusAssetAlt:
      "A stem section with leaves is taken from a parent plant, inserted into moist growing medium, forms new roots and develops into a new plant.",
    stimulusSourceStatus: "reconstructed-visual" as const,
    prompt:
      "(a) Name the asexual propagation method shown in the study reconstruction and describe disadvantages of using this kind of clonal propagation on a large scale.\n(b) Describe and explain how magnesium deficiency in soil would affect the plant's development.\n(c) Explain how heavy air pollution could interfere with insect pollination of flowers.",
    modelAnswer:
      "(a) Stem cutting (vegetative propagation). Large-scale asexual propagation produces genetically very similar or identical plants, so a disease, pest or environmental change to which one is susceptible may affect many plants. Infected source material can also spread pathogens through the crop.\n\n(b) Magnesium is required to make chlorophyll. Deficiency causes reduced chlorophyll/chlorosis, so less light is absorbed and photosynthesis decreases. Less glucose is made for respiration and production of new biomass, so growth, leaf development and yield are reduced.\n\n(c) Pollution can mask or alter floral scent and visibility, coat or damage flower surfaces/pollen, harm or repel pollinating insects, or reduce pollen germination/transfer. Fewer effective pollinator visits mean less pollination, fertilisation, seed formation and fruit production.",
    explanation:
      "The Q6 source artwork was not treated as verified, reusable content. The reconstruction is explicitly labelled so learners are not misled into thinking it is a facsimile. The core syllabus chain for magnesium is magnesium → chlorophyll → photosynthesis → glucose → growth.",
  },
  {
    stableId: "bgcse-bio-2019-p3-q7",
    questionNumber: "7",
    sectionLabel: "Section B",
    marks: 15,
    order: 7,
    stimulusTitle: "ABO family information",
    stimulusText:
      "A blood-group-B father and an unspecified mother have three sons with blood groups A, B and AB, plus a daughter. That daughter has genotype IᴬIᴼ, marries a blood-group-B man, and they have two sons with blood groups AB and O. The blood-group-A son has genotype IᴬIᴼ and later has children with a blood-group-AB woman.",
    stimulusSourceStatus: "source-text" as const,
    prompt:
      "(a) Distinguish continuous from discontinuous variation and give one example of each other than blood group.\n(b) Use the family information above to construct a pedigree. Determine the two possible genotypes of the first-generation mother.\n(c) For the IᴬIᴼ man and the blood-group-AB woman, use a genetic cross to determine all possible blood groups of their children.",
    modelAnswer:
      "(a) Continuous variation shows a range with intermediate values, for example height or body mass. Discontinuous variation has distinct categories with no intermediates, for example biological sex in the simplified school-level model or ability to roll the tongue.\n\n(b) The pedigree should show the blood-group-B father and the mother as a couple, their sons A, B and AB plus their daughter, then the daughter with a blood-group-B partner and their sons AB and O. Because the daughter is IᴬIᴼ, the mother must be able to supply Iᴬ. The family can be produced if the mother is IᴬIᴼ (group A) or IᴬIᴮ (group AB).\n\n(c) Father IᴬIᴼ produces gametes Iᴬ and Iᴼ. Mother IᴬIᴮ produces gametes Iᴬ and Iᴮ. Possible offspring are IᴬIᴬ (A), IᴬIᴮ (AB), IᴬIᴼ (A) and IᴮIᴼ (B). Possible blood groups are A, AB and B; O is not possible.",
    explanation:
      "ABO inheritance has three alleles. Iᴬ and Iᴮ are codominant; Iᴼ is recessive. The complete family relationships are now included in the digital question, so the pedigree and genotype parts no longer depend on missing source text.",
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
      totalMarks: questions.reduce((total, question) => total + question.marks, 0),
    };
  },
});
