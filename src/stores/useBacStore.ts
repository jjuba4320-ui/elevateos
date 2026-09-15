import { create } from 'zustand';
import { BacSubject, BacMistakeEntry, FormulaNote, BacBranch } from '../types';

const DEFAULT_SUBJECTS: BacSubject[] = [
  {
    id: 'sub_math',
    name: 'Mathematics',
    nameAr: 'الرياضيات',
    coefficient: 7,
    targetGrade: 18.5,
    currentEstimatedGrade: 16.0,
    revisionPercentage: 74,
    units: [
      { id: 'u1', title: 'Calculus, Numerical Functions & Limits', completed: true },
      { id: 'u2', title: 'Sequences & Mathematical Induction', completed: true },
      { id: 'u3', title: 'Exponential & Logarithmic Functions', completed: true },
      { id: 'u4', title: 'Complex Numbers & Transformations', completed: false },
      { id: 'u5', title: 'Probability & Combinatorics', completed: false },
      { id: 'u6', title: 'Space Geometry & Dot Product', completed: false },
    ],
  },
  {
    id: 'sub_phys',
    name: 'Physics & Chemistry',
    nameAr: 'العلوم الفيزيائية',
    coefficient: 6,
    targetGrade: 18.0,
    currentEstimatedGrade: 16.5,
    revisionPercentage: 68,
    units: [
      { id: 'up1', title: 'Chemical Kinetics & Redox Titration', completed: true },
      { id: 'up2', title: 'Nuclear Transformations (Decay & Fission)', completed: true },
      { id: 'up3', title: 'RC & RL Electrical Dipoles', completed: true },
      { id: 'up4', title: 'Acid-Base Equilibria & pH', completed: false },
      { id: 'up5', title: 'Newtonian Mechanics & Satellite Motion', completed: false },
      { id: 'up6', title: 'Esterification & Organic Reactions', completed: false },
    ],
  },
  {
    id: 'sub_sci',
    name: 'Natural Sciences & Life',
    nameAr: 'علوم الطبيعة والحياة',
    coefficient: 6,
    targetGrade: 17.0,
    currentEstimatedGrade: 15.0,
    revisionPercentage: 55,
    units: [
      { id: 'us1', title: 'Protein Synthesis & Transcription/Translation', completed: true },
      { id: 'us2', title: 'Enzymatic Activity & Allosteric Sites', completed: true },
      { id: 'us3', title: 'Immunology & Phagocytosis/Lymphocytes', completed: false },
      { id: 'us4', title: 'Neurophysiology & Synaptic Transmission', completed: false },
      { id: 'us5', title: 'Cellular Respiration & Photosynthesis', completed: false },
    ],
  },
  {
    id: 'sub_phil',
    name: 'Philosophy',
    nameAr: 'الفلسفة',
    coefficient: 2,
    targetGrade: 15.0,
    currentEstimatedGrade: 13.5,
    revisionPercentage: 50,
    units: [
      { id: 'uph1', title: 'The Problematic of Scientific Method', completed: true },
      { id: 'uph2', title: 'Philosophy of Mathematics (Origin of Concepts)', completed: false },
      { id: 'uph3', title: 'Experimental vs Observational Science', completed: false },
      { id: 'uph4', title: 'Human Sciences (History, Psychology, Sociology)', completed: false },
    ],
  },
  {
    id: 'sub_ara',
    name: 'Arabic Literature',
    nameAr: 'اللغة العربية وآدابها',
    coefficient: 3,
    targetGrade: 16.0,
    currentEstimatedGrade: 14.5,
    revisionPercentage: 60,
    units: [
      { id: 'ua1', title: 'Decadence & Renaissance Era Poetry', completed: true },
      { id: 'ua2', title: 'National and Humanitarian Commitment Poetry', completed: true },
      { id: 'ua3', title: 'The Modern Essay & Arabic Prose', completed: false },
    ],
  },
  {
    id: 'sub_lang',
    name: 'Foreign Languages (EN / FR)',
    nameAr: 'اللغات الأجنبية (فرنسية / إنجليزية)',
    coefficient: 4,
    targetGrade: 17.5,
    currentEstimatedGrade: 16.5,
    revisionPercentage: 80,
    units: [
      { id: 'ul1', title: 'Historical Texts & Expository Writing', completed: true },
      { id: 'ul2', title: 'Argumentative Essays & Discourse Connectors', completed: true },
      { id: 'ul3', title: 'Conditionals, Reported Speech & Grammar Mastery', completed: true },
    ],
  },
];

