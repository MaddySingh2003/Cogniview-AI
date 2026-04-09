export type Question={
    type:"text"|"mcq"|"msq";
    question:string;
    options?:string[];
      correctAnswer?: string;
  correctAnswers?: string[];
  difficulty?: "easy" | "medium" | "hard";};


  export type Result={
    score:number;
    feedback:string[];
  };

export type FinalResult={
 averageScore: number;
  selectionProbability: string;
  verdict: string;
  answers: {
    question: string;
    score: number;
    feedback: string[];
  }[];   
}
