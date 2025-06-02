import { getSavedWalks } from "@/utils/helpers";
import { createContext, useContext, useEffect, useState } from "react";

const TrackerContext = createContext({
  totalWalks: 0,
  totalTime: 0,
  walksToDisplay: [] as any[],
  trackedPaths: [] as any[],
  setTrackedPaths: (_paths: any[]) => {},
  isLoading: true,
  refreshSavedWalks: () => {},
});

export const useTracker = () => useContext(TrackerContext);

export const TrackerProvider = ({ children }: any) => {
  const [totalWalks, setTotalWalks] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [walksToDisplay, setWalksToDisplay] = useState<any[]>([]);
  const [trackedPaths, setTrackedPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSavedWalks = async () => {
    const savedWalks = await getSavedWalks();
    setWalksToDisplay(savedWalks);
    setTotalWalks(savedWalks.length);
    setTotalTime(
      savedWalks.reduce((acc: number, walk: any) => acc + walk.timeElapsed, 0)
    );
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSavedWalks();
  }, []);

  return (
    <TrackerContext.Provider
      value={{
        totalWalks,
        totalTime,
        walksToDisplay,
        trackedPaths,
        setTrackedPaths,
        isLoading,
        refreshSavedWalks: fetchSavedWalks,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};
