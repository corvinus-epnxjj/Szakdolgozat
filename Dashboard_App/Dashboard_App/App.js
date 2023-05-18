import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, ImageBackground } from 'react-native';
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
  const [bvin, setBvin] = useState([]);

  const [iphone, setIphone] = useState(0);
  const [s22, setS22] = useState(0);
  const [pixel, setPixel] = useState(0);
  const [oneplus, setOneplus] = useState(0);
  const [asus, setAsus] = useState(0);
  const [zfold, setZfold] = useState(0);

  const url = 'https://2c15-146-110-138-173.ngrok-free.app/DesktopModules/Hotcakes/API/rest/v1/orders';
  
  useEffect(() => {
    const fetchData = async () => {
      try {                
        const orders = await axios.get(url + '?key=1-89fe088e-4b8f-4762-8012-09251c42276c', {
          headers: {
            'Content-Type':'application/json'
          }
        });
        
        for (let i = 0; i < orders.data.Content.length; i++) {
          const currentBvin = orders.data.Content[i].bvin;
       
          if(!bvin.includes(currentBvin)) {        
            setBvin(array => [...array, currentBvin]);

            const prod = await axios.get(url + `/${currentBvin}?key=1-89fe088e-4b8f-4762-8012-09251c42276c`, {
              headers: {
                'Content-Type':'application/json'
              }
            });
          
            const quantity = prod.data.Content.Items[0].Quantity;

            switch (prod.data.Content.Items[0].ProductName) {
              case "iPhone 14 Pro":
                setIphone(prev => prev + quantity);
                break;
              case "Galaxy S22 Ultra":
                setS22(prev => prev + quantity);
                break;
              case "Pixel 7 Pro":
                setPixel(prev => prev + quantity);
                break;
              case "OnePlus 10T 5G":
                setOneplus(prev => prev + quantity);
                break;
              case "Asus Zenfone 9":
                setAsus(prev => prev + quantity);
                break;
              case "Galaxy Z Fold 4":
                setZfold(prev => prev + quantity);
                break;
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [bvin]);

  var sum = iphone + s22 + pixel + oneplus + asus + zfold;
  
  const items = [
    { label: "Válassz diagramot", value: "default" },
    { label: "Oszlopdiagram", value: "oszlopdiagram" },
  ];

  const barChart = {
    labels: ['iPhone 14 Pro', "Galaxy S22 Ultra", "Pixel 7 Pro", "OnePlus 10T 5G", "Asus Zenfone 9", "Galaxy Z Fold 4"],
    datasets: [
      {
        data: [iphone, s22, pixel, oneplus, asus, zfold],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      },
    ],
  };

  const generateChartData = (selectedValue) => {
    switch (selectedValue) {
      case "oszlopdiagram":
        return  <View>
                  <View style={styles.summary}>
                    <Image source={require('./assets/cart.png')} style={styles.cart}></Image>
                    <View style={{display: 'flex', flexDirection: 'column', marginLeft: 20}}>
                      <Text style={styles.sumText}>{sum}</Text>
                      <Text style={styles.sumText2}>Összes vásárlás (db)</Text>
                    </View>      
                  </View>
                  <BarChart
                    data={barChart}
                    width={Dimensions.get("window").width - 40}
                    height={370}
                    yAxisSuffix=" db"
                    yAxisInterval={1}
                    yLabelsOffset={25}
                    xLabelsOffset={-18}
                    fromZero
                    verticalLabelRotation={90}
                    segments={5}
                    chartConfig={{
                      backgroundColor: "#3c2a69",
                      backgroundGradientFrom: "#3c2a69",
                      backgroundGradientTo: "#3c2a69",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      barPercentage: 0.7,
                      propsForVerticalLabels: {
                        fontSize: 9,
                      }
                    }}
                    style={{
                      marginVertical: 20,
                      borderRadius: 16,
                    }}
                  />
                </View>
      default:
        return  <View style={{marginTop: '60%'}}>
                  <Text style={{color: 'white', fontSize: 20}}>Üdvözöljük az alkalmazásban,{'\n'}  kérjük válasszon diagramot!</Text>
                </View>;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
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
        {generateChartData(selectedValue)}
      </ScrollView>
      <View style={styles.imageFooter}>
        <ImageBackground source={require('./assets/gadGet_footer.jpg')} style={styles.imageFooter}>
          <Text style={{marginTop: 90 * ratio, color: 'white'}}>2023 Szorcsik István. Minden jog fenntartva.</Text>
        </ImageBackground>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2530',
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
    alignItems: 'center',
    marginTop: 'auto',
  },
  dropdown: {
    width: Dimensions.get("window").width - 50,
    backgroundColor: 'grey',
    color: 'white',
    fontWeight: 'bold',
  },
  summary: {
    height: 100,
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1A7A80',
    borderRadius: 36,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cart: {
    height: 55,
    width: 55,
  },
  sumText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },
  sumText2: {
    color: 'white',
  }
});