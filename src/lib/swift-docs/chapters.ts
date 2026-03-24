import { ChapterLink, ChapterSection } from "./types";

export const SWIFT_BOOK_BASE_URL =
  "https://docs.swift.org/swift-book/documentation/the-swift-programming-language";

export const SWIFT_BOOK_DATA_BASE_URL =
  "https://docs.swift.org/swift-book/data/documentation/the-swift-programming-language";

export const CHAPTER_SECTION_TITLES: Record<ChapterSection, string> = {
  welcome: "Welcome to Swift",
  languageGuide: "Language Guide",
  languageReference: "Language Reference",
  revisionHistory: "Revision History",
};

export const CHAPTERS: ChapterLink[] = [
  {
    slug: "aboutswift",
    title: "About Swift",
    description: "Understand the high-level goals of the language.",
    section: "welcome",
  },
  {
    slug: "compatibility",
    title: "Version Compatibility",
    description: "Learn what functionality is available in older language modes.",
    section: "welcome",
  },
  {
    slug: "guidedtour",
    title: "A Swift Tour",
    description: "Explore the features and syntax of Swift.",
    section: "welcome",
  },
  {
    slug: "thebasics",
    title: "The Basics",
    description: "Work with common kinds of data and write basic syntax.",
    section: "languageGuide",
  },
  {
    slug: "basicoperators",
    title: "Basic Operators",
    description: "Perform operations like assignment, arithmetic, and comparison.",
    section: "languageGuide",
  },
  {
    slug: "stringsandcharacters",
    title: "Strings and Characters",
    description: "Store and manipulate text.",
    section: "languageGuide",
  },
  {
    slug: "collectiontypes",
    title: "Collection Types",
    description: "Organize data using arrays, sets, and dictionaries.",
    section: "languageGuide",
  },
  {
    slug: "controlflow",
    title: "Control Flow",
    description: "Structure code with branches, loops, and early exits.",
    section: "languageGuide",
  },
  {
    slug: "functions",
    title: "Functions",
    description: "Define and call functions, label their arguments, and use return values.",
    section: "languageGuide",
  },
  {
    slug: "closures",
    title: "Closures",
    description: "Group code that executes together without creating a named function.",
    section: "languageGuide",
  },
  {
    slug: "enumerations",
    title: "Enumerations",
    description: "Model custom types that define a list of possible values.",
    section: "languageGuide",
  },
  {
    slug: "classesandstructures",
    title: "Structures and Classes",
    description: "Model custom types that encapsulate data.",
    section: "languageGuide",
  },
  {
    slug: "properties",
    title: "Properties",
    description: "Access stored and computed values that are part of an instance or type.",
    section: "languageGuide",
  },
  {
    slug: "methods",
    title: "Methods",
    description: "Define and call functions that are part of an instance or type.",
    section: "languageGuide",
  },
  {
    slug: "subscripts",
    title: "Subscripts",
    description: "Access the elements of a collection.",
    section: "languageGuide",
  },
  {
    slug: "inheritance",
    title: "Inheritance",
    description: "Subclass to add or override functionality.",
    section: "languageGuide",
  },
  {
    slug: "initialization",
    title: "Initialization",
    description: "Set initial values for stored properties and perform one-time setup.",
    section: "languageGuide",
  },
  {
    slug: "deinitialization",
    title: "Deinitialization",
    description: "Release resources that require custom cleanup.",
    section: "languageGuide",
  },
  {
    slug: "optionalchaining",
    title: "Optional Chaining",
    description: "Access members of an optional value without unwrapping.",
    section: "languageGuide",
  },
  {
    slug: "errorhandling",
    title: "Error Handling",
    description: "Respond to and recover from errors.",
    section: "languageGuide",
  },
  {
    slug: "concurrency",
    title: "Concurrency",
    description: "Perform asynchronous operations.",
    section: "languageGuide",
  },
  {
    slug: "macros",
    title: "Macros",
    description: "Use macros to generate code at compile time.",
    section: "languageGuide",
  },
  {
    slug: "typecasting",
    title: "Type Casting",
    description: "Determine a value’s runtime type and give it more specific type info.",
    section: "languageGuide",
  },
  {
    slug: "nestedtypes",
    title: "Nested Types",
    description: "Define types inside the scope of another type.",
    section: "languageGuide",
  },
  {
    slug: "extensions",
    title: "Extensions",
    description: "Add functionality to an existing type.",
    section: "languageGuide",
  },
  {
    slug: "protocols",
    title: "Protocols",
    description: "Define requirements that conforming types must implement.",
    section: "languageGuide",
  },
  {
    slug: "generics",
    title: "Generics",
    description: "Write code that works for multiple types and constrain requirements.",
    section: "languageGuide",
  },
  {
    slug: "opaquetypes",
    title: "Opaque and Boxed Protocol Types",
    description: "Hide implementation details about a value’s type.",
    section: "languageGuide",
  },
  {
    slug: "automaticreferencecounting",
    title: "Automatic Reference Counting",
    description: "Model the lifetime of objects and their relationships.",
    section: "languageGuide",
  },
  {
    slug: "memorysafety",
    title: "Memory Safety",
    description: "Structure your code to avoid conflicts when accessing memory.",
    section: "languageGuide",
  },
  {
    slug: "accesscontrol",
    title: "Access Control",
    description: "Manage code visibility by declaration, file, and module.",
    section: "languageGuide",
  },
  {
    slug: "advancedoperators",
    title: "Advanced Operators",
    description: "Define custom operators and perform advanced bitwise operations.",
    section: "languageGuide",
  },
  {
    slug: "aboutthelanguagereference",
    title: "About the Language Reference",
    description: "Read the notation that the formal grammar uses.",
    section: "languageReference",
  },
  {
    slug: "lexicalstructure",
    title: "Lexical Structure",
    description: "Use the lowest-level components of the syntax.",
    section: "languageReference",
  },
  {
    slug: "types",
    title: "Types",
    description: "Use built-in named and compound types.",
    section: "languageReference",
  },
  {
    slug: "expressions",
    title: "Expressions",
    description: "Access, modify, and assign values.",
    section: "languageReference",
  },
  {
    slug: "statements",
    title: "Statements",
    description: "Group expressions and control the flow of execution.",
    section: "languageReference",
  },
  {
    slug: "declarations",
    title: "Declarations",
    description: "Introduce types, operators, variables, and other language constructs.",
    section: "languageReference",
  },
  {
    slug: "attributes",
    title: "Attributes",
    description: "Add metadata to declarations and types.",
    section: "languageReference",
  },
  {
    slug: "patterns",
    title: "Patterns",
    description: "Match and destructure values.",
    section: "languageReference",
  },
  {
    slug: "genericparametersandarguments",
    title: "Generic Parameters and Arguments",
    description: "Generalize declarations to abstract away concrete types.",
    section: "languageReference",
  },
  {
    slug: "summaryofthegrammar",
    title: "Summary of the Grammar",
    description: "Read the full formal grammar.",
    section: "languageReference",
  },
  {
    slug: "revisionhistory",
    title: "Document Revision History",
    description: "Review recent changes to this book.",
    section: "revisionHistory",
  },
];

export const CHAPTER_SECTIONS: ChapterSection[] = [
  "welcome",
  "languageGuide",
  "languageReference",
  "revisionHistory",
];

export function getChapterBySlug(slug: string) {
  return CHAPTERS.find((chapter) => chapter.slug === slug) ?? null;
}

export function buildChapterUrl(slug: string) {
  return `${SWIFT_BOOK_BASE_URL}/${slug}`;
}

export function buildChapterDataUrl(slug: string) {
  return `${SWIFT_BOOK_DATA_BASE_URL}/${slug}.json`;
}

export function getChaptersBySection(section: ChapterSection) {
  return CHAPTERS.filter((chapter) => chapter.section === section);
}
