import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

type StatisticType = 'referer';

type StatisticData = {
  label: string;
  count: number;
};

type Statistics = {
  [key in StatisticType]: StatisticData[];
};

const useStatistics = (statistics: StatisticType[]): Statistics => {
  const [data, setData] = useState<Statistics>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = statistics.map((statistic) =>
          posthog.api.get('/insights', {
            formula: 'count()',
            breakdown: `properties["$${statistic}"]`,
            interval: 'week',
          })
        );

        const responses = await Promise.all(requests);

        const updatedData: Statistics = {};
        responses.forEach((response, index) => {
          const statistic = statistics[index];
          updatedData[statistic] = response.result;
        });

        setData(updatedData);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchData();

    return () => {
      posthog.capture('$pageleave');
    };
  }, [statistics]);

  return data;
};

export default useStatistics;
