import Colors from "@/constants/Colors";
import { Tabs } from "expo-router";
import { History, Chrome as Home } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray[200],
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="medical"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History color={color} size={30} />,
        }}
      />
    </Tabs>
  );
}
