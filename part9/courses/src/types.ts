interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface DescribedCoursePart extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends DescribedCoursePart {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends DescribedCoursePart {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends DescribedCoursePart {
  name: "Random course";
  difficulty: string;
}

export type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CoursePartFour;

