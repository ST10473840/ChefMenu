import React, { useState, useEffect, useRef } from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated, Alert, Button, Image
} from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', fontSize: 16, marginBottom: 20, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 6 },
  label: { fontSize: 16, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },

  splashText: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },

  courseBtn: { padding: 8, backgroundColor: '#555', borderRadius: 8, minWidth: 80, alignItems: 'center' },
  activeBtn: { backgroundColor: '#ff914d' },

  addBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },

  infoText: { color: '#999', textAlign: 'center', marginVertical: 2 },
  filterBtn: { padding: 8, backgroundColor: '#555', borderRadius: 8, minWidth: 70, alignItems: 'center' },
  activeFilter: { backgroundColor: '#ff914d' },

  option: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, paddingHorizontal: 15 },
  optionSelected: { backgroundColor: '#ff914d' },
  optionText: { color: '#333' },

  card: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, marginVertical: 5, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardFooter: { marginTop: 6, color: '#ff914d', fontWeight: '600' },

  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemFooter: { marginTop: 4, color: '#ff914d', fontWeight: '500' },
  actionBtn: { padding: 8, borderRadius: 6, marginTop: 8, width: '40%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
});

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'home' | 'payment'>('splash');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (screen === 'splash') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        setScreen('home');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [screen]);

  type MenuItem = {
    dish: string;
    desc: string;
    price: string;
    course: 'Starter' | 'Main' | 'Dessert';
  };

  const [dish, setDish] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<'Starter' | 'Main' | 'Dessert'>('Starter');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState<'All' | 'Starter' | 'Main' | 'Dessert'>('All');

  const addMenuItem = () => {
    if (dish && desc && price) {
      const newItem = { dish, desc, price, course };
      setMenu([...menu, newItem]);
      setDish('');
      setDesc('');
      setPrice('');
    } else {
      Alert.alert('Please fill all fields');
    }
  };

  const filteredMenu = filter === 'All' ? menu : menu.filter((item) => item.course === filter);

  const avgPrice =
    menu.length > 0
      ? (
          menu.reduce((sum, item) => sum + parseFloat(item.price), 0) / menu.length
        ).toFixed(2)
      : 0;
  const [cardName, setCardName] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const totalPrice = menu.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

if (screen === 'splash') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff914d' }]}>
        {/* Replace with your logo if you have one */}
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' }} style={{ width: 120, height: 120, marginBottom: 20 }} />
        <Text style={[styles.title, { color: '#fff' }]}>Chef's Menu App</Text>
        <Text style={[styles.subtitle, { color: '#fff' }]}>Loading...</Text>
      </View>
    );
  }

  if (screen === 'home') {
    return (
      <View style={[styles.container, { backgroundColor: '#333' }]}>
        <Text style={styles.title}>Welcome Chef </Text>

        <TextInput
          placeholder="Dish Name"
          placeholderTextColor="#ffffffff"
          style={styles.input}
          value={dish}
          onChangeText={setDish}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
        />
        <TextInput
          placeholder="Price"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <View style={styles.row}>
          {(['Starter', 'Main', 'Dessert'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.courseBtn, course === type && styles.activeBtn]}
              onPress={() => setCourse(type)}
            >
              <Text style={styles.btnText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addMenuItem}>
          <Text style={styles.btnText}>Add Dish</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 15 }}>
          <Text style={styles.infoText}>Total Dishes: {menu.length}</Text>
          <Text style={styles.infoText}>Average Price: R{avgPrice}</Text>
        </View>

        <View style={styles.row}>
          {(['All', 'Starter', 'Main', 'Dessert'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterBtn, filter === type && styles.activeFilter]}
              onPress={() => setFilter(type)}
            >
              <Text style={styles.btnText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredMenu}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.dish}</Text>
              <Text style={{ color: '#333' }}>{item.desc}</Text>
              <Text style={styles.cardFooter}>
                {item.course} — R{item.price}
              </Text>
            </View>
          )}
        />

        <Text style={styles.total}>Total: R{totalPrice.toFixed(2)}</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2196F3' }]} onPress={() => setScreen('payment')}>
            <Text style={styles.btnText}>Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#f44336' }]} onPress={() => setMenu([])}>
            <Text style={styles.btnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screen === 'payment') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Payment Summary</Text>
        <Text style={styles.subtitle}>Total Dishes: {menu.length}</Text>

        <FlatList
          data={menu}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.dish}</Text>
              <Text>{item.course} — R{item.price}</Text>
            </View>
          )}
        />

        <Text style={styles.total}>Total Sales: R{totalPrice.toFixed(2)}</Text>
        <Button title="Record Payment" color="#3d60fdff" onPress={() => Alert.alert('Success', 'Payment recorded successfully!')} />
        <Button title="Back to Menu" color="#d80b0bff" onPress={() => setScreen('home')} />
      </View>
    );
  }
}
