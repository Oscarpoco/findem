export interface ModuleContent {
  topics: string[];
  explanations: string;
  examples: string[];
  keyTakeaways: string[];
  practiceProjects: string[];
}

export interface LearningTask {
  id: number;
  week: string;
  title: string;
  subtitle: string;
  dueDate: string;
  difficulty: string;
  progress: number;
  gradient: [string, string];
  accentColor: string;
  lessons: number;
  duration: string;
  content: ModuleContent;
}

export const learningTasks: LearningTask[] = [
  {
    id: 1,
    week: "01",
    title: "HTML & CSS",
    subtitle: "Responsive design fundamentals",
    dueDate: "APR 5",
    difficulty: "BEGINNER",
    progress: 100,
    gradient: ["#0EA5E9", "#0284C7"] as [string, string],
    accentColor: "#38BDF8",
    lessons: 12,
    duration: "8h 30m",
    content: {
      topics: [
        "HTML5 Semantic Structure",
        "CSS Selectors & Specificity",
        "Flexbox Layout",
        "CSS Grid",
        "Media Queries",
        "Responsive Typography",
        "Mobile-First Design",
        "CSS Preprocessors (SASS/SCSS)",
      ],
      explanations: `In this comprehensive module, you'll master the foundation of web development—HTML and CSS.
      
HTML5 provides semantic meaning to web content, making it accessible and SEO-friendly. You'll learn to structure pages with proper semantic tags like <article>, <section>, <nav>, and <aside>, which improve both accessibility and search engine ranking.

CSS has evolved significantly, from basic styling to powerful layout systems. You'll explore Flexbox, a one-dimensional layout system perfect for component-based design, and CSS Grid, which excels at two-dimensional layouts. Both are essential for modern responsive design.

Responsive design means creating websites that work beautifully on all screen sizes. Through media queries, you'll learn to apply different styles based on device characteristics like screen width, orientation, and pixel density. Mobile-first design encourages you to design for mobile first, then enhance for larger screens.

Advanced CSS techniques include CSS variables (custom properties) for maintainability, animations for engaging user experiences, and transforms for smooth transitions. You'll also explore CSS preprocessors like SASS, which add variables, nesting, and functions to CSS, making stylesheets more powerful and maintainable.`,
      examples: [
        "Building a responsive navigation bar that collapses on mobile",
        "Creating a multi-column layout using CSS Grid for a portfolio site",
        "Implementing a mobile-first product card with Flexbox",
        "Using media queries to adjust typography for different screen sizes",
        "Creating smooth hover animations with CSS transitions",
        "Building a responsive image gallery with aspect-ratio preservation",
      ],
      keyTakeaways: [
        "Semantic HTML improves accessibility and SEO rankings",
        "Flexbox is best for one-dimensional layouts and component alignment",
        "CSS Grid excels at creating complex two-dimensional layouts",
        "Mobile-first design ensures better user experiences across all devices",
        "Media queries are essential for responsive design implementation",
        "CSS preprocessing tools like SASS reduce repetition and improve maintainability",
        "Performance optimization through CSS is crucial for fast-loading pages",
      ],
      practiceProjects: [
        "Personal portfolio website with responsive design",
        "E-commerce product page with grid layout",
        "Blog landing page with mobile navigation",
        "Dashboard mockup using CSS Grid",
        "Animated card component library",
      ],
    },
  },
  {
    id: 2,
    week: "02",
    title: "JavaScript",
    subtitle: "DOM & async programming",
    dueDate: "APR 12",
    difficulty: "BEGINNER",
    progress: 30,
    gradient: ["#7C3AED", "#5B21B6"] as [string, string],
    accentColor: "#A78BFA",
    lessons: 15,
    duration: "10h 00m",
    content: {
      topics: [
        "JavaScript Fundamentals",
        "DOM Manipulation",
        "Event Handling",
        "Promises",
        "Async/Await",
        "Fetch API",
        "Error Handling",
        "Callbacks vs Modern Approaches",
      ],
      explanations: `JavaScript brings interactivity to web pages. This module covers both synchronous JavaScript fundamentals and asynchronous programming patterns that are critical in modern web development.

The Document Object Model (DOM) represents the page structure as a tree of objects. You'll learn to select elements using CSS selectors, modify their properties, add/remove classes, and dynamically update content. Understanding the DOM is essential for any interactive web experience.

Event handling allows your code to respond to user actions like clicks, form submissions, and keyboard input. You'll master event listeners, event delegation, and preventing default behaviors.

Asynchronous programming is crucial because web operations like API calls take time. Callbacks were the original solution but led to "callback hell." Promises provide better structure with .then() and .catch() methods. Async/await syntax makes asynchronous code look synchronous, improving readability significantly.

The Fetch API simplifies HTTP requests compared to older XMLHttpRequest. Combined with async/await, it enables clean, readable code for working with APIs. Error handling with try/catch ensures your applications gracefully handle network failures and unexpected responses.`,
      examples: [
        "Fetching user data from an API using async/await",
        "Building a todo list with DOM manipulation and event delegation",
        "Creating a form with real-time validation",
        "Implementing a search feature with debouncing",
        "Handling multiple API calls with Promise.all()",
        "Creating error boundaries for failed API requests",
        "Building a real-time weather app with Fetch API",
      ],
      keyTakeaways: [
        "DOM manipulation is fundamental to creating interactive web experiences",
        "Event delegation improves performance with many similar elements",
        "Promises provide better structure than callbacks for async operations",
        "Async/await syntax makes asynchronous code more readable and maintainable",
        "Proper error handling prevents application crashes",
        "Understanding microtasks and macrotasks helps debug timing issues",
        "API rate limiting and caching are important considerations",
      ],
      practiceProjects: [
        "GitHub user search app with API integration",
        "Real-time currency converter",
        "Todo application with local storage",
        "Weather dashboard fetching live data",
        "Movie search application with pagination",
      ],
    },
  },
  {
    id: 3,
    week: "03",
    title: "ES6+ Advanced",
    subtitle: "Modern patterns & APIs",
    dueDate: "APR 19",
    difficulty: "INTERMEDIATE",
    progress: 0,
    gradient: ["#059669", "#047857"] as [string, string],
    accentColor: "#34D399",
    lessons: 10,
    duration: "7h 45m",
    content: {
      topics: [
        "Arrow Functions & this binding",
        "Destructuring",
        "Spread & Rest Operators",
        "Template Literals",
        "Modules (Import/Export)",
        "Classes & Inheritance",
        "Generators & Iterators",
        "Symbols & WeakMap",
      ],
      explanations: `ES6 (ECMAScript 2015) revolutionized JavaScript with features that make code more expressive and maintainable. Arrow functions provide concise syntax and automatically bind 'this', eliminating common bugs. Destructuring allows elegant extraction of values from objects and arrays.

The spread operator (...) enables powerful patterns like copying arrays, merging objects, and passing arguments. Template literals with backticks and interpolation make string manipulation intuitive and readable.

Modules enable code organization through import/export statements, making large applications manageable. Classes provide familiar OOP syntax while abstracting JavaScript's prototype-based inheritance, making the language more accessible to developers from traditional OOP backgrounds.

Generators (function*) enable lazy evaluation and can pause execution with yield, useful for handling large datasets or complex control flow. Iterators follow a protocol enabling custom looping behavior.

Advanced concepts like Symbols create unique property keys, and WeakMap provides reference-based storage without preventing garbage collection. These are crucial for library development and advanced patterns.`,
      examples: [
        "Refactoring callback-based code to use arrow functions",
        "Using destructuring to simplify function parameters",
        "Creating modular code with import/export statements",
        "Building class hierarchies with inheritance and super",
        "Implementing a custom iterator for a data structure",
        "Using the spread operator to create immutable copies",
        "Creating generator functions for pagination",
      ],
      keyTakeaways: [
        "Arrow functions bind 'this' lexically, preventing common bugs",
        "Destructuring reduces boilerplate and improves readability",
        "Modules enable scalable, maintainable code organization",
        "Spread operator is essential for immutable programming patterns",
        "Classes abstract away prototype complexity while maintaining power",
        "Generators enable efficient lazy evaluation",
        "Understanding these features is essential for modern JavaScript frameworks",
      ],
      practiceProjects: [
        "Modular weather app with organized file structure",
        "Object-oriented todo application with classes",
        "Custom iterator for accessing nested data structures",
        "Pagination system using generators",
        "Library code demonstrating advanced patterns",
      ],
    },
  },
  {
    id: 4,
    week: "04",
    title: "React Native",
    subtitle: "Cross-platform mobile dev",
    dueDate: "APR 26",
    difficulty: "INTERMEDIATE",
    progress: 0,
    gradient: ["#DB2777", "#BE185D"] as [string, string],
    accentColor: "#F472B6",
    lessons: 20,
    duration: "14h 00m",
    content: {
      topics: [
        "React Fundamentals",
        "Components & Hooks",
        "State Management",
        "Navigation",
        "Native Modules",
        "Performance Optimization",
        "Testing",
        "Deployment",
      ],
      explanations: `React Native enables building native iOS and Android apps using JavaScript and React. This module bridges web development knowledge to mobile platforms, sharing React's component model while providing access to native APIs.

Components are reusable building blocks. Functional components with Hooks (especially useState and useEffect) are the modern approach, enabling state management and side effects without class complexity.

Navigation libraries like React Navigation handle screen transitions. Proper navigation architecture is crucial for user experience. Understanding navigation stacks, tabs, and drawers enables building complex app flows.

React Native provides platform-specific components (View, Text, ScrollView) that map to native iOS and Android components, ensuring native performance and look-and-feel. Accessing native APIs like camera, geolocation, and sensors requires understanding how to bridge JavaScript and native code.

Performance optimization is critical on mobile. FlatList for efficient list rendering, memoization to prevent unnecessary re-renders, and proper state management prevent app slowdowns. Testing ensures reliability across devices.

Deployment involves building signed APKs for Android and creating provisioned apps for iOS, each with platform-specific requirements.`,
      examples: [
        "Building a multi-screen app with navigation",
        "Creating reusable component library",
        "Implementing efficient lists with FlatList",
        "Accessing device camera and photos",
        "Managing global state with Context or Redux",
        "Optimizing performance with React.memo",
        "Building and deploying to app stores",
      ],
      keyTakeaways: [
        "Learn once, write anywhere—React principles apply to React Native",
        "Hooks simplify state management and side effects",
        "Native modules access device capabilities beyond JavaScript",
        "Performance optimization is critical for mobile UX",
        "Proper navigation architecture enables complex app flows",
        "Platform-specific handling ensures consistent native experience",
        "Testing and deployment have platform-specific considerations",
      ],
      practiceProjects: [
        "Multi-screen social media app with navigation",
        "Photo gallery app accessing device storage",
        "Location-based service app",
        "Real-time chat application",
        "Fitness tracking app with native integrations",
      ],
    },
  },
  {
    id: 5,
    week: "05",
    title: "Backend APIs",
    subtitle: "Node.js, Express & databases",
    dueDate: "MAY 3",
    difficulty: "ADVANCED",
    progress: 0,
    gradient: ["#D97706", "#B45309"] as [string, string],
    accentColor: "#FCD34D",
    lessons: 18,
    duration: "12h 15m",
    content: {
      topics: [
        "Node.js Runtime",
        "Express Framework",
        "RESTful APIs",
        "Authentication & Authorization",
        "Database Integration",
        "Middleware",
        "Error Handling",
        "Scaling & Deployment",
      ],
      explanations: `Node.js brings JavaScript to server-side development, enabling full-stack JavaScript applications. Its event-driven, non-blocking I/O model excels at handling multiple concurrent connections.

Express is a minimal, flexible web framework for Node.js. It simplifies routing, middleware management, and response handling. Middleware functions enable cross-cutting concerns like logging, authentication, and compression.

RESTful APIs follow conventions for creating predictable endpoints. HTTP methods (GET, POST, PUT, DELETE) map to operations, resource URLs identify targets, and standard status codes communicate outcomes. Proper REST design makes APIs intuitive and maintainable.

Authentication verifies user identity (username/password, OAuth, JWT), while authorization determines what authenticated users can access. JWTs (JSON Web Tokens) are stateless tokens enabling scalable authentication across multiple servers.

Databases store persistent data. SQL databases (PostgreSQL) provide ACID guarantees and complex queries, while NoSQL databases (MongoDB) offer flexibility and horizontal scaling. Understanding data modeling and query optimization is essential.

Proper error handling with try/catch and error middleware prevents crashes and provides helpful error messages. Logging enables debugging production issues.

Scaling requires horizontally distributing load across servers, caching frequently accessed data, and using CDNs for static content. Docker containerization and orchestration platforms like Kubernetes enable modern deployment.`,
      examples: [
        "Building a RESTful API for a todo app",
        "Implementing JWT-based authentication",
        "Connecting to databases with ORMs like Sequelize",
        "Creating middleware for request validation",
        "Implementing pagination and filtering",
        "Setting up error handling and logging",
        "Deploying to cloud platforms like Heroku or AWS",
      ],
      keyTakeaways: [
        "Node.js non-blocking I/O enables highly concurrent servers",
        "Express middleware enables clean, composable code organization",
        "RESTful conventions make APIs intuitive and maintainable",
        "JWT tokens enable stateless, scalable authentication",
        "Proper database design ensures scalability and performance",
        "Error handling and logging are critical for production reliability",
        "Caching and CDNs significantly improve performance",
      ],
      practiceProjects: [
        "Full-featured API with authentication and database",
        "Multi-tenant SaaS application backend",
        "Real-time notification system",
        "File upload and management service",
        "Analytics and reporting backend",
      ],
    },
  },
  {
    id: 6,
    week: "06",
    title: "TypeScript",
    subtitle: "Static typing & advanced types",
    dueDate: "MAY 10",
    difficulty: "INTERMEDIATE",
    progress: 0,
    gradient: ["#0891B2", "#0E7490"] as [string, string],
    accentColor: "#22D3EE",
    lessons: 13,
    duration: "9h 00m",
    content: {
      topics: [
        "Type Annotations",
        "Interfaces & Types",
        "Generics",
        "Union & Intersection Types",
        "Decorators",
        "Modules & Namespaces",
        "Declaration Files",
        "Advanced Type Patterns",
      ],
      explanations: `TypeScript adds optional static typing to JavaScript, catching errors at compile-time rather than runtime. This prevents entire classes of bugs while improving code documentation and IDE support.

Type annotations explicitly declare expected types for variables, parameters, and return values. This enables the compiler and IDE to catch type mismatches immediately. Interfaces define object structures with required/optional properties. Both 'interface' and 'type' define types, with subtle differences in behavior and use cases.

Generics enable writing reusable code that works with any type while maintaining type safety. Generic functions and classes are essential for building flexible, type-safe libraries. Union types allow variables to hold multiple types, while intersection types combine multiple types into one.

Advanced patterns like conditional types, mapped types, and type guards enable sophisticated code transformation at the type level. Generics with constraints enable powerful abstractions used in React and other frameworks.

Decorators (with experimental support) enable meta-programming, modifying classes and methods. They're heavily used in frameworks like NestJS and Angular.

Declaration files (.d.ts) enable TypeScript support for untyped JavaScript libraries, either as documentation or for publishing typed packages.`,
      examples: [
        "Typing React components with TypeScript",
        "Creating generic utility functions",
        "Working with union and intersection types",
        "Building type-safe API clients",
        "Using conditional types for complex patterns",
        "Creating declaration files for JavaScript libraries",
        "Building type-safe Redux or state management",
      ],
      keyTakeaways: [
        "TypeScript catches errors at compile-time, preventing runtime bugs",
        "Strong typing improves code documentation and IDE support",
        "Generics enable reusable, type-safe code",
        "Union and intersection types express complex type relationships",
        "Advanced patterns push TypeScript into metaprogramming",
        "Declaration files enable TypeScript support for existing libraries",
        "TypeScript doesn't add runtime overhead—it compiles to plain JavaScript",
      ],
      practiceProjects: [
        "Strongly typed React component library",
        "Type-safe API client wrapper",
        "Generic data structure implementations",
        "Complex state management with inference",
        "Contributed types to popular JavaScript library",
      ],
    },
  },
  {
    id: 7,
    week: "07",
    title: "Databases",
    subtitle: "SQL, NoSQL & data modelling",
    dueDate: "MAY 17",
    difficulty: "ADVANCED",
    progress: 0,
    gradient: ["#EA580C", "#C2410C"] as [string, string],
    accentColor: "#FB923C",
    lessons: 16,
    duration: "11h 30m",
    content: {
      topics: [
        "Relational Database Design",
        "SQL Queries & Optimization",
        "NoSQL Concepts",
        "Document Databases",
        "Indexing & Performance",
        "Transactions & ACID",
        "Backup & Recovery",
        "Scaling Strategies",
      ],
      explanations: `Databases are the persistent backbone of applications. Understanding both relational (SQL) and non-relational (NoSQL) databases enables choosing the right tool for each problem.

Relational databases like PostgreSQL organize data in tables with predefined schemas. Normalization reduces redundancy and ensures data integrity. Joins combine data from multiple tables. SQL queries are powerful and standardized, though complex queries can become inefficient. Indexes dramatically speed up queries by organizing data for faster lookup.

ACID properties ensure reliability: Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent safety), and Durability (persistence). Transactions group related operations, ensuring partial failures don't leave data in inconsistent states.

NoSQL databases sacrifice some structure for flexibility and scalability. Document databases like MongoDB store flexible JSON-like structures, enabling rapid schema evolution. Key-value stores provide ultra-fast access to unstructured data.

Query optimization is critical for performance. Understanding indexes, join strategies, and query plans prevents slow applications. Monitoring and profiling identify bottlenecks.

As data grows, vertical scaling (bigger machines) hits limits. Horizontal scaling distributes data across machines, but introduces consistency tradeoffs. Sharding divides data by key, while replication creates copies for redundancy and read scaling.

Backup and recovery strategies prevent data loss. Transactions, replication, and point-in-time recovery enable business continuity.`,
      examples: [
        "Designing normalized relational schemas",
        "Writing efficient SQL queries with proper indexes",
        "Migrating from relational to NoSQL",
        "Implementing database transactions",
        "Optimizing slow queries",
        "Setting up replication and failover",
        "Implementing sharding strategies",
      ],
      keyTakeaways: [
        "Relational databases excel at complex queries and consistency",
        "NoSQL databases scale horizontally and handle flexible data",
        "Proper indexing is crucial for performance",
        "ACID properties ensure reliability but impact scalability",
        "Query optimization prevents performance problems",
        "Horizontal scaling requires careful data distribution",
        "Backup and recovery strategies are essential, not optional",
      ],
      practiceProjects: [
        "E-commerce database design with transactions",
        "Analytics database with billions of events",
        "Real-time recommendation engine",
        "Multi-tenant database architecture",
        "Database migration from SQL to NoSQL",
      ],
    },
  },
  {
    id: 8,
    week: "08",
    title: "DevOps & CI/CD",
    subtitle: "Docker, pipelines & deployment",
    dueDate: "MAY 24",
    difficulty: "ADVANCED",
    progress: 0,
    gradient: ["#4F46E5", "#4338CA"] as [string, string],
    accentColor: "#818CF8",
    lessons: 17,
    duration: "13h 00m",
    content: {
      topics: [
        "Containerization with Docker",
        "Container Orchestration",
        "CI/CD Pipelines",
        "Infrastructure as Code",
        "Monitoring & Logging",
        "Security Best Practices",
        "Blue-Green Deployments",
        "Scalability & Load Balancing",
      ],
      explanations: `DevOps bridges development and operations, emphasizing automation, collaboration, and continuous improvement. Modern DevOps practices enable rapid, reliable releases while maintaining system stability.

Docker containerizes applications with dependencies, ensuring consistency across development, testing, and production. Containers are lightweight, portable, and fast to spin up. Dockerfile specifies the application environment, making infrastructure reproducible.

Container orchestration with Kubernetes automates deployment, scaling, and management across clusters. Service discovery, load balancing, self-healing, and rolling updates happen automatically. Kubernetes excels at managing complex microservice architectures.

CI/CD pipelines automate testing and deployment. Continuous Integration triggers tests on every code change, catching bugs early. Continuous Deployment automatically releases passing code to production, enabling rapid iteration.

Infrastructure as Code treats infrastructure like software—defined in version control, tested, and deployed systematically. Tools like Terraform enable reproducible infrastructure.

Monitoring tracks application health and performance, while logging captures detailed events for debugging. Alerts notify on issues, enabling rapid response.

Security considerations include private registries for images, secrets management, and network policies. Blue-green deployments enable zero-downtime updates by running two identical environments and switching traffic between them. Canary deployments roll out changes gradually, limiting blast radius of issues.

Load balancing distributes traffic across multiple instances, ensuring high availability and performance.`,
      examples: [
        "Creating Dockerfile and Docker Compose for applications",
        "Setting up CI/CD with GitHub Actions or GitLab CI",
        "Deploying to Kubernetes cluster",
        "Implementing monitoring with Prometheus and Grafana",
        "Setting up blue-green deployments",
        "Configuring auto-scaling based on metrics",
        "Automating security scanning in pipelines",
      ],
      keyTakeaways: [
        "Docker containers ensure consistency across environments",
        "Kubernetes automates scaling and management at scale",
        "CI/CD pipelines enable rapid, reliable releases",
        "Infrastructure as Code makes infrastructure reproducible",
        "Monitoring and logging are essential for production reliability",
        "Security should be integrated throughout the pipeline",
        "Proper deployment strategies minimize risk and downtime",
      ],
      practiceProjects: [
        "Full-stack application deployed to Kubernetes",
        "CI/CD pipeline for complex microservice architecture",
        "Infrastructure as Code for multi-environment setup",
        "Monitoring and alerting system for production app",
        "Blue-green deployment system with rollback capability",
      ],
    },
  },
];
