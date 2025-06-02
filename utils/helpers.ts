import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
const WALKS_KEY = 'saved_walks';

export const saveWalk = async (pathArr: any[], timeElapsed: any) =>  {
    try {
      const existingWalks = await getSavedWalks();
      
      const timeStamp = new Date();
      const formattedTime = moment(timeStamp).format("hh:mm A");
      const formattedDate = moment(timeStamp).format("DD/MM");

      const newWalk = {
        pathArr,
        timeElapsed,
        formattedTime,
        formattedDate,
      };

      console.log(newWalk);

      const updatedWalks = [...existingWalks, newWalk];
      
      await AsyncStorage.setItem(WALKS_KEY, JSON.stringify(updatedWalks));
      console.log('Walk saved successfully');
    } catch (error) {
      console.error('Error saving walk:', error);
    }
};

export const getSavedWalks = async () => {
  try {
    const walksData = await AsyncStorage.getItem(WALKS_KEY);
    return walksData ? JSON.parse(walksData) : [];


  } catch (error) {
    console.error('Error getting walks:', error);
    return [];
  }
};

export const clearAllWalks = async () => {
    try {
      await AsyncStorage.removeItem(WALKS_KEY);
      console.log('All walks cleared');

    } catch (error) {
      console.error('Error clearing walks:', error);
    }
  };

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return `${mins}m ${secs}s`;
};

export const formatTimer = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;
};
