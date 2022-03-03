import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Appearance, AppearanceProvider } from "react-native-appearance";
import { useEffect, useState } from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import axios from "axios";
import moment from "moment";

export default function App() {
  const [userTheme, setUserTheme] = useState(Appearance.getColorScheme());
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  let theme = userTheme === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    theme = userTheme !== "light" ? lightTheme : darkTheme;
    setUserTheme(userTheme === "light" ? "dark" : "light");
  };

  const locationLoader = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Location permission is needed");
      return;
    }
    let location = await getCurrentPositionAsync();
    setLocation(location);
    const result = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?appid=8c93761f0cfd02f56a37c775dc01adf7&units=metric&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    );
    if (result.data) setWeather(result.data);
  };

  useEffect(() => {
    locationLoader();
  }, []);

  return (
    <AppearanceProvider>
      <View style={[global.wrapper, theme.surface]}>
        <View style={[global.header]}>
          <Text style={[theme.textColorAccent, global.textTitle]}>
            Weather App
          </Text>
          <TouchableOpacity style={global.themeSwitcher} onPress={toggleTheme}>
            <View style={[global.themeSwitcherInner, theme.themeSwitcherInner]}>
              <Text style={theme.textColorAccent}>
                {userTheme === "dark" && <Ionicons name="moon" size={18} />}
                {userTheme === "light" && <Ionicons name="sunny" size={18} />}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {weather && (
          <View style={global.weather}>
            <View style={[global.weatherIcon, theme.weatherIcon]}>
              <Image
                style={global.weatherIconImage}
                source={{
                  uri: "http://openweathermap.org/img/wn/10d@4x.png",
                }}
              />
            </View>
            <View style={global.weatherData}>
              <Text style={[global.textTitle, theme.textColorMain]}>
                {weather.name}, {weather.main.temp}&deg;C
              </Text>
            </View>
            <View style={global.weatherTime}>
              <Text
                style={[global.textBody, theme.textColorMain, global.regular]}
              >
                {moment(location.timestamp).format("DD.MM.YYYY HH:mm")}
              </Text>
            </View>
          </View>
        )}
        {errorMsg && (
          <View style={global.errorMsg}>
            <Text style={[theme.textColorError, global.textTitle]}>
              {errorMsg}
            </Text>
          </View>
        )}
        <StatusBar style={userTheme === "dark" ? "light" : "dark"} />
      </View>
    </AppearanceProvider>
  );
}

const global = StyleSheet.create({
  textBody: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
  },
  textLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "400",
  },
  textTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
  },
  regular: {
    fontWeight: "400",
  },
  medium: {
    fontWeight: "500",
  },
  bold: {
    fontWeight: "700",
  },
  wrapper: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "web" ? 16 : 42,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeSwitcher: {
    width: 32,
    height: 32,
    borderRadius: 20,
  },
  themeSwitcherInner: {
    width: 32,
    height: 32,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  weather: {
    alignItems: "center",
    justifyContent: "center",
  },
  weatherIcon: {
    width: 240,
    height: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 150,
    marginVertical: 40,
    borderWidth: 2,
    borderStyle: "solid",
  },
  weatherIconImage: {
    width: 200,
    height: 200,
  },
  weatherData: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  weatherTime: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  errorMsg: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: 60,
    paddingBottom: 60,
    textAlign: "center",
  },
});

const lightTheme = StyleSheet.create({
  surface: {
    backgroundColor: "#E4E4E7",
  },
  surfaceAccent: {
    backgroundColor: "#F4F4F5",
  },
  textColorMain: {
    color: "#27272A",
  },
  textColorAccent: {
    color: "#E17553",
  },
  textColorError: {
    color: "#F43F5E",
  },
  themeSwitcherInner: {
    backgroundColor: "#E4E4E7",
    borderColor: "#FAFAFA",
  },
  weatherIcon: {
    borderColor: "#FAFAFA",
  },
});

const darkTheme = StyleSheet.create({
  surface: {
    backgroundColor: "#18181B",
  },
  surfaceAccent: {
    backgroundColor: "#27272A",
  },
  textColorMain: {
    color: "#D4D4D8",
  },
  textColorAccent: {
    color: "#E17553",
  },
  textColorError: {
    color: "#FB7185",
  },
  themeSwitcherInner: {
    backgroundColor: "#18181B",
    borderColor: "#27272A",
  },
  weatherIcon: {
    borderColor: "#27272A",
  },
});
