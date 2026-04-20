import { sub, startOfMonth, endOfMonth, eachDayOfInterval, format, getDate } from 'date-fns';

export interface TestScoreTrend {
  date: Date;
  testName: string;
  testId: string;
  score: number;
  maxScore: number;
  level: string;
}

export interface ActivityFrequency {
  date: Date;
  count: number;
}

// Generate mock test score trends for the past 90 days
export const generateTestScoreTrends = (): TestScoreTrend[] => {
  const trends: TestScoreTrend[] = [];
  const tests = [
    { name: 'DASS-21', id: 'dass-21', maxScore: 63 },
    { name: 'PHQ-9', id: 'phq-9', maxScore: 27 },
    { name: 'GAD-7', id: 'gad-7', maxScore: 21 },
  ];

  for (let i = 90; i >= 0; i--) {
    const date = sub(new Date(), { days: i });

    // Generate data for each test with some randomness - showing improvement trend
    if (i % 15 === 0) {
      // Tests taken every 15 days
      tests.forEach((test) => {
        // Create a slight improvement trend over time
        const improvementFactor = (90 - i) / 90; // Gets better as time progresses
        const baseScore = test.maxScore * 0.5; // Start at 50% of max score
        const variance = (Math.random() - 0.5) * test.maxScore * 0.2; // ±10% variance
        const score = Math.max(
          0,
          Math.round(baseScore - improvementFactor * baseScore * 0.3 + variance)
        );

        let level = 'Normal';
        if (score > test.maxScore * 0.75) level = 'Very Severe';
        else if (score > test.maxScore * 0.6) level = 'Severe';
        else if (score > test.maxScore * 0.4) level = 'Moderate';
        else if (score > test.maxScore * 0.2) level = 'Mild';

        trends.push({
          date,
          testName: test.name,
          testId: test.id,
          score,
          maxScore: test.maxScore,
          level,
        });
      });
    }
  }

  return trends;
};

// Generate mock diary activity frequency for the past 90 days
export const generateDiaryFrequency = (): ActivityFrequency[] => {
  const frequencies: ActivityFrequency[] = [];

  for (let i = 90; i >= 0; i--) {
    const date = sub(new Date(), { days: i });

    // 60% chance of writing diary, with varying frequencies
    const probability = Math.random();
    let count = 0;

    if (probability < 0.15) {
      count = 0; // No diary entry
    } else if (probability < 0.5) {
      count = 1; // 1 entry
    } else if (probability < 0.8) {
      count = 2; // 2 entries
    } else {
      count = 3; // 3 entries (busy day)
    }

    frequencies.push({
      date,
      count,
    });
  }

  return frequencies;
};

// Generate mock drawing activity frequency for the past 90 days
export const generateDrawingFrequency = (): ActivityFrequency[] => {
  const frequencies: ActivityFrequency[] = [];

  for (let i = 90; i >= 0; i--) {
    const date = sub(new Date(), { days: i });

    // 40% chance of drawing (less frequent than diary)
    const probability = Math.random();
    let count = 0;

    if (probability < 0.6) {
      count = 0; // No drawing
    } else if (probability < 0.85) {
      count = 1; // 1 drawing session
    } else {
      count = 2; // 2 drawing sessions
    }

    frequencies.push({
      date,
      count,
    });
  }

  return frequencies;
};

export const _testScoreTrends = generateTestScoreTrends();
export const _diaryFrequency = generateDiaryFrequency();
export const _drawingFrequency = generateDrawingFrequency();

// Helper function to get calendar heatmap data
export const getCalendarHeatmapData = (
  frequencyData: ActivityFrequency[],
  year: number,
  month: number
) => {
  const monthStart = new Date(year, month, 1);
  const monthEnd = endOfMonth(monthStart);
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return allDays.map((day) => {
    const activity = frequencyData.find(
      (f) =>
        f.date.getFullYear() === day.getFullYear() &&
        f.date.getMonth() === day.getMonth() &&
        f.date.getDate() === day.getDate()
    );

    return {
      date: day,
      count: activity?.count || 0,
    };
  });
};

// Get statistics
export const getActivityStatistics = (frequencyData: ActivityFrequency[]) => {
  const totalActivities = frequencyData.reduce((sum, f) => sum + f.count, 0);
  const daysWithActivity = frequencyData.filter((f) => f.count > 0).length;
  const avgPerDay = (totalActivities / frequencyData.length).toFixed(2);
  const maxPerDay = Math.max(...frequencyData.map((f) => f.count));

  return {
    totalActivities,
    daysWithActivity,
    avgPerDay,
    maxPerDay,
  };
};