const SAMPLE_MISTAKES: BacMistakeEntry[] = [
  {
    id: 'mstk_1',
    date: '2026-03-02',
    subjectId: 'sub_phys',
    subjectName: 'Physics & Chemistry',
    exerciseRef: 'BAC 2022 Session 1 - Ex 3 (RC Circuit)',
    mistakeType: 'Calculation',
    errorDescription: 'Forgot to convert capacitor capacitance from microfarads (µF) to Farads (x10^-6) in the time constant tau = R*C equation.',
    correctSolution: 'tau = 2200 ohm * (470 x 10^-6 F) = 1.034 seconds. Always write SI units explicitly in the scratchpad.',
    lessonLearned: 'Circle non-standard prefixes (µ, m, k) in red before writing numerical application.',
    needsReview: true,
    reviewedTimes: 2,
  },
  {
    id: 'mstk_2',
    date: '2026-03-10',
    subjectId: 'sub_math',
    subjectName: 'Mathematics',
    exerciseRef: 'BAC 2023 - Complex Numbers Exercise',
    mistakeType: 'Formula Forgotten',
    errorDescription: 'Confused the rotation formula with homothety center translation: used (z\' - omega) = k*(z - omega) instead of e^(i*theta).',
    correctSolution: 'Rotation around center Omega(w) by angle theta is: z\' - w = e^(i*theta) * (z - w).',
    lessonLearned: 'Keep exponential form clear for turns/rotations and scalar k for dilations/homotheties.',
    needsReview: false,
    reviewedTimes: 3,
  },
  {
    id: 'mstk_3',
    date: '2026-03-12',
    subjectId: 'sub_sci',
    subjectName: 'Natural Sciences',
    exerciseRef: 'Ex 2 - Experimental Analysis: Enzymatic Kinetics',
    mistakeType: 'Question Misread',
    errorDescription: 'Described the graph without interpreting the active site denaturation under high temperatures above 60°C.',
    correctSolution: 'In scientific analysis: State reading -> Interpret causal biological mechanism (hydrogen bond disruption) -> Deduce function loss.',
    lessonLearned: 'Never stop at mere graph description; always link observations with molecular conformation.',
    needsReview: true,
    reviewedTimes: 1,
  },
];

const SAMPLE_FORMULAS: FormulaNote[] = [
  {
    id: 'fml_1',
    subjectId: 'sub_math',
    subjectName: 'Mathematics',
    unit: 'Complex Numbers',
    title: 'Euler & De Moivre Identity',
    latexOrRule: 'e^(i*theta) = cos(theta) + i*sin(theta)  ==>  (cos theta + i sin theta)^n = cos(n*theta) + i*sin(n*theta)',
    keyConditions: 'Valid for all real theta and integer n. Essential for linearizing powers of sin and cos.',
  },
  {
    id: 'fml_2',
    subjectId: 'sub_phys',
    subjectName: 'Physics',
    unit: 'Electrical Circuits (RC)',
    title: 'Differential Equation of Capacitor Charging',
    latexOrRule: 'u_c(t) + R*C * (du_c / dt) = E  ==>  u_c(t) = E * (1 - e^(-t / tau))',
    keyConditions: 'Initial condition: u_c(0) = 0. At t = tau, u_c(tau) = 0.63*E.',
  },
  {
    id: 'fml_3',
    subjectId: 'sub_phys',
    subjectName: 'Physics',
    unit: 'Nuclear Physics',
    title: 'Radioactive Decay Law & Half-Life',
    latexOrRule: 'N(t) = N_0 * e^(-lambda * t)  and  t_1/2 = ln(2) / lambda',
    keyConditions: 'Activity A(t) = lambda * N(t). 1 Becquerel = 1 disintegration/sec.',
  },
  {
    id: 'fml_4',
    subjectId: 'sub_math',
    subjectName: 'Mathematics',
    unit: 'Sequences & Induction',
    title: 'Sum of Geometric & Arithmetic Series',
    latexOrRule: 'Geometric: S_n = u_0 * (1 - q^n) / (1 - q)   |   Arithmetic: S_n = n * (u_1 + u_n) / 2',
    keyConditions: 'Geometric converges to u_0 / (1 - q) if |q| < 1.',
  },
];

interface BacStore {
  examDate: string; // Target BAC exam date
  branch: BacBranch;
  subjects: BacSubject[];
  mistakes: BacMistakeEntry[];
  formulas: FormulaNote[];
  studyPartners: { name: string; status: 'online' | 'focusing' | 'offline'; subject: string }[];

  setExamDate: (date: string) => void;
  setBranch: (branch: BacBranch) => void;
  toggleUnitCompleted: (subjectId: string, unitId: string) => void;
  updateSubjectGrade: (subjectId: string, current: number, target: number) => void;
  addMistake: (entry: Omit<BacMistakeEntry, 'id' | 'date' | 'reviewedTimes'>) => void;
  toggleMistakeReviewed: (id: string) => void;
  deleteMistake: (id: string) => void;
  addFormula: (formula: Omit<FormulaNote, 'id'>) => void;
  calculateWeightedAverage: () => { currentAverage: number; targetAverage: number; totalCoeff: number };
}

