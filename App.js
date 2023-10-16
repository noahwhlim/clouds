import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default App = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});
  const [city, setCity] = useState("Error");
  // const [postalCode, setPostalCode] = useState(95051);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    let cityVar = ""
    let postalCodeVar = 0
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const currentCoords = await Location.getCurrentPositionAsync({});
    console.log("currentCoords: ", currentCoords);

    const currentLocation = await Location.reverseGeocodeAsync({
      longitude: currentCoords.coords.longitude,
      latitude: currentCoords.coords.latitude,
    }).then(data => {
      setCity(data[0].city);
      cityVar = data[0].city

      console.log("city supposed to set to: ", data[0].city)
      console.log("city useState actually: ", city)
      console.log("cityVar: ", cityVar)

      // setPostalCode(parseInt(data[0].postalCode));
      postalCodeVar = parseInt(data[0].postalCode)

      console.log("postalCode supposed to set to: ", data[0].postalCode)
      // console.log("postalCode useState actually", postalCode)
      console.log("postalCodeVar: ", postalCodeVar)
    })
    getWeather(postalCodeVar);
    console.log("currentLocation: ", currentLocation);

    // if (currentLocation) {
    //   console.log("currentLocation[0].city: ", currentLocation[0].city) 
    //   console.log("currentLocation[0].postalCode: ", currentLocation[0].postalCode)
    //   setCity(currentLocation[0].city);
    //   setPostalCode(parseInt(currentLocation[0].postalCode));
    //   console.log("city: ", city);
    //   console.log("postalCode: ", postalCode);

    //   getWeather();
    // }
  };

  const getWeather = async (pCode) => {
    const endpoint = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${pCode}&days=4&aqi=no&alerts=no`;

    const response = await fetch(endpoint);
    if (response) {
      try {
        console.log("get response success");
        const json = await response.json();
        console.log("convert response to json success");
        console.log("json: ", json)
        setResult(json);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("get response failed");
    }
    setLoading(false);
    console.log("loading set to false")
    return;
  };

  return (
    <SafeAreaView className="flex-1 bg-black min-h-screen">
      {!loading ? (
        <View className="flex-1 bg-black min-h-screen">
          <StatusBar style="light" />

          {/* <TextInput className="bg-black text-white m-4 p-2 rounded-lg border border-white opacity-70" placeholder='Search' placeholderTextColor="#6B7280"></TextInput> */}

          {/* green */}
            <View id="body" className="bg-black flex-1">
                <View className="bg-black py-4 items-center justify-center">
                    <Text className="text-4xl font-bold text-white mr-4">
                        {city ? city : "bla"}
                    </Text>
                </View>

                {/* blue */}
                <View className="bg-black items-center justify-center pt-20 pb-12">
                    <View className="mr-2">
                        <Ionicons name="sunny-outline" size={150} color="white" />
                    </View>
                </View>

                {/* red */}
                <View className="bg-black items-center justify-end py-10">
                    <Text className="text-white font-bold text-7xl">{result ? Math.round(result.current.temp_c) : ""} C</Text>
                    {/* <Text className="text-white font-bold text-7xl">? C</Text> */}

                    <View className="flex flex-row space-x-10 p-2 ">
                        <View className="flex flex-row">
                            <View className="flex bg-transparent pt-[4px] mr-1">
                                <Ionicons name="arrow-up-outline" size={20} color="white" />
                            </View>
                            <Text className="text-white text-xl font-bold">{result ? Math.round(result.forecast.forecastday[0].day.maxtemp_c) : "?"} C</Text>
                            {/* <Text className="text-white text-xl font-bold">{"?"}</Text> */}
                        </View>

                        <View className="flex flex-row">
                            <View className="flex bg-transparent pt-[4px] mr-1">
                                <Ionicons
                                    name="arrow-down-outline"
                                    size={20}
                                    color="white"
                                />
                            </View>
                            <Text className="text-white text-xl font-bold">{result ? Math.round(result.forecast.forecastday[0].day.mintemp_c) : "?"} C</Text>
                            {/* <Text className="text-white text-xl font-bold">{"?"}</Text> */}
                        </View>
                    </View>
                </View>

                {/* purple */}
                <View className="bg-black justify-center py-4 overflow-x-auto flex flex-row space-x-8">
                    {result.forecast.forecastday.slice(1).map((item) => (
                        <View className="border-2 border-white py-4 px-4 rounded-lg" key={item}>

                            <View className="flex flex-row">
                                <View className="flex bg-transparent pt-[4px] mr-1">
                                <Ionicons name="thermometer-outline" size={18} color="white"/>
                                </View>
                                <Text className="text-xl text-white">{item.day ? Math.round(item.day.avgtemp_c) : "?"} C</Text>
                            </View>

                            <View className="flex flex-row">
                                <View className="flex bg-transparent pt-[4px] mr-1">
                                <Ionicons name="arrow-up-outline" size={18} color="white"/>
                                </View>
                                <Text className="text-xl text-white">{item.day ? Math.round(item.day.maxtemp_c) : "?"} C</Text>
                            </View>

                            <View className="flex flex-row">
                                <View className="flex bg-transparent pt-[4px] mr-1">
                                <Ionicons name="arrow-down-outline" size={18} color="white"/>
                                </View>
                                <Text className="text-xl text-white">{item.day ? Math.round(item.day.mintemp_c) : ""} C</Text>
                            </View>

                        </View>
                    ))}
              
                </View>
            </View>
        </View>
        ) : (
        <View className="flex-1 bg-blue-300 min-h-screen items-center justify-center">
            <Text className="text-5xl text-white">
                Loading...
            </Text>
        </View>
        )}
    </SafeAreaView>
  );
};
