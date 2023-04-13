import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';

const win = Dimensions.get('window');
const ratio = win.width/817;

export default function App() { 

  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState(null);
  const [productName, setProductName] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await axios.get('https://2aea-146-110-197-146.ngrok-free.app/DesktopModules/Hotcakes/API/rest/v1/orders?key=1-89fe088e-4b8f-4762-8012-09251c42276c', {
          headers: {
            'content-type': 'application/json',
          }
        });

        setData(orders.data);

        const order = await axios.get(`https://2aea-146-110-197-146.ngrok-free.app/DesktopModules/Hotcakes/API/rest/v1/orders/${data.Content.bvin}?key=1-89fe088e-4b8f-4762-8012-09251c42276c`, {
          headers: {
            'content-type': 'application/json',
          }
        });

        setProductName(order.data.Content.Items.ProductName)
      } catch (error) {
        console.log(error);
      }
    };

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Chart 1", value: "chart1" },
    { label: "Chart 2", value: "chart2" },
    { label: "Chart 3", value: "chart3" },
  ];

  const generateChartData = (selectedValue) => {
    switch (selectedValue) {
      case "chart1":
        return {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            },
          ],
        };
      case "chart2":
        return {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [50, 30, 70, 40, 60, 20],
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            },
          ],
        };
      case "chart3":
        return {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [10, 20, 30, 40, 50, 60],
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            },
          ],
        };
      default:
        return null;
    }
  };

  const chartData = generateChartData(selectedValue);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/gadGet.jpg')} style={styles.imageHeader}></Image>
      <View style={{borderWidth: 2, borderColor: 'white', borderRadius: 5, marginTop: 10}}>
        <Picker
          selectedValue={selectedValue}
          style={styles.dropdown}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>     
      {selectedValue && (
        <View>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 40} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      )}
      <View style={styles.imageFooter}>
        <ImageBackground source={require('./assets/gadGet_footer.jpg')} style={styles.imageFooter}>
          <Text style={{marginTop: 90 * ratio, color: 'white'}}>2023 Szorcsik István. Minden jog fenntartva.</Text>
        </ImageBackground>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
  
  /*const MyComponent = () => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://e2dc-146-110-197-146.ngrok-free.app/DesktopModules/Hotcakes/API/rest/v1/orders?key=1-89fe088e-4b8f-4762-8012-09251c42276c', {
            headers: {
              'content-type': 'application/json',
            }
          });
          setData(response.data);
        } catch (error) {
          console.log(error);
        }
      };
  
      const interval = setInterval(fetchData, 5000);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <View>
        {data && data.Content.map(item => (
          <Text key={item.Id}>{item.bvin}</Text>
        ))}
      </View>
    );
  };
  
  export default MyComponent;*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2530',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    marginTop: 50,
  },
  imageHeader: {
    width: win.width,
    height: 232 * ratio,
  },
  imageFooter: {
    width: win.width,
    height: 232 * ratio,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    width: Dimensions.get("window").width - 50,
    backgroundColor: 'grey',
    color: 'white',
    fontWeight: 'bold',
  },
});