import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

try {
  Parse.setAsyncStorage(AsyncStorage);
} catch (e) {
}
Parse.initialize(
  "tgmoXRZm7PM2WHAdMuIFMT1tG2nxMibXqJxhyB5j",
  "mAcYVexyu2Y7vj1mI758Zp6IUkQoYOYumPcd0Akk"
);

Parse.serverURL = "https://parseapi.back4app.com/";

export default Parse;