const savedBac = localStorage.getItem('elevate_bac_data');
const initialBac = savedBac ? JSON.parse(savedBac) : null;

export const useBacStore = create<BacStore>((set, get) => ({
  examDate: initialBac?.examDate || '2027-06-08',
  branch: initialBac?.branch || 'experimental_sciences',
  subjects: initialBac?.subjects || DEFAULT_SUBJECTS,
  mistakes: initialBac?.mistakes || SAMPLE_MISTAKES,
  formulas: initialBac?.formulas || SAMPLE_FORMULAS,
  studyPartners: [
    { name: 'Yacine K.', status: 'focusing', subject: 'Math - Complex Numbers' },
    { name: 'Sara M.', status: 'online', subject: 'Physics - RC Circuits' },
    { name: 'Nour B.', status: 'focusing', subject: 'Natural Science' },
    { name: 'Karim L.', status: 'offline', subject: 'Philosophy' },
  ],

  setExamDate: (date) => {
    set({ examDate: date });
    const current = get();
    localStorage.setItem('elevate_bac_data', JSON.stringify(current));
  },

  setBranch: (branch) => {
    set({ branch });
    const current = get();
    localStorage.setItem('elevate_bac_data', JSON.stringify(current));
  },

  toggleUnitCompleted: (subjectId, unitId) => {
    set((state) => {
      const updatedSubjects = state.subjects.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const newUnits = sub.units.map((u) =>
          u.id === unitId ? { ...u, completed: !u.completed } : u
        );
        const completedCount = newUnits.filter((u) => u.completed).length;
        const revPercent = Math.round((completedCount / newUnits.length) * 100);
        return {
          ...sub,
          units: newUnits,
          revisionPercentage: revPercent,
        };
      });
      const next = { ...state, subjects: updatedSubjects };
      localStorage.setItem('elevate_bac_data', JSON.stringify(next));
      return next;
    });
  },

  updateSubjectGrade: (subjectId, current, target) => {
    set((state) => {
      const updated = state.subjects.map((sub) =>
        sub.id === subjectId ? { ...sub, currentEstimatedGrade: current, targetGrade: target } : sub
      );
      const next = { ...state, subjects: updated };
      localStorage.setItem('elevate_bac_data', JSON.stringify(next));
      return next;
    });
  },

  addMistake: (entry) => {
    set((state) => {
      const newEntry: BacMistakeEntry = {
        ...entry,
        id: 'mstk_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        reviewedTimes: 0,
      };
      const next = { ...state, mistakes: [newEntry, ...state.mistakes] };
      localStorage.setItem('elevate_bac_data', JSON.stringify(next));
      return next;
    });
  },

  toggleMistakeReviewed: (id) => {
    set((state) => {
      const nextMistakes = state.mistakes.map((m) =>
        m.id === id
          ? {
              ...m,
              needsReview: !m.needsReview,
              reviewedTimes: m.needsReview ? m.reviewedTimes + 1 : m.reviewedTimes,
            }
          : m
      );
      const next = { ...state, mistakes: nextMistakes };
      localStorage.setItem('elevate_bac_data', JSON.stringify(next));
      return next;
    });
  },

  deleteMistake: (id) => {
    set((state) => {
      const next = { ...state, mistakes: state.mistakes.filter((m) => m.id !== id) };
      localStorage.setItem('elevate_bac_data', JSON.stringify(next));
      return next;
    });
  },

  addFormula: (formula) => {
    set((state) => {
      const newFormula: FormulaNote = {
        ...formula,
        id: 'fml_' + Date.now(),
      };
      const next = { ...state, formulas: [newFormula, ...state.formulas] };
      localStorage.setItem('elevate_bac_data', JSON.stringify(next));
      return next;
    });
  },

  calculateWeightedAverage: () => {
    const { subjects } = get();
    let currentWeightedSum = 0;
    let targetWeightedSum = 0;
    let totalCoeff = 0;

    subjects.forEach((s) => {
      currentWeightedSum += s.currentEstimatedGrade * s.coefficient;
      targetWeightedSum += s.targetGrade * s.coefficient;
      totalCoeff += s.coefficient;
    });

    const currentAverage = totalCoeff > 0 ? parseFloat((currentWeightedSum / totalCoeff).toFixed(2)) : 0;
    const targetAverage = totalCoeff > 0 ? parseFloat((targetWeightedSum / totalCoeff).toFixed(2)) : 0;

    return { currentAverage, targetAverage, totalCoeff };
  },
}));
