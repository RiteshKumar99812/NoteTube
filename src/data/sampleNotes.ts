import type { VideoNotes } from '../types/notes';

export interface SampleVideoItem {
  id: string;
  videoId: string;
  label: string;
  topic: string;
  platform: 'youtube' | 'coursera' | 'udemy' | 'edx';
  notes: VideoNotes;
}

export const SAMPLE_NOTES: SampleVideoItem[] = [
  {
    id: 'sample-llm',
    videoId: 'zjkBMFhNj_g',
    label: 'Intro to Large Language Models (Andrej Karpathy)',
    topic: 'Artificial Intelligence',
    platform: 'youtube',
    notes: {
      title: 'State of GPT and Intro to Large Language Models',
      platform: 'youtube',
      tldr: 'Large Language Models are lossy text predictors trained on vast web corpora using massive compute clusters. The LLM development lifecycle consists of four main stages: pre-training, supervised fine-tuning (SFT), reward modeling (RLHF), and iterative safety alignment. While capable of impressive reasoning, LLMs are fundamentally autoregressive token predictors with finite context windows and non-zero hallucination rates.',
      short_notes: {
        executive_brief: 'LLMs predict tokens autoregressively. Training spans pre-training (web scale), SFT (dialogue pairs), and RLHF (human preference optimization). Chain-of-thought converts test-time compute into reasoning steps.',
        key_takeaways: [
          'Pre-training compresses internet text into billions of neural weights via next-token loss.',
          'Supervised fine-tuning (SFT) turns a raw text continuator into a structured conversational assistant.',
          'RLHF and PPO align model outputs with human helpfulness and safety guidelines.',
          'System 2 reasoning is simulated through scratchpad chain-of-thought prompt expansion.'
        ],
        core_principles: [
          'Autoregressive Inference: P(w_t | w_1, ..., w_{t-1})',
          'Finite Working Memory: Context window bound',
          'Inference Compute Scaling: Thinking step-by-step increases FLOPs'
        ],
        quick_lexicon: [
          { term: 'Token', definition: 'Sub-word atomic sequence unit (~4 chars).' },
          { term: 'Context Window', definition: 'Maximum input + output tokens attendable per step.' },
          { term: 'RLHF', definition: 'Reinforcement Learning from Human Feedback for assistant alignment.' }
        ]
      },
      key_concepts: [
        {
          heading: 'Pre-training: Compressing the Internet',
          timestamp: '03:15',
          bullets: [
            'Pre-training takes trillions of words from web crawls (Common Crawl, GitHub, Wikipedia, Books) and trains a transformer neural network over months using thousands of GPUs.',
            'The training objective is straightforward: predict the next token given preceding context tokens using cross-entropy loss.',
            'The resulting base model represents a compressed world-model and pattern matcher, though it is prone to answering questions by fabricating more questions or hallucinating continuation text.',
          ],
        },
        {
          heading: 'Supervised Fine-Tuning (SFT) & Assistant Alignment',
          timestamp: '12:45',
          bullets: [
            'Base models are converted into helpful conversational assistants by fine-tuning on high-quality, human-curated prompt-response pairs.',
            'Human annotators write thousands of ideal answers following detailed style guides emphasizing clarity, factual accuracy, and harmlessness.',
            'SFT replaces unconstrained web document continuation with structured dialogue conventions (System, User, Assistant tokens).',
          ],
        },
        {
          heading: 'Reinforcement Learning from Human Feedback (RLHF)',
          timestamp: '24:30',
          bullets: [
            'Instead of writing completions from scratch, human judges rank multiple candidate completions produced by the model.',
            'A reward model is trained to score completions according to human preferences and comparative ratings.',
            'Proximal Policy Optimization (PPO) fine-tunes the generative model to maximize reward scores without drifting too far from the reference SFT model.',
          ],
        },
        {
          heading: 'System 1 vs System 2 Thinking in Neural Architectures',
          timestamp: '38:10',
          bullets: [
            'Current LLMs operate predominantly like System 1 instinctual thinkers, spending identical compute per token regardless of query difficulty.',
            'Techniques like chain-of-thought prompting ("think step by step") and tree-of-thought search mimic System 2 deliberate reasoning by converting compute time into intermediate scratchpad tokens.',
            'Context windows act as short-term working memory; prompt engineering and retrieval-augmented generation (RAG) ground the model in authoritative reference documents.',
          ],
        },
      ],
      glossary: [
        {
          term: 'Token',
          definition: 'A sub-word chunk (roughly 4 characters or 0.75 words in English) used as the atomic unit of text processing in transformer vocabulary.',
        },
        {
          term: 'Hallucination',
          definition: 'A confident assertion by a language model that is factually incorrect or unsupported by the training data or input context.',
        },
        {
          term: 'Context Window',
          definition: 'The maximum sequence length of tokens (both input prompt and generated response) that the model can attend to at a single inference step.',
        },
        {
          term: 'Reward Model',
          definition: 'A neural network trained on human comparison preferences that assigns a scalar value representing the quality and helpfulness of a model response.',
        },
      ],
      revision_questions: [
        {
          question: 'Why is a raw base model generally unsuitable for a customer-facing conversational chatbot?',
          answer: 'Base models are trained solely to predict the most likely next internet token. If given a query like "How do I fix a leaky pipe?", a base model may complete it with a second query ("Where can I buy plumber tools?") or generate a forum thread rather than answering directly. It requires Supervised Fine-Tuning (SFT) to adopt the persona of a helpful question-answering assistant.',
        },
        {
          question: 'What is the primary advantage of Reinforcement Learning from Human Feedback (RLHF) over pure Supervised Fine-Tuning?',
          answer: 'It is significantly faster, cheaper, and more consistent for human annotators to compare and rank several candidate responses (A vs. B) than it is to draft comprehensive, flawless answers from scratch. Ranking data captures subtle nuances of human preference that are difficult to express in demonstration datasets.',
        },
        {
          question: 'How does Chain-of-Thought (CoT) prompting simulate deliberate System 2 reasoning in token-by-token autoregressive models?',
          answer: 'Autoregressive models dedicate a fixed amount of mathematical computation per output token. By forcing the model to generate intermediate reasoning tokens ("scratchpad text") before committing to a final answer, CoT effectively allocates more total floating-point operations (FLOPs) to the problem.',
        },
      ],
    },
  },
  {
    id: 'sample-coursera',
    videoId: 'andrewng-deeplearning',
    label: 'Deep Learning & Neural Networks (Coursera / Andrew Ng)',
    topic: 'Machine Learning',
    platform: 'coursera',
    notes: {
      title: 'Coursera: Deep Learning Architectures & Vectorized Forward-Prop',
      platform: 'coursera',
      tldr: 'Deep learning replaces manual feature engineering with hierarchical representations learned directly from data. Vectorized implementation eliminates Python explicit loops via matrix operations (NumPy GEMM), achieving orders of magnitude acceleration. Key architectural building blocks include activation functions (ReLU, Sigmoid), computational graphs, backpropagation calculus, and parameter initialization strategies.',
      short_notes: {
        executive_brief: 'Deep neural networks stack affine linear transformations and non-linear activations. Matrix vectorization enables parallel GPU hardware acceleration while backpropagation computes analytical gradients.',
        key_takeaways: [
          'Vectorization transforms iteration loops into single BLAS/GPU matrix multiplications (Z = W·X + b).',
          'ReLU activations solve the vanishing gradient problem observed in deep sigmoid architectures.',
          'Backpropagation uses calculus chain rule to propagate error deltas from loss to input layers.',
          'He/Xavier initialization prevents signal explosion or attenuation during forward propagation.'
        ],
        core_principles: [
          'Forward Propagation: A^[l] = g^[l](W^[l]·A^[l-1] + b^[l])',
          'Cross-Entropy Loss: L(y_hat, y) = -(y log(y_hat) + (1-y) log(1-y_hat))',
          'Gradient Update: W = W - alpha * dW'
        ],
        quick_lexicon: [
          { term: 'Vectorization', definition: 'Computing on full data arrays simultaneously without explicit iteration.' },
          { term: 'ReLU', definition: 'Rectified Linear Unit f(x) = max(0, x), default hidden activation.' },
          { term: 'Backpropagation', definition: 'Reverse-mode automatic differentiation applying the chain rule.' }
        ]
      },
      key_concepts: [
        {
          heading: 'Vectorized Matrix Formulations in Forward Propagation',
          timestamp: '08:20',
          bullets: [
            'Explicit Python for-loops over m training examples create severe bottlenecks; vectorization packs all training vectors as columns in a matrix X.',
            'Linear layer computation simplifies to matrix multiplication: Z = W * X + b, broadcast across mini-batches on tensor cores.',
            'Nonlinear activation functions g(Z) are applied elementwise, preserving dimensional alignment across network depth.',
          ],
        },
        {
          heading: 'Vanishing Gradients and the Superiority of ReLU',
          timestamp: '19:45',
          bullets: [
            'Sigmoid and tanh functions saturate at extreme values, causing their derivatives to approach zero in deep networks.',
            'When propagating errors backward through multiple layers, multiplying tiny fractions causes earlier layers to stop learning.',
            'ReLU (f(x) = max(0, x)) maintains a constant derivative of 1 for all positive activations, ensuring steady gradient flow.',
          ],
        },
        {
          heading: 'Computational Graphs & Analytical Backpropagation',
          timestamp: '31:10',
          bullets: [
            'Neural networks represent equations as directed computational graphs where forward passes evaluate outputs and backward passes propagate derivatives.',
            'The chain rule of calculus breaks down composite function gradients into modular, local Jacobian-vector products.',
            'Cache variables stored during the forward pass are reused during backpropagation to avoid redundant arithmetic.',
          ],
        },
      ],
      glossary: [
        {
          term: 'Vectorization',
          definition: 'Eliminating explicit loops in numerical code by executing parallel operations across matrix arrays using optimized linear algebra libraries.',
        },
        {
          term: 'ReLU',
          definition: 'Rectified Linear Unit activation function f(x) = max(0, x), preventing vanishing gradients in deep architectures.',
        },
        {
          term: 'Computational Graph',
          definition: 'A directed graph where nodes correspond to operations or variables, used by autograd engines to compute gradients.',
        },
        {
          term: 'Xavier/He Initialization',
          definition: 'Variance-scaling techniques for setting initial weight matrices to prevent exploding or vanishing activations.',
        },
      ],
      revision_questions: [
        {
          question: 'Why does initializing all neural network weights to zero cause training failure?',
          answer: 'Zero initialization causes all hidden units in a layer to compute the exact same activation and gradient. Symmetry is never broken, so hidden units learn identical features regardless of training duration.',
        },
        {
          question: 'How does vectorization improve execution speed even on single-threaded CPUs?',
          answer: 'Vectorized operations leverage SIMD (Single Instruction, Multiple Data) processor registers (like AVX-512) and highly optimized BLAS libraries, executing multiple float operations per CPU cycle rather than interpreting dynamic Python bytecode per element.',
        },
      ],
    },
  },
  {
    id: 'sample-udemy',
    videoId: 'udemy-distributed-sys',
    label: 'Distributed Systems & Microservices (Udemy Masterclass)',
    topic: 'Cloud Architecture',
    platform: 'udemy',
    notes: {
      title: 'Udemy: Distributed Systems Design, CAP Theorem & Eventual Consistency',
      platform: 'udemy',
      tldr: 'Modern distributed architectures trade strong ACID transactions for horizontal scalability and partition tolerance. Brewer\'s CAP theorem establishes that in the presence of network partitions, systems must choose between consistency and availability. Implementing eventual consistency relies on asynchronous message brokers, idempotency keys, and Saga orchestrations.',
      short_notes: {
        executive_brief: 'Distributed systems prioritize availability and partition tolerance over immediate consistency. Asynchronous event queues and compensating transactions replace monolithic two-phase commits.',
        key_takeaways: [
          'CAP Theorem dictates that network partitions (P) are unavoidable, forcing a tradeoff between Consistency (C) and Availability (A).',
          'Eventual consistency guarantees all replicas converge to the same state given no new mutations.',
          'Sagas coordinate multi-service transactions using local commits and compensating rollback actions.',
          'Idempotent API design prevents duplicate side effects from network retries.'
        ],
        core_principles: [
          'CAP Boundary: P is inevitable on networks; pick CP or AP',
          'Event-Driven Decoupling: Producers and consumers interact via immutable logs',
          'Compensating Sagas: Rollback via explicit inversion transactions'
        ],
        quick_lexicon: [
          { term: 'CAP Theorem', definition: 'Tradeoff: Consistency vs Availability during network partition.' },
          { term: 'Idempotency', definition: 'Property where multiple identical requests produce identical state.' },
          { term: 'Saga Pattern', definition: 'Sequence of local transactions coordinated without distributed locks.' }
        ]
      },
      key_concepts: [
        {
          heading: 'The Fallacy of Distributed Computing & The CAP Theorem',
          timestamp: '11:00',
          bullets: [
            'Distributed networks are subject to packet drops, latency jitter, and partition events.',
            'Under partition (P), a node cannot communicate with its peers: answering requests risks stale data (AP), while refusing requests hurts uptime (CP).',
            'Most web-scale platforms choose AP with eventual consistency over synchronous blocking protocols like Two-Phase Commit (2PC).',
          ],
        },
        {
          heading: 'Event-Driven Microservices & Message Broker Guarantees',
          timestamp: '25:30',
          bullets: [
            'Services communicate asynchronously through append-only log brokers (e.g. Apache Kafka, RabbitMQ) rather than blocking HTTP RPCs.',
            'Brokers provide at-least-once delivery guarantees, making consumer idempotency mandatory to prevent double billing or duplicate state changes.',
            'Dead letter queues (DLQ) isolate poison pill messages without interrupting production pipeline throughput.',
          ],
        },
        {
          heading: 'Distributed Transactions: The Saga Pattern',
          timestamp: '42:15',
          bullets: [
            'Monolithic transactions cannot span independent database shards without heavy performance degradation.',
            'The Saga pattern breaks an end-to-end operation into discrete local transactions, each updating internal state and emitting an event.',
            'If an intermediate step fails, compensating transactions execute in reverse order to undo earlier commits.',
          ],
        },
      ],
      glossary: [
        {
          term: 'Eventual Consistency',
          definition: 'A consistency model where all replicas eventually converge to the identical value if no new updates are made to the object.',
        },
        {
          term: 'Idempotency Key',
          definition: 'A unique client-generated token passed with mutation requests allowing the server to recognize and safely ignore duplicates.',
        },
        {
          term: 'Two-Phase Commit (2PC)',
          definition: 'A blocking atomic commitment protocol coordinating distributed participants across prepare and commit phases.',
        },
        {
          term: 'Compensating Transaction',
          definition: 'An operation that reverses the business impact of a previously completed local transaction within a Saga.',
        },
      ],
      revision_questions: [
        {
          question: 'Why is Two-Phase Commit (2PC) rarely used in high-throughput cloud microservices?',
          answer: '2PC is a synchronous, blocking protocol. If the coordinator or any single participant hangs or suffers network latency, all database row locks remain open indefinitely, causing cascading resource exhaustion throughout the cluster.',
        },
        {
          question: 'What is the role of an idempotency key in an event-driven payment processing pipeline?',
          answer: 'Networks frequently drop acknowledgments even after successful processing. When the payment client retries the request, the idempotency key allows the processor to detect the duplicate and return the cached receipt instead of charging the card twice.',
        },
      ],
    },
  },
  {
    id: 'sample-cs50',
    videoId: 'LfaMVlDaQ24',
    label: 'CS50 Lecture: Computational Thinking (edX / Harvard)',
    topic: 'Computer Science',
    platform: 'edx',
    notes: {
      title: 'Harvard CS50: Computational Thinking & Algorithmic Complexity',
      platform: 'edx',
      tldr: 'Computer science is fundamentally about problem solving through precise algorithmic inputs and outputs. Information is represented electronically in binary (base-2). Efficient problem solving demands analyzing algorithmic time complexity via Big-O notation, transitioning from naive linear search (O(n)) to divide-and-conquer binary search (O(log n)).',
      short_notes: {
        executive_brief: 'Information is encoded in binary bits. Algorithm design evaluates scalability via Big-O notation, showing exponential efficiency gains from divide-and-conquer binary search over naive linear scans.',
        key_takeaways: [
          'Binary encoding maps electronic voltages to 0 and 1, combined into 8-bit bytes.',
          'Big-O notation characterizes worst-case operational growth rate relative to input size n.',
          'Linear search requires O(n) steps; binary search halves the problem space each step to achieve O(log n).'
        ],
        core_principles: [
          'Binary Permutations: 2^n possible values for n bits',
          'Divide & Conquer: T(n) = T(n/2) + O(1)',
          'Logarithmic Scalability: log2(1,000,000) ~ 20 steps'
        ],
        quick_lexicon: [
          { term: 'Bit', definition: 'Smallest binary unit (0 or 1).' },
          { term: 'Big-O', definition: 'Mathematical asymptotic worst-case bounds.' },
          { term: 'Binary Search', definition: 'Logarithmic search halving sorted candidate spaces.' }
        ]
      },
      key_concepts: [
        {
          heading: 'Binary Representation & ASCII / Unicode',
          timestamp: '05:20',
          bullets: [
            'Computers represent all data through millions of microscopic transistors acting as physical on/off electrical switches (1 or 0).',
            'A byte consists of 8 bits, capable of representing 256 unique permutations (from 00000000 to 11111111).',
            'Characters are mapped to numbers using standardized mapping tables: ASCII provides 7/8-bit mappings, while Unicode (UTF-8) provides variable-length encoding for global languages and emoji.',
          ],
        },
        {
          heading: 'Algorithms: The Recipe for Problem Solving',
          timestamp: '18:40',
          bullets: [
            'An algorithm is a step-by-step sequence of unambiguous instructions designed to transform valid input into desired output.',
            'Correctness is a prerequisite, but efficiency determines practical feasibility as input size (n) scales to millions or billions.',
            'Algorithmic analysis measures asymptotic performance: Big-O represents the upper bound (worst-case), Big-Omega represents the lower bound (best-case), and Big-Theta represents tight bounds.',
          ],
        },
        {
          heading: 'Search Strategies: Linear Search vs. Binary Search',
          timestamp: '32:15',
          bullets: [
            'Linear Search iterates through unsorted elements one by one. In the worst case, searching n items requires n operations (O(n)).',
            'Binary Search requires a sorted collection. By checking the midpoint and discarding half of the remaining space at each step, searching a phone book of 4 billion entries takes at most 32 comparisons (O(log n)).',
            'Sorting upfront introduces computational overhead (O(n log n)), which pays dividends when repeated lookups are required.',
          ],
        },
      ],
      glossary: [
        {
          term: 'Bit',
          definition: 'The smallest unit of data in computing, holding a binary value of either 0 or 1.',
        },
        {
          term: 'Big-O Notation',
          definition: 'A mathematical notation used to classify algorithms according to how their running time or space requirements grow as the input size grows.',
        },
        {
          term: 'Divide and Conquer',
          definition: 'An algorithmic paradigm where a problem is broken down into two or more smaller sub-problems until they become simple enough to solve directly.',
        },
        {
          term: 'Asymptotic Analysis',
          definition: 'Evaluating the performance of an algorithm as the scale of input (n) approaches infinity, ignoring machine-specific constant factors.',
        },
      ],
      revision_questions: [
        {
          question: 'If a sorted list contains 1,048,576 elements, what is the maximum number of comparisons binary search needs to find an item?',
          answer: '20 comparisons. Because 2^20 = 1,048,576, binary search divides the search space in half at each step, resulting in log2(1,048,576) = 20 operations.',
        },
        {
          question: 'Why can binary search not be executed directly on an unsorted array?',
          answer: 'Binary search relies strictly on the invariant that all elements to the left of the midpoint are less than or equal to the midpoint value, and all elements to the right are greater. Without ordering, discarding one half would risk discarding the target element.',
        },
      ],
    },
  },
];
